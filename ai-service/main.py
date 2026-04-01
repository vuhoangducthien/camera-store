from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Union

app = FastAPI(title="Camera Store AI Service")

# Dev-friendly CORS. In production, restrict to trusted origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProductIn(BaseModel):
    id: str
    name: str
    category: Optional[str] = None
    brand: Optional[str] = None
    popularity: Optional[float] = 0


class RecommendRequest(BaseModel):
    user_id: Union[str, int]
    # These are optional signals from backend for rule-based ranking.
    purchased_product_ids: Optional[List[str]] = None
    rented_product_ids: Optional[List[str]] = None
    popular_product_ids: Optional[List[str]] = None
    # Candidate products to rank. Backend provides these from DB.
    products: List[ProductIn]


class ProductOut(BaseModel):
    id: str
    name: str


class RecommendResponse(BaseModel):
    recommended_products: List[ProductOut]


class ChatRequest(BaseModel):
    message: str
    user_id: Optional[Union[str, int]] = None


class ChatResponse(BaseModel):
    reply: str


class SentimentRequest(BaseModel):
    text: str


class SentimentResponse(BaseModel):
    sentiment: str


def _normalize_text(text: str) -> str:
    return (text or "").strip().lower()


def _rank_recommendations(
    products: List[ProductIn],
    purchased_ids: List[str],
    rented_ids: List[str],
    popular_ids: List[str],
) -> List[ProductIn]:
    # Rule-based recommendation:
    # - Boost products that match user's preferred category/brand from purchase/rental history
    # - Boost popular products (many buys/rentals)
    # - Exclude products the user already purchased/rented
    interacted = set(purchased_ids) | set(rented_ids)

    purchased_set = set(purchased_ids)
    rented_set = set(rented_ids)
    popular_set = set(popular_ids)

    preferred_categories = set()
    preferred_brands = set()
    by_id: Dict[str, ProductIn] = {p.id: p for p in products}

    for pid in purchased_set | rented_set:
        p = by_id.get(pid)
        if not p:
            continue
        if p.category:
            preferred_categories.add(p.category.strip().lower())
        if p.brand:
            preferred_brands.add(p.brand.strip().lower())

    scored: List[tuple[float, ProductIn]] = []
    for p in products:
        if p.id in interacted:
            continue

        score = 0.0

        cat = (p.category or "").strip().lower()
        br = (p.brand or "").strip().lower()

        if cat and cat in preferred_categories:
            score += 3.0
        if br and br in preferred_brands:
            score += 2.0

        if p.id in popular_set:
            score += 1.5

        try:
            score += float(p.popularity or 0) * 0.02
        except Exception:
            pass

        if score > 0:
            scored.append((score, p))

    scored.sort(key=lambda x: x[0], reverse=True)
    ranked = [p for _, p in scored]

    if len(ranked) < 8:
        leftovers = [p for p in products if p.id not in interacted and p not in ranked]
        leftovers.sort(key=lambda p: float(p.popularity or 0), reverse=True)
        ranked.extend(leftovers)

    return ranked


@app.post("/recommend", response_model=RecommendResponse)
async def recommend(request: RecommendRequest):
    # Keep API simple and deterministic: backend supplies candidates + signals, AI service ranks them.
    purchased = request.purchased_product_ids or []
    rented = request.rented_product_ids or []
    popular = request.popular_product_ids or []

    ranked = _rank_recommendations(request.products, purchased, rented, popular)

    recommended = [ProductOut(id=p.id, name=p.name) for p in ranked[:8]]
    return RecommendResponse(recommended_products=recommended)


@app.post("/chatbot", response_model=ChatResponse)
async def chatbot(request: ChatRequest):
    # Keyword-based advisor (no heavy NLP).
    msg = _normalize_text(request.message)

    rules = [
        (["vlog", "quay vlog", "làm vlog"], "Bạn quay vlog thì Sony ZV-E10 là lựa chọn rất phù hợp (nhỏ gọn, lấy nét tốt, tối ưu quay)."),
        (["chụp ảnh", "nhiếp ảnh", "ảnh đẹp"], "Bạn chụp ảnh thì cân nhắc Canon EOS M50 (dễ dùng) hoặc các dòng Canon R / Sony A7 tuỳ ngân sách."),
        (["chuyên nghiệp", "pro", "full frame"], "Nhu cầu chuyên nghiệp: Sony A7 series hoặc Canon EOS R series là lựa chọn mạnh về chất lượng ảnh/video."),
        (["giá rẻ", "rẻ", "tiết kiệm", "ít tiền"], "Ngân sách tiết kiệm: ưu tiên máy entry-level, hoặc máy đã qua sử dụng như Canon 200D / Nikon D5600."),
    ]

    for keywords, reply in rules:
        if any(k in msg for k in keywords):
            return ChatResponse(reply=reply)

    return ChatResponse(
        reply="Bạn cho mình biết bạn ưu tiên quay video hay chụp ảnh, ngân sách khoảng bao nhiêu và mức kinh nghiệm (mới/chuyên) nhé?"
    )


@app.post("/sentiment", response_model=SentimentResponse)
async def sentiment(request: SentimentRequest):
    # Keyword-based sentiment for quick UX feedback (positive/neutral/negative).
    text = _normalize_text(request.text)

    positive_keywords = [
        "good",
        "great",
        "amazing",
        "excellent",
        "perfect",
        "love",
        "nice",
        "tuyệt",
        "tốt",
        "xuất sắc",
        "đỉnh",
        "hài lòng",
        "đáng tiền",
    ]
    negative_keywords = [
        "bad",
        "terrible",
        "awful",
        "poor",
        "hate",
        "worst",
        "tệ",
        "rất tệ",
        "kém",
        "thất vọng",
        "không hài lòng",
        "lỗi",
        "hỏng",
    ]

    if any(k in text for k in positive_keywords) and not any(k in text for k in negative_keywords):
        return SentimentResponse(sentiment="positive")
    if any(k in text for k in negative_keywords) and not any(k in text for k in positive_keywords):
        return SentimentResponse(sentiment="negative")
    if any(k in text for k in positive_keywords) and any(k in text for k in negative_keywords):
        return SentimentResponse(sentiment="neutral")
    return SentimentResponse(sentiment="neutral")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
