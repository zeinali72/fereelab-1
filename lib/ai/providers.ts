import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

// Create OpenRouter provider using OpenAI-compatible format
function createOpenRouterProvider(apiKey: string) {
  const provider = openai({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: apiKey,
  });

  return customProvider({
    languageModels: {
      'chat-model': provider('anthropic/claude-3-haiku'),
      'chat-model-reasoning': wrapLanguageModel({
        model: provider('anthropic/claude-3-sonnet'),
        middleware: extractReasoningMiddleware({ tagName: 'think' }),
      }),
      'title-model': provider('anthropic/claude-3-haiku'),
      'artifact-model': provider('anthropic/claude-3-haiku'),
    },
  });
}

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : createOpenRouterProvider(process.env.OPENROUTER_API_KEY || '');

// Function to create provider with user's API key
export function createUserProvider(userApiKey: string) {
  if (isTestEnvironment) {
    return myProvider;
  }
  return createOpenRouterProvider(userApiKey);
}
