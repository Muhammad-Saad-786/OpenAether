// src/pages/AboutPage.jsx
import { Link } from 'react-router-dom';
import { Shield, Zap, Cpu, Users, Globe, Code2, KeyRound, Terminal, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/seo/SEO';
import { organizationSchema } from '@/components/seo/structuredData';

const features = [
  {
    icon: KeyRound,
    title: 'One Key, All Models',
    description:
      'Just paste your OpenRouter API key once. OpenAether automatically manages model routing, so you never worry about rate limits.',
  },
  {
    icon: RefreshCw,
    title: 'Auto-Switch on Rate Limit',
    description:
      'When one model hits its free tier limit, OpenAether automatically switches to another available model. No interruptions.',
  },
  {
    icon: Cpu,
    title: 'Multiple AI Providers',
    description: 'Access GPT-4o Mini, Gemma, GLM, MiniMax, and more through one unified interface.',
  },
  {
    icon: Terminal,
    title: 'CLI Version Coming Soon',
    description:
      'Install via npm and use OpenAether directly in VS Code terminal. No more copy-paste between browser and IDE.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description:
      'Your API key stays with you. Conversations are stored securely in your own Supabase instance.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Smart routing ensures you always get the fastest response from available models.',
  },
];

export function AboutPage() {
  return (
    <>
      <SEO
        title="About OpenAether - Free, Open Source AI for Everyone"
        description="OpenAether is an open-source platform aggregating free AI models from OpenRouter, Groq, and Gemini into one beautiful interface. MIT licensed."
        keywords="about OpenAether, OpenAether mission, open source AI platform"
        path="/about"
        structuredData={[organizationSchema()]}
      />
      <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl gradient-text">
              About OpenAether
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              OpenAether is an open-source AI client that gives you access to multiple free AI
              models through one simple interface. No subscriptions. No hidden costs. Just paste
              your API key and start chatting.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 sm:py-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">Three simple steps to get started.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Get Free API Key',
                desc: 'Sign up at OpenRouter.ai and get your free API key.',
              },
              {
                step: '2',
                title: 'Paste in Settings',
                desc: 'Add your key in Settings. Takes less than 30 seconds.',
              },
              {
                step: '3',
                title: 'Start Chatting',
                desc: 'OpenAether handles model routing automatically.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center rounded-2xl border bg-card p-8">
                <div className="mb-4 mx-auto flex size-14 items-center justify-center rounded-full bg-aether-500/10">
                  <span className="text-2xl font-bold text-aether-500">{item.step}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
              Why OpenAether
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for developers who want AI without the complexity.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl border bg-card p-8 transition-all duration-300 hover:border-aether-500/30 hover:shadow-lg hover:shadow-aether-500/5"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-aether-500/10 p-3">
                    <Icon className="size-6 text-aether-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLI Coming Soon */}
      <section className="pb-24 sm:pb-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-aether-500/10 to-aether-400/10 px-8 py-16 text-center sm:px-16">
            <div>
              <Terminal className="size-12 text-aether-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
                CLI Version Coming Soon
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Install OpenAether via npm and use it directly in your terminal. No more switching
                between browser and IDE.
              </p>
              <div className="mt-6 rounded-lg bg-background/50 p-4 inline-block">
                <code className="text-sm">npm install -g openaether-cli</code>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/chat">
                  <Button variant="gradient" size="xl" className="px-8 w-full sm:w-auto">
                    Try Web Version
                  </Button>
                </Link>
                <Link to="/contributing">
                  <Button variant="outline" size="xl" className="px-8 w-full sm:w-auto">
                    Contribute
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

export default AboutPage;
