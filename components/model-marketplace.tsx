'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Filter, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModelData {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  pricing: {
    prompt: number;
    completion: number;
  };
  maxTokens: number;
  limits?: any;
}

interface ModelMarketplaceProps {
  selectedModelId: string;
  onModelSelect: (modelId: string) => void;
  className?: string;
}

export function ModelMarketplace({ 
  selectedModelId, 
  onModelSelect, 
  className 
}: ModelMarketplaceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'context'>('price');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');

  const selectedModel = useMemo(() => 
    models.find(model => model.id === selectedModelId), 
    [models, selectedModelId]
  );

  useEffect(() => {
    if (isOpen && models.length === 0) {
      fetchModels();
    }
  }, [isOpen]);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/models');
      if (response.ok) {
        const data = await response.json();
        setModels(data.models || []);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedModels = useMemo(() => {
    let filtered = models;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price
    if (priceFilter === 'free') {
      filtered = filtered.filter(model => model.pricing.prompt === 0);
    } else if (priceFilter === 'paid') {
      filtered = filtered.filter(model => model.pricing.prompt > 0);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.pricing.prompt - b.pricing.prompt;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'context':
          return b.contextLength - a.contextLength;
        default:
          return 0;
      }
    });

    return filtered;
  }, [models, searchTerm, priceFilter, sortBy]);

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}/M tokens`;
  };

  const formatContextLength = (length: number) => {
    if (length >= 1000000) return `${(length / 1000000).toFixed(1)}M`;
    if (length >= 1000) return `${(length / 1000).toFixed(0)}K`;
    return length.toString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
            className
          )}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {selectedModel?.name || 'Select Model'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Model Marketplace
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Sort by Price</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="context">Sort by Context</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={(value: any) => setPriceFilter(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                <SelectItem value="free">Free Only</SelectItem>
                <SelectItem value="paid">Paid Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Models Grid */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading models...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                {filteredAndSortedModels.map((model) => (
                  <Card 
                    key={model.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedModelId === model.id && "ring-2 ring-primary"
                    )}
                    onClick={() => {
                      onModelSelect(model.id);
                      setIsOpen(false);
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base line-clamp-1">
                            {model.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">
                            {model.description}
                          </CardDescription>
                        </div>
                        {selectedModelId === model.id && (
                          <Badge variant="default" className="ml-2">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {formatPrice(model.pricing.prompt)}
                          </span>
                          <span className="text-xs">Input</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {formatPrice(model.pricing.completion)}
                          </span>
                          <span className="text-xs">Output</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {formatContextLength(model.contextLength)}
                          </span>
                          <span className="text-xs">Context</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}