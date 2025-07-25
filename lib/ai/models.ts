export const DEFAULT_CHAT_MODEL: string = 'meta-llama/llama-3.1-8b-instruct:free';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

// Default models available when marketplace is not accessible
export const chatModels: Array<ChatModel> = [
  {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B (Free)',
    description: 'Fast and capable model for general chat',
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct:free',
    name: 'Llama 3.1 70B (Free)',
    description: 'Larger model with enhanced reasoning capabilities',
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Gemma 2 9B (Free)',
    description: 'Google\'s efficient instruction-tuned model',
  },
  {
    id: 'microsoft/wizardlm-2-8x22b',
    name: 'WizardLM 2 8x22B',
    description: 'Microsoft\'s advanced reasoning model',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'OpenAI\'s efficient and cost-effective model',
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Anthropic\'s fast and affordable model',
  },
];

// Model categories for marketplace filtering
export const MODEL_CATEGORIES = {
  FREE: 'free',
  PREMIUM: 'premium',
  REASONING: 'reasoning',
  CODING: 'coding',
  CREATIVE: 'creative',
} as const;

export type ModelCategory = typeof MODEL_CATEGORIES[keyof typeof MODEL_CATEGORIES];
