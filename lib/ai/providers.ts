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

  // Create a dynamic language model function
  const createModel = (modelId: string) => {
    return makeModelV2Compatible(openrouter(modelId));
  };

  // Create a map to store created models
  const modelCache = new Map<string, any>();

  // Create models for common IDs
  const commonModels = {
    // Legacy model IDs for backward compatibility
    'chat-model': createModel('meta-llama/llama-3.1-8b-instruct:free'),
    'chat-model-reasoning': createModel('meta-llama/llama-3.1-8b-instruct:free'),
    'title-model': createModel('meta-llama/llama-3.1-8b-instruct:free'),
    'artifact-model': createModel('meta-llama/llama-3.1-8b-instruct:free'),
    
    // Default marketplace models
    'meta-llama/llama-3.1-8b-instruct:free': createModel('meta-llama/llama-3.1-8b-instruct:free'),
    'meta-llama/llama-3.1-70b-instruct:free': createModel('meta-llama/llama-3.1-70b-instruct:free'),
    'google/gemma-2-9b-it:free': createModel('google/gemma-2-9b-it:free'),
    'microsoft/wizardlm-2-8x22b': createModel('microsoft/wizardlm-2-8x22b'),
    'openai/gpt-4o-mini': createModel('openai/gpt-4o-mini'),
    'anthropic/claude-3-haiku': createModel('anthropic/claude-3-haiku'),
  };

  // Store common models in cache
  Object.entries(commonModels).forEach(([id, model]) => {
    modelCache.set(id, model);
  });

  const provider = customProvider({
    languageModels: commonModels,
  });

  // Override the languageModel method to support dynamic model creation
  const originalLanguageModel = provider.languageModel;
  provider.languageModel = (modelId: string) => {
    // Check if model is already cached
    if (modelCache.has(modelId)) {
      return modelCache.get(modelId);
    }
    
    // Create new model dynamically
    const newModel = createModel(modelId);
    modelCache.set(modelId, newModel);
    
    // Add to the provider's models
    (provider as any).languageModels[modelId] = newModel;
    
    return newModel;
  };

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

      const createModel = (modelId: string) => {
        return makeModelV2Compatible(openrouter(modelId));
      };

      const modelCache = new Map<string, any>();

      const commonModels = {
        'chat-model': createModel('meta-llama/llama-3.1-8b-instruct:free'),
        'chat-model-reasoning': createModel('meta-llama/llama-3.1-8b-instruct:free'),
        'title-model': createModel('meta-llama/llama-3.1-8b-instruct:free'),
        'artifact-model': createModel('meta-llama/llama-3.1-8b-instruct:free'),
        
        // Default marketplace models
        'meta-llama/llama-3.1-8b-instruct:free': createModel('meta-llama/llama-3.1-8b-instruct:free'),
        'meta-llama/llama-3.1-70b-instruct:free': createModel('meta-llama/llama-3.1-70b-instruct:free'),
        'google/gemma-2-9b-it:free': createModel('google/gemma-2-9b-it:free'),
      };

      Object.entries(commonModels).forEach(([id, model]) => {
        modelCache.set(id, model);
      });

      const provider = customProvider({
        languageModels: commonModels,
      });

      // Override the languageModel method
      const originalLanguageModel = provider.languageModel;
      provider.languageModel = (modelId: string) => {
        // Check if model is already cached
        if (modelCache.has(modelId)) {
          return modelCache.get(modelId);
        }
        
        // Create new model dynamically
        const newModel = createModel(modelId);
        modelCache.set(modelId, newModel);
        
        // Add to the provider's models
        (provider as any).languageModels[modelId] = newModel;
        
        return newModel;
      };

      return provider;
    })();

// Function to create provider with user's API key
// Uses OpenRouter API with the user's provided API key
export function createUserProvider(userApiKey: string) {
  if (isTestEnvironment) {
    return myProvider;
  }
  return createProviderWithApiKey(userApiKey);
}
