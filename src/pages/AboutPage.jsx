// src/pages/AboutPage.jsx
import { Link } from 'react-router-dom';
import { Shield, Zap, Cpu, Users, Globe, Code2 } from 'lucide-react';
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

export function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl gradient-text">
              About OpenAether
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              OpenAether is an open source AI client that provides a unified interface
              to access multiple AI providers including Groq, Gemini, OpenRouter, and
              local models. Built with privacy in mind, your conversations never leave
              your device and are never stored on our servers.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
              Why Choose OpenAether
            </h2>
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
      <section className="pb-24 sm:pb-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-aether-500/10 to-aether-400/10 px-8 py-12 text-center sm:px-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
                Start Your AI Journey
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

export default AboutPage;