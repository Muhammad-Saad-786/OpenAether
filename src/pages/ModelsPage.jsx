// src/pages/ModelsPage.jsx
import { useState, useEffect } from 'react';
import {
  Search,
  Cpu,
  Zap,
  Globe,
  Lock,
  CheckCircle,
  XCircle,
  Loader2,
  GitCompare,
  TestTube2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useModelStore } from '@/stores/modelStore';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SEO } from '@/components/seo/SEO';
import { breadcrumbSchema } from '@/components/seo/structuredData';

const staticModels = [
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    contextWindow: '128K',
    speed: 'Fast',
    free: false,
    description: 'Powerful and efficient model for general tasks.',
  },
  {
    id: 'google/gemma-4-31b-it:free',
    name: 'Gemma 4 31B',
    provider: 'Google',
    contextWindow: '262K',
    speed: 'Medium',
    free: true,
    description: "Google's multimodal model with strong reasoning.",
  },
  {
    id: 'google/gemma-4-26b-a4b-it:free',
    name: 'Gemma 4 26B',
    provider: 'Google',
    contextWindow: '262K',
    speed: 'Fast',
    free: true,
    description: 'Efficient MoE model for coding and reasoning.',
  },
  {
    id: 'z-ai/glm-5.2:free',
    name: 'GLM 5.2',
    provider: 'Z.ai',
    contextWindow: '256K',
    speed: 'Medium',
    free: true,
    description: 'Large-scale reasoning model for complex tasks.',
  },
  {
    id: 'minimax/minimax-m3:free',
    name: 'MiniMax M3',
    provider: 'MiniMax',
    contextWindow: '1M',
    speed: 'Fast',
    free: true,
    description: 'Multimodal model with 1M token context.',
  },
  {
    id: 'nvidia/nemotron-3.5-lightning:free',
    name: 'Nemotron 3.5',
    provider: 'NVIDIA',
    contextWindow: '128K',
    speed: 'Very Fast',
    free: true,
    description: 'Lightning-fast model for quick responses.',
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

  const { models, loading, fetchOpenRouterModels, testModel, compareModels, comparisonResults } =
    useModelStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      fetchOpenRouterModels().catch(() => {
        // Fallback to static models if fetch fails
        useModelStore.setState({ models: staticModels });
      });
    }
  }, [user, fetchOpenRouterModels]);

  const providers = ['all', 'OpenAI', 'Google', 'Z.ai', 'MiniMax', 'NVIDIA'];

  const displayModels = models.length > 0 ? models : staticModels;

  const filteredModels = displayModels.filter((model) => {
    const matchesSearch =
      model.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = selectedProvider === 'all' || model.provider === selectedProvider;
    return matchesSearch && matchesProvider;
  });

  const handleTestModel = async (modelId) => {
    setTestingModel(modelId);
    try {
      const result = await testModel(modelId);
      setTestResults((prev) => ({ ...prev, [modelId]: result }));

      if (result.success) {
        toast.success(`${modelId} is working!`);
      } else {
        toast.error(`${modelId} failed: ${result.error}`);
      }
    } catch (error) {
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

    setShowCompareResults(true);
    await compareModels(selectedForCompare, comparePrompt);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">AI Models</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore and test free AI models from multiple providers.
        </p>
      </div>

      {/* Compare Mode Banner */}
      {compareMode && (
        <div className="mb-8 rounded-2xl border bg-card p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Compare Models</h2>
            <p className="text-sm text-muted-foreground">
              Select 2-3 models to compare their responses.
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
            <Button variant="gradient" onClick={handleCompare} disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <GitCompare className="size-4 mr-2" />
              )}
              Compare
            </Button>
            <Button variant="outline" onClick={() => setCompareMode(false)}>
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
        <div className="flex items-center gap-2">
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
          >
            <GitCompare className="size-4 mr-2" />
            Compare
          </Button>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredModels.map((model) => {
          const testResult = testResults[model.id];

          return (
            <div
              key={model.id}
              className={cn(
                'rounded-2xl border bg-card p-6 transition-all duration-300',
                compareMode && selectedForCompare.includes(model.id)
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
                {model.free !== false && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                    FREE
                  </Badge>
                )}
              </div>

              <p className="mb-4 text-sm text-muted-foreground">{model.description}</p>

              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
                  <Zap className="size-3" />
                  {model.speed || 'Medium'}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
                  <Globe className="size-3" />
                  {model.contextWindow || '128K'} context
                </span>
              </div>

              {/* Test Result */}
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
                    variant={selectedForCompare.includes(model.id) ? 'gradient' : 'outline'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompare(model.id);
                    }}
                  >
                    {selectedForCompare.includes(model.id) ? 'Selected' : 'Select'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Results */}
      {showCompareResults && comparisonResults.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Comparison Results</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {comparisonResults.map((result, index) => (
              <div key={index} className="rounded-2xl border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">{result.model}</h3>
                  {result.success ? (
                    <Badge className="bg-green-500/10 text-green-500">Success</Badge>
                  ) : (
                    <Badge className="bg-red-500/10 text-red-500">Failed</Badge>
                  )}
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
