import api from './axios';

export async function getMatchIntros(client, matches) {
  try {
    const response = await api.post('/api/ai/intros', { client, matches });
    const intros = response?.data?.intros;
    if (!Array.isArray(intros)) {
      throw new Error('Invalid intros response');
    }
    return intros;
  } catch (error) {
    console.error('AI intro generation failed:', error);
    return matches.map(() => "Introduction not available — AI service temporarily unavailable.");
  }
}
