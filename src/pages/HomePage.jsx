// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Globe, Cpu, Code2, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Cpu,
    title: 'Multiple AI Providers',
    description: 'Access Groq, Gemini, OpenRouter, and local models through one unified interface.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your conversations stay private. We never store or share your data.',
  },
  {
    icon: Code2,
    title: 'Developer Friendly',
    description: 'Built for developers with CLI access, API integration, and open source code.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized routing ensures you always get the fastest response times.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Join thousands of developers contributing to open AI access.',
  },
  {
    icon: Globe,
    title: 'Accessible Anywhere',
    description: 'Use from any device, any location. AI for everyone, everywhere.',
  },
];

const stats = [
  { value: '5+', label: 'AI Providers' },
  { value: '30+', label: 'Free Models' },
  { value: '$0', label: 'Cost Forever' },
  { value: '100%', label: 'Open Source' },
];

export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-aether-500/5 via-transparent to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="gradient-text">Open</span> AI
              <br />
              <span className="text-foreground">For Everyone</span>
            </h1>

            <p className="mt-8 text-lg leading-8 text-muted-foreground sm:text-xl">
              Access multiple AI models through one beautiful interface. Free forever, open source,
              and privacy-focused.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/chat" className="w-full sm:w-auto">
                <Button variant="gradient" size="xl" className="group w-full px-8 sm:w-auto">
                  Start Free
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/models" className="w-full sm:w-auto">
                <Button variant="outline" size="xl" className="w-full px-8 sm:w-auto">
                  Explore Models
                </Button>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold gradient-text sm:text-4xl">{stat.value}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose OpenAether</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to harness the power of AI, without the cost.
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

      {/* CTA Section */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-aether-500/10 to-aether-400/10 px-8 py-16 text-center sm:px-16">
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of developers using OpenAether for free AI access.
              </p>
              <div className="mt-8">
                <Link to="/chat">
                  <Button variant="gradient" size="xl" className="px-8">
                    Start Chatting Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
