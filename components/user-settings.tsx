'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SettingsIcon } from '@/components/icons';
import { useTheme } from 'next-themes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface UserSettingsProps {
  user?: any;
}

export function UserSettings({ user }: UserSettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (open && user) {
      fetchUserSettings();
    }
  }, [open, user]);

  const fetchUserSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setHasApiKey(data.hasApiKey);
      }
    } catch (error) {
      console.error('Failed to fetch user settings:', error);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ openrouterApiKey: apiKey.trim() }),
      });

      if (response.ok) {
        setHasApiKey(true);
        setApiKey('');
        toast.success('API key saved successfully');
        setOpen(false);
      } else {
        toast.error('Failed to save API key');
      }
    } catch (error) {
      toast.error('Failed to save API key');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="size-8 p-0">
          <SettingsIcon size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Settings</AlertDialogTitle>
          <AlertDialogDescription>
            Configure your preferences and API settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          {/* Theme Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="theme" className="text-right">
              Theme
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* API Key Configuration */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apikey" className="text-right">
              API Key
            </Label>
            <div className="col-span-3 space-y-2">
              {hasApiKey ? (
                <div className="text-sm text-muted-foreground">
                  API key configured ✓
                </div>
              ) : (
                <div className="text-sm text-red-500">
                  No API key configured
                </div>
              )}
              <Input
                id="apikey"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Configure your AI provider API key for chat functionality
              </p>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <Button 
            onClick={handleSaveApiKey} 
            disabled={isLoading || !apiKey.trim()}
          >
            {isLoading ? 'Saving...' : 'Save API Key'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}