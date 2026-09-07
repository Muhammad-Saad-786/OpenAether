// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  KeyRound,
  RefreshCw,
  Terminal,
  Globe,
  CheckCircle,
  XCircle,
  Sparkles,
  Code2,
  Zap,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/seo/SEO';
import {
  organizationSchema,
  softwareApplicationSchema,
  websiteSchema,
} from '@/components/seo/structuredData';

export function HomePage() {
  return (
    <>
      <SEO
        title="OpenAether | Free AI Model Aggregator - Access Multiple AI Models"
        description="OpenAether is a free, open-source platform that unifies GPT-4o Mini, Gemma, GLM, MiniMax and more through one interface and CLI. No credit card. 30-second setup."
        keywords="OpenAether, OpenAether CLI, free AI, AI aggregator, OpenRouter alternative, GPT-4o Mini, Gemma, GLM"
        path="/"
        structuredData={[
          organizationSchema(),
          softwareApplicationSchema(),
          websiteSchema(),
        ]}
      />
      <div className="flex flex-col">
        {/* Hero Section - Clear Value Proposition */}
        <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="absolute inset-0 bg-gradient-to-b from-aether-500/5 via-transparent to-transparent" />

          <div className="relative mx-auto max-w-5xl px-6 text-center">
            {/* Main Heading */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="gradient-text">One API Key.</span>
              <br />
              <span className="text-foreground">All AI Models.</span>
            </h1>

            {/* Subheading - Clear Value */}
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto sm:text-xl leading-relaxed">
              Paste your OpenRouter key once. OpenAether automatically routes your requests across
              free models — no more rate limit headaches.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="gradient" size="xl" className="w-full sm:w-auto px-8 group">
                  Get Started Free
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a
                href="https://github.com/Muhammad-Saad-786/openaether"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="xl" className="w-full sm:w-auto px-8">
                  <Code2 className="mr-2 size-5" />
                  View Source
                </Button>
              </a>
            </div>

            {/* Trust Indicators - Not Cards, Just Text */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="size-4 text-green-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="size-4 text-green-500" />
                30-second setup
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="size-4 text-green-500" />
                Works in browser & CLI
              </span>
            </div>
          </div>
        </section>

        {/* How It Works - Simple 3 Steps (Not Cards) */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It <span className="gradient-text">Works</span>
            </h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-aether-500 text-white font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <KeyRound className="size-5 text-aether-500" />
                    Get Your Free API Key
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Sign up at OpenRouter.ai and copy your free API key. Takes less than 2 minutes.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-aether-500 text-white font-bold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Zap className="size-5 text-aether-500" />
                    Paste in Settings
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Add your key in OpenAether Settings. We handle the rest.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-aether-500 text-white font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <RefreshCw className="size-5 text-aether-500" />
                    Start Chatting
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    OpenAether auto-switches between models when rate limits hit. You never notice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Web vs CLI Comparison */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-bold text-center mb-4">
              Web <span className="gradient-text">&</span> CLI
            </h2>
            <p className="text-center text-muted-foreground mb-12">Choose how you want to work</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Web Version */}
              <div className="rounded-2xl border-2 border-aether-500/30 bg-card p-8">
                <div className="flex items-center justify-between mb-4">
                  <Globe className="size-8 text-aether-500" />
                  <Badge className="bg-green-500/10 text-green-500">Available Now</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">Web Version</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Full-featured browser interface with chat, models, and dashboard.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-500" />
                    Markdown & code highlighting
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-500" />
                    Conversation history
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-500" />
                    Model comparison
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-500" />
                    Usage dashboard
                  </li>
                </ul>
                <Link to="/signup">
                  <Button variant="gradient" className="w-full">
                    Try Web Version
                  </Button>
                </Link>
              </div>

              {/* CLI Version */}
              <div className="rounded-2xl border bg-card p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                    Available Now
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="size-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">CLI Version</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Use OpenAether directly in your terminal. Perfect for developers.
                </p>
                <div className="rounded-lg bg-muted p-4 mb-6 font-mono text-sm space-y-2">
                  <div className="text-muted-foreground">$ npm install -g openaether</div>
                  <div className="text-muted-foreground">$env:OPENAETHER_API_KEY="YOUR_API_KEY"</div>
                  <div className="text-aether-500">$ openaether</div>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <XCircle className="size-4 text-muted-foreground" />
                    Work in VS Code terminal
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <XCircle className="size-4 text-muted-foreground" />
                    No browser needed
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <XCircle className="size-4 text-muted-foreground" />
                    Live in your workflow
                  </li>
                </ul>
                <Link to="/cli">
                  <Button variant="gradient" className="w-full">
                    View CLI Page
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits - Highlight Text, Not Cards */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why <span className="gradient-text">OpenAether</span>
            </h2>

            <div className="space-y-6">
              {/* Benefit 1 */}
              <div className="flex gap-4">
                <RefreshCw className="size-6 text-aether-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Auto-Switch on Rate Limit</h3>
                  <p className="text-muted-foreground mt-1">
                    When one model hits its free limit, OpenAether automatically switches to another.
                    No interruptions. No manual model selection. Just works.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex gap-4">
                <KeyRound className="size-6 text-aether-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">One Key, Multiple Models</h3>
                  <p className="text-muted-foreground mt-1">
                    GPT-4o Mini, Gemma, GLM, MiniMax — all accessible with a single OpenRouter key. No
                    need to manage multiple accounts.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex gap-4">
                <Shield className="size-6 text-aether-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Privacy First</h3>
                  <p className="text-muted-foreground mt-1">
                    Your API key stays with you. Conversations stored in your own Supabase instance.
                    We never see your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl gradient-text mb-4">
              Start Using AI for Free
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              No credit card. No subscription. Just free AI.
            </p>
            <Link to="/signup">
              <Button variant="gradient" size="xl" className="px-10 group">
                Create Free Account
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;