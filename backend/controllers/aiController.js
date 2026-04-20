// Controller for SkillX AI chat using Gemini.
const { GoogleGenerativeAI } = require('@google/generative-ai');

// POST /api/ai/chat
// Accepts { message } and returns { reply }.
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: 'GEMINI_API_KEY is not configured' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent(message.trim());
    const reply = result?.response?.text?.() || 'I could not generate a response right now.';

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to process AI chat request' });
  }
};

module.exports = {
  chatWithAI
};
