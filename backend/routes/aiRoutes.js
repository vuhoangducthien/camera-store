const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getAiRecommendations, aiChatbot, aiSentiment } = require('../controllers/aiController');

const router = express.Router();

// Recommendation is user-specific, so it requires auth.
router.get('/recommend', protect, getAiRecommendations);

// Chatbot can be used without login.
router.post('/chatbot', aiChatbot);

// Sentiment is used during review flow (user must be logged in in current UI).
router.post('/sentiment', protect, aiSentiment);

module.exports = router;
