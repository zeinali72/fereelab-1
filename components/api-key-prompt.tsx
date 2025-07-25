'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, SkipForward, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKeyPromptProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function ApiKeyPrompt({ onComplete, onSkip }: ApiKeyPromptProps) {
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ openrouterApiKey: apiKey.trim() }),
      });

      if (response.ok) {
        toast.success('API key saved successfully!');
        onComplete();
      } else {
        toast.error('Failed to save API key');
      }
    } catch (error) {
      console.error('Failed to save API key:', error);
      toast.error('Failed to save API key');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-dvh w-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-lg mx-4"
      >
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center"
            >
              <Key className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <CardTitle className="text-2xl font-bold">One More Step!</CardTitle>
              <CardDescription className="text-base mt-2">
                To start chatting, you&apos;ll need an OpenRouter API key. This gives you access to various AI models.
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Get your free API key
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Visit OpenRouter to create a free account and get your API key. Many models offer free usage tiers.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://openrouter.ai/keys', '_blank')}
                    className="text-xs h-7"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Get API Key
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="space-y-3"
            >
              <Label htmlFor="apiKey" className="text-sm font-medium">
                OpenRouter API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-or-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !saving && apiKey.trim()) {
                    handleSaveKey();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Your API key is encrypted and stored securely.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex gap-3 pt-2"
            >
              <Button
                onClick={handleSaveKey}
                disabled={saving || !apiKey.trim()}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save & Continue'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onSkip}
                disabled={saving}
                className="px-6"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-xs text-center text-muted-foreground"
            >
              You can always add your API key later in the settings panel.
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}