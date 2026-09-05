// src/pages/DocsPage.jsx
import { Link } from 'react-router-dom';
import { Globe, Code2, Zap, Shield, Users, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl gradient-text">
              Documentation
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Get started with OpenAether's documentation. Learn about installation,
              configuration, and how to use all the features.
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Getting Started</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link to="/chat" className="hover:text-foreground transition-colors">
                    Chat with AI
                  </Link>
                </li>
                <li>
                  <Link to="/models" className="hover:text-foreground transition-colors">
                    Explore Models
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Features</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Multiple AI Providers</li>
                <li>Privacy First</li>
                <li>Open Source</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Resources</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <Link to="/about" className="hover:text-foreground transition-colors">
                  <li>About Us</li>
                </Link>
                <Link to="/careers" className="hover:text-foreground transition-colors">
                  <li>Careers</li>
                </Link>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 sm:pb-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-aether-500/10 to-aether-400/10 px-8 py-12 text-center sm:px-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
                Start Building
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Create an account and start chatting with AI models today.
              </p>
              <div className="mt-8">
                <Link to="/chat">
                  <Button variant="gradient" size="xl" className="px-8">
                    Start Chatting
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

export default DocsPage;