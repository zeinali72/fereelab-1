import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

// Function to add missing supportedUrls property for compatibility
function makeModelV2Compatible(model: any) {
  if (!model.supportedUrls) {
    model.supportedUrls = {};
  }
  return model;
}

// Create provider using OpenRouter API
function createProviderWithApiKey(apiKey: string) {
  // Create OpenRouter provider using createOpenAI
  const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: apiKey,
  });

  // Create language models and ensure compatibility
  const baseModel = openrouter('meta-llama/llama-3.1-8b-instruct:free');
  const chatModelInstance = makeModelV2Compatible(baseModel);
  
  const provider = customProvider({
    languageModels: {
      'chat-model': chatModelInstance,
      'chat-model-reasoning': chatModelInstance, // Simplified for now to avoid version issues
      'title-model': chatModelInstance,
      'artifact-model': chatModelInstance,
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
  : (() => {
      const openrouter = createOpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY || '',
      });

      const baseModel = openrouter('meta-llama/llama-3.1-8b-instruct:free');
      const chatModelInstance = makeModelV2Compatible(baseModel);

      return customProvider({
        languageModels: {
          'chat-model': chatModelInstance,
          'chat-model-reasoning': chatModelInstance, // Simplified for now
          'title-model': chatModelInstance,
          'artifact-model': chatModelInstance,
        },
      });
    })();

// Function to create provider with user's API key
// Uses OpenRouter API with the user's provided API key
export function createUserProvider(userApiKey: string) {
  if (isTestEnvironment) {
    return myProvider;
  }
  return createProviderWithApiKey(userApiKey);
}
