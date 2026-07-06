const { GoogleGenAI } = require('@google/genai');
const { geminiApiKey } = require('../config/env');
const { buildIssueNotification } = require('../utils/issueMessage');

async function generateNotificationMessage(event) {
  const apiKey = geminiApiKey || process.env.GEMINI_KEY || process.env.GEMINI_API_KEY || '';

  if (!apiKey) {
    return buildIssueNotification(event);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Here's a JSON object containing data received from a GitHub issue webhook. Generate a cool, meaningful Discord message. Content: ${JSON.stringify(event, null, 2)}. Use a short, polished tone and return only the message that should be posted to Discord.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return text.trim();
    }
  } catch (error) {
    console.warn('Falling back to local issue message generation.', error.message);
  }

  return buildIssueNotification(event);
}

module.exports = {
  generateNotificationMessage,
};
