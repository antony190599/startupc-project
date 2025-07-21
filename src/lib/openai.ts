import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
    apiKey,
  });

/**
 * Send a prompt to OpenAI and get a response
 * @param prompt The prompt string to send
 * @returns The response text from OpenAI
 */

export async function sendPrompt(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Eres un asistente experto en análisis de startups. Responde en español.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 512,
      temperature: 0.7,
    });
    return completion.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('Error sending prompt to OpenAI:', error);
    throw new Error('No se pudo obtener una respuesta de OpenAI');
  }
}
