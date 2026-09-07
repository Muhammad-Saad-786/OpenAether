// src/pages/ModelsPage.jsx
import { useState, useEffect } from 'react';
import {
  Search,
  Cpu,
  Zap,
  Globe,
  CheckCircle,
  XCircle,
  Loader2,
  GitCompare,
  TestTube2,
  Trophy,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';

// All available models in OpenAether
const availableModels = [
  // OpenRouter Models
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenRouter',
    contextWindow: '128K',
    speed: 'Fast',
    free: false,
    bestFor: 'Best overall quality',
    rating: 5,
    description: 'Powerful and efficient model for general tasks and coding.',
  },
  {
    id: 'google/gemma-4-26b-a4b-it:free',
    name: 'Gemma 4 26B',
    provider: 'OpenRouter',
    contextWindow: '262K',
    speed: 'Fast',
    free: true,
    bestFor: 'Coding & reasoning',
    rating: 4,
    description: 'Efficient MoE model for coding and reasoning.',
  },
  {
    id: 'google/gemma-4-31b-it:free',
    name: 'Gemma 4 31B',
    provider: 'OpenRouter',
    contextWindow: '262K',
    speed: 'Medium',
    free: true,
    bestFor: 'Complex reasoning',
    rating: 4,
    description: "Google's multimodal model with strong reasoning.",
  },
  {
    id: 'z-ai/glm-5.2:free',
    name: 'GLM 5.2',
    provider: 'OpenRouter',
    contextWindow: '256K',
    speed: 'Medium',
    free: true,
    bestFor: 'Long context',
    rating: 4,
    description: 'Large-scale reasoning model for complex tasks.',
  },
  {
    id: 'minimax/minimax-m3:free',
    name: 'MiniMax M3',
    provider: 'OpenRouter',
    contextWindow: '1M',
    speed: 'Fast',
    free: true,
    bestFor: 'Long documents',
    rating: 4,
    description: 'Multimodal model with 1M token context.',
  },
  {
    id: 'nvidia/nemotron-3.5-lightning:free',
    name: 'Nemotron 3.5',
    provider: 'OpenRouter',
    contextWindow: '128K',
    speed: 'Very Fast',
    free: true,
    bestFor: 'Quick responses',
    rating: 3,
    description: 'Lightning-fast model for quick responses.',
  },

  // Groq Models
  {
    id: 'openai/gpt-oss-20b',
    name: 'GPT-OSS 20B',
    provider: 'Groq',
    contextWindow: '128K',
    speed: 'Very Fast',
    free: true,
    bestFor: 'Best for coding',
    rating: 5,
    description: 'Best balance of speed and quality for coding tasks.',
  },
  {
    id: 'openai/gpt-oss-120b',
    name: 'GPT-OSS 120B',
    provider: 'Groq',
    contextWindow: '128K',
    speed: 'Medium',
    free: true,
    bestFor: 'Complex code',
    rating: 5,
    description: 'Highest quality model for complex code generation.',
  },
  {
    id: 'groq/compound',
    name: 'Groq Compound',
    provider: 'Groq',
    contextWindow: '128K',
    speed: 'Fast',
    free: true,
    bestFor: 'Agentic tasks',
    rating: 4,
    description: 'Built for multi-step agentic workflows.',
  },
  {
    id: 'groq/compound-mini',
    name: 'Compound Mini',
    provider: 'Groq',
    contextWindow: '128K',
    speed: 'Very Fast',
    free: true,
    bestFor: 'Quick tasks',
    rating: 3,
    description: 'Fastest model for simple tasks.',
  },
  {
    id: 'qwen/qwen3.6-27b',
    name: 'Qwen 3.6 27B',
    provider: 'Groq',
    contextWindow: '128K',
    speed: 'Fast',
    free: true,
    bestFor: 'Coding',
    rating: 4,
    description: 'Good for code generation and analysis.',
  },
  {
    id: 'qwen/qwen3.8-27b',
    name: 'Qwen 3.8 27B',
    provider: 'Groq',
    contextWindow: '128K',
    speed: 'Fast',
    free: true,
    bestFor: 'Coding',
    rating: 4,
    description: 'Latest Qwen model for coding tasks.',
  },
  {
    id: 'canopylabs/orpheus-v1-english',
    name: 'Orpheus English',
    provider: 'Groq',
    contextWindow: '32K',
    speed: 'Very Fast',
    free: true,
    bestFor: 'English tasks',
    rating: 3,
    description: 'Fast model for English language tasks.',
  },
];

