import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { ChatSDKError } from '@/lib/errors';

export const maxDuration = 60;

interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
  top_provider: {
    max_completion_tokens: number;
  };
  per_request_limits?: {
    prompt_tokens: number | string;
    completion_tokens: number | string;
  };
}

interface ProcessedModel {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  pricing: {
    prompt: number;
    completion: number;
  };
  maxTokens: number;
  limits?: {
    prompt_tokens: number | string;
    completion_tokens: number | string;
  };
}

interface OpenRouterResponse {
  data: OpenRouterModel[];
}

// Cache models for 1 hour to reduce API calls
let modelsCache: {
  data: ProcessedModel[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError('unauthorized:api').toResponse();
    }

    // Check cache first
    if (modelsCache && Date.now() - modelsCache.timestamp < CACHE_DURATION) {
      return NextResponse.json({ models: modelsCache.data });
    }

    // Fetch models from OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch models from OpenRouter:', response.statusText);
      return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
    }

    const data: OpenRouterResponse = await response.json();
    
    // Filter and process models for display
    const processedModels: ProcessedModel[] = data.data
      .filter(model => !model.id.includes('free') || model.id.includes('llama') || model.id.includes('gemma'))
      .map(model => ({
        id: model.id,
        name: model.name,
        description: model.description || 'No description available',
        contextLength: model.context_length,
        pricing: {
          prompt: parseFloat(model.pricing.prompt) * 1000000, // Convert to per million tokens
          completion: parseFloat(model.pricing.completion) * 1000000,
        },
        maxTokens: model.top_provider?.max_completion_tokens || 4096,
        limits: model.per_request_limits,
      }))
      .sort((a, b) => a.pricing.prompt - b.pricing.prompt); // Sort by price

    // Update cache
    modelsCache = {
      data: processedModels,
      timestamp: Date.now(),
    };

    return NextResponse.json({ models: processedModels });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}