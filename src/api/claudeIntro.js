import api from './axios';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export async function getMatchIntros(client, matches) {
  const prompt = `You are a professional matrimonial matchmaker writing personalised introductions.

Given the client profile and 5 potential matches below, write a 2-sentence introduction for each match explaining why they are a good fit. Focus on shared values, compatibility, and genuine connection — not just demographics.

Return ONLY a valid JSON array of 5 strings. No extra text, no markdown.

Client: ${JSON.stringify(client)}
Matches: ${JSON.stringify(matches)}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;
    return JSON.parse(text);
  } catch (error) {
    console.error('AI intro generation failed:', error);
    return matches.map(() => "Introduction not available — AI service temporarily unavailable.");
  }
}
