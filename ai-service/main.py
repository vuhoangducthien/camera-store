from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random
from textblob import TextBlob

app = FastAPI(title="Camera Store AI Service")

# Request/Response models
class RecommendRequest(BaseModel):
    user_id: str
    history: List[str]  # list of product ids viewed/purchased

class RecommendResponse(BaseModel):
    recommendations: List[str]  # list of product ids

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str

class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: str  # positive, neutral, negative

# Dummy recommendation: just return random product IDs
@app.post("/recommend", response_model=RecommendResponse)
async def recommend(request: RecommendRequest):
    # In production, use collaborative filtering or content-based
    # Here we simulate with random product ids
    dummy_products = ["prod1", "prod2", "prod3", "prod4", "prod5"]
    random.shuffle(dummy_products)
    return RecommendResponse(recommendations=dummy_products[:3])

# Simple rule-based chatbot
@app.post("/chatbot", response_model=ChatResponse)
async def chatbot(request: ChatRequest):
    msg = request.message.lower()
    if "vlog" in msg or "quay vlog" in msg:
        reply = "Sony ZV-E10 là lựa chọn phù hợp cho vlog với tính năng lấy nét nhanh và micro tốt."
    elif "chụp ảnh" in msg or "nhiếp ảnh" in msg:
        reply = "Bạn có thể tham khảo dòng Canon EOS R hoặc Nikon Z series."
    elif "giá rẻ" in msg:
        reply = "Các mẫu máy ảnh DSLR cũ như Canon 200D hoặc Nikon D5600 có giá tốt."
    else:
        reply = "Xin lỗi, tôi chưa hiểu câu hỏi. Bạn có thể mô tả nhu cầu cụ thể hơn?"
    return ChatResponse(reply=reply)

# Sentiment analysis using TextBlob
@app.post("/sentiment", response_model=SentimentResponse)
async def sentiment(request: SentimentRequest):
    blob = TextBlob(request.text)
    polarity = blob.sentiment.polarity
    if polarity > 0.1:
        sentiment = "positive"
    elif polarity < -0.1:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    return SentimentResponse(sentiment=sentiment)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)