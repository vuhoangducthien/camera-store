const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

async function postToAi(path, payload) {
  // Node 18+ has global fetch. We keep a short timeout so the app doesn't hang if AI is down.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);

  try {
    const res = await fetch(`${AI_SERVICE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const error = new Error(text || `AI service error (${res.status})`);
      error.status = 502;
      throw error;
    }

    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

function localSentiment(text) {
  // Fallback if AI service is not available.
  const t = String(text || '').toLowerCase();
  const positive = ['good', 'great', 'amazing', 'excellent', 'perfect', 'love', 'nice', 'tuyệt', 'tốt', 'xuất sắc', 'đỉnh', 'hài lòng', 'đáng tiền'];
  const negative = ['bad', 'terrible', 'awful', 'poor', 'hate', 'worst', 'tệ', 'kém', 'thất vọng', 'không hài lòng', 'lỗi', 'hỏng'];

  const hasPos = positive.some((k) => t.includes(k));
  const hasNeg = negative.some((k) => t.includes(k));
  if (hasPos && !hasNeg) return 'positive';
  if (hasNeg && !hasPos) return 'negative';
  return 'neutral';
}

function localChatbotReply(message) {
  // Fallback if AI service is not available.
  const msg = String(message || '').toLowerCase();
  const rules = [
    { keywords: ['vlog', 'quay vlog', 'làm vlog'], reply: 'Bạn quay vlog thì Sony ZV-E10 là lựa chọn rất phù hợp (nhỏ gọn, lấy nét tốt, tối ưu quay).' },
    { keywords: ['chụp ảnh', 'nhiếp ảnh', 'ảnh đẹp'], reply: 'Bạn chụp ảnh thì cân nhắc Canon EOS M50 (dễ dùng) hoặc các dòng Canon R / Sony A7 tuỳ ngân sách.' },
    { keywords: ['chuyên nghiệp', 'pro', 'full frame'], reply: 'Nhu cầu chuyên nghiệp: Sony A7 series hoặc Canon EOS R series là lựa chọn mạnh về chất lượng ảnh/video.' },
    { keywords: ['giá rẻ', 'rẻ', 'tiết kiệm', 'ít tiền'], reply: 'Ngân sách tiết kiệm: ưu tiên máy entry-level, hoặc máy đã qua sử dụng như Canon 200D / Nikon D5600.' },
  ];

  for (const r of rules) {
    if (r.keywords.some((k) => msg.includes(k))) return r.reply;
  }

  return 'Bạn cho mình biết bạn ưu tiên quay video hay chụp ảnh, ngân sách khoảng bao nhiêu và mức kinh nghiệm (mới/chuyên) nhé?';
}

function buildPopularityMap(orderAgg, rentalAgg) {
  // Merge buy/rent counts into one popularity signal.
  const map = new Map();

  for (const row of orderAgg) {
    const qty = Number(row?._sum?.quantity || 0);
    if (!row.productId) continue;
    map.set(row.productId, (map.get(row.productId) || 0) + qty);
  }

  for (const row of rentalAgg) {
    const qty = Number(row?._sum?.quantity || 0);
    if (!row.productId) continue;
    map.set(row.productId, (map.get(row.productId) || 0) + qty);
  }

  return map;
}

function rankLocal(products, { interactedIds, preferredCategories, preferredBrands, popularIds, popularityMap }) {
  // Local rule-based ranker with the same rules as AI service.
  const interacted = new Set(interactedIds);
  const popular = new Set(popularIds);
  const cats = new Set(preferredCategories.map((c) => String(c).trim().toLowerCase()).filter(Boolean));
  const brands = new Set(preferredBrands.map((b) => String(b).trim().toLowerCase()).filter(Boolean));

  const scored = [];
  for (const p of products) {
    if (!p?.id || interacted.has(p.id)) continue;
    let score = 0;
    const cat = String(p.category || '').trim().toLowerCase();
    const br = String(p.brand || '').trim().toLowerCase();
    if (cat && cats.has(cat)) score += 3;
    if (br && brands.has(br)) score += 2;
    if (popular.has(p.id)) score += 1.5;
    score += (popularityMap.get(p.id) || 0) * 0.02;
    scored.push({ score, product: p });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.product);
}

// GET /api/ai/recommend
const getAiRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Signals:
    // - user's purchase history (orders)
    // - user's rental history (rentals)
    // - popularity (all users buy/rent counts)
    const [orders, rentals, orderAgg, rentalAgg] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        select: { items: { select: { productId: true } } },
      }),
      prisma.rental.findMany({
        where: { userId },
        select: { items: { select: { productId: true } } },
      }),
      prisma.orderItem.groupBy({ by: ['productId'], _sum: { quantity: true } }),
      prisma.rentalItem.groupBy({ by: ['productId'], _sum: { quantity: true } }),
    ]);

    const purchasedProductIds = Array.from(
      new Set(
        orders.flatMap((o) => (o.items || []).map((it) => it.productId).filter(Boolean))
      )
    );
    const rentedProductIds = Array.from(
      new Set(
        rentals.flatMap((r) => (r.items || []).map((it) => it.productId).filter(Boolean))
      )
    );

    const interactedIds = Array.from(new Set([...purchasedProductIds, ...rentedProductIds]));

    const interactedProducts = interactedIds.length
      ? await prisma.product.findMany({
          where: { id: { in: interactedIds } },
          select: { category: true, brand: true },
        })
      : [];

    const preferredCategories = Array.from(new Set(interactedProducts.map((p) => p.category).filter(Boolean)));
    const preferredBrands = Array.from(new Set(interactedProducts.map((p) => p.brand).filter(Boolean)));

    const popularityMap = buildPopularityMap(orderAgg, rentalAgg);
    const popularIds = Array.from(popularityMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([id]) => id);

    const candidates = await prisma.product.findMany({
      where: {
        // Candidate pool: same category/brand as user's history + popular products.
        OR: [
          preferredCategories.length ? { category: { in: preferredCategories } } : undefined,
          preferredBrands.length ? { brand: { in: preferredBrands } } : undefined,
          popularIds.length ? { id: { in: popularIds } } : undefined,
        ].filter(Boolean),
        ...(interactedIds.length ? { id: { notIn: interactedIds } } : {}),
      },
      include: { images: true },
      take: 80,
      orderBy: { createdAt: 'desc' },
    });

    if (candidates.length === 0) {
      const fallback = await prisma.product.findMany({ include: { images: true }, take: 8, orderBy: { createdAt: 'desc' } });
      return res.json({ recommended_products: fallback });
    }

    const aiPayload = {
      user_id: userId,
      purchased_product_ids: purchasedProductIds,
      rented_product_ids: rentedProductIds,
      popular_product_ids: popularIds,
      products: candidates.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        brand: p.brand,
        popularity: popularityMap.get(p.id) || 0,
      })),
    };

    let result;
    try {
      result = await postToAi('/recommend', aiPayload);
    } catch {
      // If AI service is down, we still return recommendations using local rules.
      const ranked = rankLocal(candidates, {
        interactedIds,
        preferredCategories,
        preferredBrands,
        popularIds,
        popularityMap,
      }).slice(0, 8);
      return res.json({ recommended_products: ranked });
    }

    const recommendedIds = Array.isArray(result?.recommended_products)
      ? result.recommended_products.map((p) => p.id).filter(Boolean)
      : [];

    const byId = new Map(candidates.map((p) => [p.id, p]));
    const recommended = recommendedIds.map((id) => byId.get(id)).filter(Boolean);

    if (recommended.length < 8) {
      const existing = new Set(recommended.map((p) => p.id));
      for (const p of candidates) {
        if (recommended.length >= 8) break;
        if (!existing.has(p.id)) recommended.push(p);
      }
    }

    res.json({ recommended_products: recommended.slice(0, 8) });
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/chatbot
const aiChatbot = async (req, res, next) => {
  try {
    const message = String(req.body?.message || '').trim();
    if (!message) return res.status(400).json({ message: 'message is required' });

    try {
      const data = await postToAi('/chatbot', { message, user_id: req.user?.id });
      return res.json({ reply: data.reply });
    } catch {
      return res.json({ reply: localChatbotReply(message) });
    }
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/sentiment
const aiSentiment = async (req, res, next) => {
  try {
    const text = String(req.body?.text || '');
    if (!text.trim()) return res.status(400).json({ message: 'text is required' });

    try {
      const data = await postToAi('/sentiment', { text });
      return res.json({ sentiment: data.sentiment });
    } catch {
      return res.json({ sentiment: localSentiment(text) });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAiRecommendations, aiChatbot, aiSentiment };
