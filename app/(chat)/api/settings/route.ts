import { auth } from '@/app/(auth)/auth';
import { updateUserOpenRouterApiKey, getUserOpenRouterApiKey } from '@/lib/db/queries';
import { ChatSDKError } from '@/lib/errors';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError('unauthorized:api').toResponse();
    }

    const { openrouterApiKey } = await request.json();

    if (!openrouterApiKey || typeof openrouterApiKey !== 'string') {
      return new ChatSDKError('bad_request:api').toResponse();
    }

    await updateUserOpenRouterApiKey(session.user.id, openrouterApiKey);

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    return new ChatSDKError('bad_request:api').toResponse();
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError('unauthorized:api').toResponse();
    }

    const openrouterApiKey = await getUserOpenRouterApiKey(session.user.id);

    return Response.json({ 
      openrouterApiKey: openrouterApiKey ? '***' : null,
      hasApiKey: !!openrouterApiKey
    });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    return new ChatSDKError('bad_request:api').toResponse();
  }
}