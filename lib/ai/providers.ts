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

// Create provider using OpenRouter API
function createProviderWithApiKey(apiKey: string) {
  // Create OpenRouter provider with custom base URL and API key
  const openrouterProvider = openai({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: apiKey,
  });
  
  const provider = customProvider({
    languageModels: {
      'chat-model': openrouterProvider('meta-llama/llama-3.1-8b-instruct:free'),
      'chat-model-reasoning': wrapLanguageModel({
        model: openrouterProvider('meta-llama/llama-3.1-8b-instruct:free'),
        middleware: extractReasoningMiddleware({ tagName: 'think' }),
      }),
      'title-model': openrouterProvider('meta-llama/llama-3.1-8b-instruct:free'),
      'artifact-model': openrouterProvider('meta-llama/llama-3.1-8b-instruct:free'),
    },
  });

  return provider;
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
  : customProvider({
      languageModels: {
        'chat-model': openai({
          baseURL: 'https://openrouter.ai/api/v1',
          apiKey: process.env.OPENROUTER_API_KEY,
        })('meta-llama/llama-3.1-8b-instruct:free'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openai({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY,
          })('meta-llama/llama-3.1-8b-instruct:free'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openai({
          baseURL: 'https://openrouter.ai/api/v1',
          apiKey: process.env.OPENROUTER_API_KEY,
        })('meta-llama/llama-3.1-8b-instruct:free'),
        'artifact-model': openai({
          baseURL: 'https://openrouter.ai/api/v1',
          apiKey: process.env.OPENROUTER_API_KEY,
        })('meta-llama/llama-3.1-8b-instruct:free'),
      },
    });

// Function to create provider with user's API key
// Uses OpenRouter API with the user's provided API key
export function createUserProvider(userApiKey: string) {
  if (isTestEnvironment) {
    return myProvider;
  }
  return createProviderWithApiKey(userApiKey);
}