export function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [testingModel, setTestingModel] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [comparePrompt, setComparePrompt] = useState('');
  const [showCompareResults, setShowCompareResults] = useState(false);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [bestModel, setBestModel] = useState(null);
  const [comparing, setComparing] = useState(false);

  const user = useAuthStore((state) => state.user);

  const providers = ['all', 'OpenRouter', 'Groq'];

  const filteredModels = availableModels.filter((model) => {
    const matchesSearch =
      model.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = selectedProvider === 'all' || model.provider === selectedProvider;
    return matchesSearch && matchesProvider;
  });

  const handleTestModel = async (modelId) => {
    setTestingModel(modelId);
    try {
      // Get API key based on model provider
      const modelData = availableModels.find((m) => m.id === modelId);
      const provider = modelData?.provider?.toLowerCase();

      const { data: apiKeyData, error: keyError } = await supabase
        .from('api_keys')
        .select('api_key_encrypted')
        .eq('user_id', user.id)
        .eq('provider', provider)
        .eq('is_active', true)
        .single();

      if (keyError || !apiKeyData) {
        toast.error(`No ${provider} API key found. Add it in Settings.`);
        return;
      }

      const apiUrl =
        provider === 'groq'
          ? 'https://api.groq.com/openai/v1/chat/completions'
          : 'https://openrouter.ai/api/v1/chat/completions';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKeyData.api_key_encrypted}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: 'Say OK' }],
          max_tokens: 10,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setTestResults((prev) => ({
          ...prev,
          [modelId]: { success: false, error: data.error.message },
        }));
        toast.error(`${modelData?.name} failed: ${data.error.message}`);
      } else {
        setTestResults((prev) => ({
          ...prev,
          [modelId]: { success: true, response: data.choices[0].message.content },
        }));
        toast.success(`${modelData?.name} is working!`);
      }
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [modelId]: { success: false, error: error.message },
      }));
      toast.error('Failed to test model');
    } finally {
      setTestingModel(null);
    }
  };

  const toggleCompare = (modelId) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(modelId)) {
        return prev.filter((id) => id !== modelId);
      }
      if (prev.length >= 3) {
        toast.warning('Maximum 3 models for comparison');
        return prev;
      }
      return [...prev, modelId];
    });
  };

  const handleCompare = async () => {
    if (selectedForCompare.length < 2) {
      toast.warning('Select at least 2 models to compare');
      return;
    }
    if (!comparePrompt.trim()) {
      toast.warning('Enter a prompt to compare');
      return;
    }

    setComparing(true);
    setShowCompareResults(true);
    setComparisonResults([]);
    setBestModel(null);

    const results = [];

    for (const modelId of selectedForCompare) {
      const modelData = availableModels.find((m) => m.id === modelId);
      const provider = modelData?.provider?.toLowerCase();

      try {
        const { data: apiKeyData } = await supabase
          .from('api_keys')
          .select('api_key_encrypted')
          .eq('user_id', user.id)
          .eq('provider', provider)
          .eq('is_active', true)
          .single();

        if (!apiKeyData) {
          results.push({
            model: modelId,
            modelName: modelData?.name,
            provider: modelData?.provider,
            success: false,
            error: `No ${provider} API key`,
          });
          continue;
        }

        const apiUrl =
          provider === 'groq'
            ? 'https://api.groq.com/openai/v1/chat/completions'
            : 'https://openrouter.ai/api/v1/chat/completions';

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKeyData.api_key_encrypted}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelId,
            messages: [{ role: 'user', content: comparePrompt }],
            max_tokens: 200,
          }),
        });

        const data = await response.json();

        if (data.error) {
          results.push({
            model: modelId,
            modelName: modelData?.name,
            provider: modelData?.provider,
            success: false,
            error: data.error.message,
          });
        } else {
          const content = data.choices[0].message.content;
          results.push({
            model: modelId,
            modelName: modelData?.name,
            provider: modelData?.provider,
            success: true,
            response: content,
            responseLength: content.length,
            rating: modelData?.rating || 3,
          });
        }
      } catch (error) {
        results.push({
          model: modelId,
          modelName: modelData?.name,
          provider: modelData?.provider,
          success: false,
          error: error.message,
        });
      }

      // Small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setComparisonResults(results);

    // Determine best model (successful + highest rating + longest response)
    const successfulResults = results.filter((r) => r.success);
    if (successfulResults.length > 0) {
      const best = successfulResults.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return (b.responseLength || 0) - (a.responseLength || 0);
      })[0];
      setBestModel(best);
    }

    setComparing(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">AI Models</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore and test free AI models from OpenRouter and Groq.
        </p>
      </div>

      {/* Compare Mode Banner */}
      {compareMode && (
        <div className="mb-8 rounded-2xl border bg-card p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Compare Models</h2>
            <p className="text-sm text-muted-foreground">
              Select 2-3 models and enter a prompt to compare their responses.
            </p>
          </div>
          <div className="mb-4">
            <Input
              placeholder="Enter a prompt to compare..."
              value={comparePrompt}
              onChange={(e) => setComparePrompt(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="gradient" onClick={handleCompare} disabled={comparing}>
              {comparing ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <GitCompare className="size-4 mr-2" />
              )}
              Compare ({selectedForCompare.length} selected)
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCompareMode(false);
                setSelectedForCompare([]);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 overflow-x-auto">
            {providers.map((provider) => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                  selectedProvider === provider
                    ? 'bg-aether-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                {provider === 'all' ? 'All' : provider}
              </button>
            ))}
          </div>
          <Button
            variant={compareMode ? 'gradient' : 'outline'}
            size="sm"
            onClick={() => setCompareMode(!compareMode)}
            className="shrink-0"
          >
            <GitCompare className="size-4 mr-2" />
            Compare
          </Button>
        </div>
      </div>

      {/* Models Grid */}
      {filteredModels.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No models found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModels.map((model) => {
            const testResult = testResults[model.id];
            const isSelected = selectedForCompare.includes(model.id);

            return (
              <div
                key={model.id}
                className={cn(
                  'rounded-2xl border bg-card p-6 transition-all duration-300',
                  compareMode && isSelected
                    ? 'border-aether-500 shadow-lg shadow-aether-500/10'
                    : 'hover:border-aether-500/30 hover:shadow-lg hover:shadow-aether-500/5',
                  compareMode && 'cursor-pointer',
                )}
                onClick={() => compareMode && toggleCompare(model.id)}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-aether-500/10">
                      <Cpu className="size-5 text-aether-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{model.name}</h3>
                      <p className="text-sm text-muted-foreground">{model.provider}</p>
                    </div>
                  </div>
                  {model.free && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      FREE
                    </Badge>
                  )}
                </div>

                <p className="mb-3 text-sm text-muted-foreground">{model.description}</p>

                {/* Best For */}
                <div className="mb-3 flex items-center gap-1 rounded-lg bg-aether-500/5 px-3 py-2">
                  <Star className="size-3.5 text-yellow-500" />
                  <span className="text-xs font-medium">{model.bestFor}</span>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
                    <Zap className="size-3" />
                    {model.speed}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
                    <Globe className="size-3" />
                    {model.contextWindow} context
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
                    <Star className="size-3 text-yellow-500" />
                    {model.rating}/5
                  </span>
                </div>

                {testResult && (
                  <div
                    className={cn(
                      'mb-4 rounded-lg p-3 text-sm',
                      testResult.success
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500',
                    )}
                  >
                    {testResult.success ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="size-4" />
                        Model working!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <XCircle className="size-4" />
                        {testResult.error}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestModel(model.id);
                    }}
                    disabled={testingModel === model.id}
                  >
                    {testingModel === model.id ? (
                      <Loader2 className="size-4 animate-spin mr-2" />
                    ) : (
                      <TestTube2 className="size-4 mr-2" />
                    )}
                    Test
                  </Button>
                  {compareMode && (
                    <Button
                      variant={isSelected ? 'gradient' : 'outline'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(model.id);
                      }}
                    >
                      {isSelected ? '✓ Selected' : 'Select'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Best Model Recommendation */}
      {bestModel && (
        <div className="mt-8 rounded-2xl border-2 border-yellow-500/30 bg-yellow-500/5 p-6">
          <div className="flex items-center gap-3">
            <Trophy className="size-8 text-yellow-500" />
            <div>
              <h3 className="text-xl font-bold">Best Model: {bestModel.modelName}</h3>
              <p className="text-sm text-muted-foreground">
                Provider: {bestModel.provider} | Response quality: {bestModel.rating}/5
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Results */}
      {showCompareResults && comparisonResults.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Comparison Results</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {comparisonResults.map((result, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-2xl border bg-card p-6',
                  bestModel?.model === result.model && 'border-2 border-yellow-500/50',
                )}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">{result.modelName || result.model}</h3>
                  <div className="flex items-center gap-2">
                    {bestModel?.model === result.model && (
                      <Badge className="bg-yellow-500/10 text-yellow-500">
                        <Trophy className="size-3 mr-1" />
                        Best
                      </Badge>
                    )}
                    {result.success ? (
                      <Badge className="bg-green-500/10 text-green-500">Success</Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-500">Failed</Badge>
                    )}
                  </div>
                </div>
                {result.success ? (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {result.response}
                  </p>
                ) : (
                  <p className="text-sm text-red-500">{result.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelsPage;
