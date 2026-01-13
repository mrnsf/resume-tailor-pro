// DeepSeek API Integration for Resume Tailoring

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = 'sk-103aa226e0d04ac28c9ec5a083dae50e';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekChoice {
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

interface DeepSeekResponse {
  id: string;
  choices: DeepSeekChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface DeepSeekOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' };
}

export async function callDeepSeek(
  messages: DeepSeekMessage[],
  options: DeepSeekOptions = {}
): Promise<string> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: options.model || 'deepseek-chat',
      messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.max_tokens ?? 4096,
      response_format: options.response_format,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
  }

  const data: DeepSeekResponse = await response.json();
  return data.choices[0].message.content;
}

export async function callDeepSeekJSON<T>(
  messages: DeepSeekMessage[]
): Promise<T> {
  const content = await callDeepSeek(messages, {
    response_format: { type: 'json_object' },
  });
  return JSON.parse(content) as T;
}

// Test the API connection
export async function testDeepSeekConnection(): Promise<boolean> {
  try {
    const response = await callDeepSeek([
      {
        role: 'user',
        content: 'Say "connected" in one word.',
      },
    ]);
    return response.toLowerCase().includes('connected');
  } catch (error) {
    console.error('DeepSeek connection test failed:', error);
    return false;
  }
}
