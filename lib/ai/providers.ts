import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

// Create provider - for now using xAI as the base
// In a full implementation, this would be extended to support OpenRouter
function createProviderWithApiKey(apiKey: string) {
  // Store the original API key
  const originalApiKey = process.env.XAI_API_KEY;
  
  // Temporarily set the API key
  process.env.XAI_API_KEY = apiKey;
  
  const provider = customProvider({
    languageModels: {
      'chat-model': xai('grok-2-vision-1212'),
      'chat-model-reasoning': wrapLanguageModel({
        model: xai('grok-3-mini-beta'),
        middleware: extractReasoningMiddleware({ tagName: 'think' }),
      }),
      'title-model': xai('grok-2-1212'),
      'artifact-model': xai('grok-2-1212'),
    },
    imageModels: {
      'small-model': xai.imageModel('grok-2-image'),
    },
  });

  // Restore the original API key
  if (originalApiKey) {
    process.env.XAI_API_KEY = originalApiKey;
  } else {
    delete process.env.XAI_API_KEY;
  }

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
        'chat-model': xai('grok-2-vision-1212'),
        'chat-model-reasoning': wrapLanguageModel({
          model: xai('grok-3-mini-beta'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': xai('grok-2-1212'),
        'artifact-model': xai('grok-2-1212'),
      },
      imageModels: {
        'small-model': xai.imageModel('grok-2-image'),
      },
    });

// Function to create provider with user's API key
// For demonstration, we'll use the user's key with xAI
// In production, this would be modified to use OpenRouter or other providers
export function createUserProvider(userApiKey: string) {
  if (isTestEnvironment) {
    return myProvider;
  }
  return createProviderWithApiKey(userApiKey);
}
