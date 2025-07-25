'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';
import { ApiKeyPrompt } from '@/components/api-key-prompt';

import { register, type RegisterActionState } from '../actions';
import { toast } from '@/components/toast';
import { useSession } from 'next-auth/react';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: 'idle',
    },
  );

  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === 'user_exists') {
      toast({ type: 'error', description: 'Account already exists!' });
    } else if (state.status === 'failed') {
      toast({ type: 'error', description: 'Failed to create account!' });
    } else if (state.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'Failed validating your submission!',
      });
    } else if (state.status === 'success') {
      toast({ type: 'success', description: 'Account created successfully!' });

      setIsSuccessful(true);
      updateSession();
      
      // Show API key prompt after successful registration
      setShowApiKeyPrompt(true);
    }
  }, [state, updateSession]);

  const handleApiKeyComplete = () => {
    setShowApiKeyPrompt(false);
    router.push('/');
    router.refresh();
  };

  const handleSkipApiKey = () => {
    setShowApiKeyPrompt(false);
    router.push('/');
    router.refresh();
  };

  if (showApiKeyPrompt) {
    return (
      <ApiKeyPrompt
        onComplete={handleApiKeyComplete}
        onSkip={handleSkipApiKey}
      />
    );
  }

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl"
      >
        <div className="p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-4 text-center mb-8"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground">Create Account</h3>
            <p className="text-sm text-muted-foreground">
              Join thousands of users chatting with AI
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <AuthForm action={handleSubmit} defaultEmail={email}>
              <SubmitButton isSuccessful={isSuccessful}>
                {isSuccessful ? 'Creating account...' : 'Create Account'}
              </SubmitButton>
              <p className="text-center text-sm text-muted-foreground mt-6">
                {'Already have an account? '}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in
                </Link>
                {' instead.'}
              </p>
            </AuthForm>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
