import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/intros', auth, async (req, res) => {
  try {
    const { client, matches } = req.body;

    if (!client || !Array.isArray(matches) || matches.length === 0) {
      return res.status(400).json({ message: 'client and matches are required' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ message: 'AI service not configured' });
    }

    const prompt = `You are a professional matrimonial matchmaker writing personalised introductions.

Given the client profile and potential matches below, write a 2-sentence introduction for each match explaining why they are a good fit. Focus on shared values, compatibility, and genuine connection, not just demographics.

Return ONLY a valid JSON array of strings with exactly ${matches.length} items. No extra text, no markdown.

Client: ${JSON.stringify(client)}
Matches: ${JSON.stringify(matches)}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        message: 'AI provider request failed',
        details: data?.error?.message || 'Unknown AI provider error'
      });
    }

    const text = data?.content?.[0]?.text;
    if (!text) {
      return res.status(502).json({ message: 'AI provider returned empty response' });
    }

    let intros;
    try {
      intros = JSON.parse(text);
    } catch {
      return res.status(502).json({ message: 'AI response format invalid' });
    }

    if (!Array.isArray(intros)) {
      return res.status(502).json({ message: 'AI response is not an array' });
    }

    res.json({ intros });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate AI intros' });
  }
});

export default router;