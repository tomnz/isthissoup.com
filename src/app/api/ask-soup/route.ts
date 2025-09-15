import { openai } from 'ai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return Response.json({ error: 'Question is required' }, { status: 400 });
    }

    const result = await streamText({
      model: openai('gpt-4o'),
      system: `You are the ultimate soup authority. Your job is to determine whether something is soup or not, and explain your reasoning.

Be thoughtful, knowledgeable, and sometimes playfully philosophical about what constitutes soup. Consider factors like:
- Liquid base or broth
- Temperature (hot/cold soups exist)
- Ingredients and preparation method
- Cultural context and culinary tradition
- Texture and consistency

Give a clear YES or NO answer first, then provide an engaging explanation. Be confident in your assessment but acknowledge edge cases when they exist. Keep responses informative but conversational.`,
      prompt: `Is ${question} soup?`,
      maxTokens: 300,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in soup API:', error);
    return Response.json(
      { error: 'Failed to process your soup question' },
      { status: 500 }
    );
  }
}