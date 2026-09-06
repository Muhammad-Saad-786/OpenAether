// src/pages/CareersPage.jsx
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  Zap,
  User,
  Heart,
  Globe,
  Code2,
  Sparkles,
  ArrowRight,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const openPositions = [
  {
    title: 'Frontend Developer',
    type: 'Open Source',
    location: 'Remote',
    description: 'Help build beautiful, responsive UI with React and Tailwind CSS.',
  },
  {
    title: 'Backend Developer',
    type: 'Open Source',
    location: 'Remote',
    description: 'Work on Supabase integration and API optimization.',
  },
  {
    title: 'AI/ML Engineer',
    type: 'Open Source',
    location: 'Remote',
    description: 'Integrate new AI models and improve smart routing algorithms.',
  },
];

const benefits = [
  {
    icon: Globe,
    title: 'Remote First',
    description: 'Work from anywhere. No office required.',
  },
  {
    icon: Zap,
    title: 'Open Source',
    description: 'Your code is public. Build your portfolio.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join passionate developers worldwide.',
  },
  {
    icon: Code2,
    title: 'Modern Stack',
    description: 'React, Vite, Tailwind, Supabase.',
  },
  {
    icon: Heart,
    title: 'Make Impact',
    description: 'Democratize AI access for everyone.',
  },
  {
    icon: Sparkles,
    title: 'Learn & Grow',
    description: 'Work with cutting-edge AI technologies.',
  },
];

export function CareersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero - Compact */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Badge variant="secondary" className="mb-4 bg-aether-500/10 text-aether-500">
            We're Hiring
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl gradient-text">
            Join Our Team
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us democratize AI access. We're building open-source tools that empower developers
            worldwide.
          </p>
        </div>
      </section>

      {/* Open Positions - Most Important */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((position) => (
              <div
                key={position.title}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-card p-5 transition-all hover:border-aether-500/30 hover:shadow-md"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{position.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{position.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">{position.type}</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                      {position.location}
                    </span>
                  </div>
                </div>
                <a
                  href="mailto:careers@openaether.com?subject=Application for {position.title}"
                  className="shrink-0"
                >
                  <Button variant="gradient" size="sm">
                    Apply
                    <ArrowRight className="size-4 ml-1" />
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits - Compact Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold mb-6">Why Join Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="rounded-xl border bg-card p-5 transition-all hover:border-aether-500/30"
                >
                  <div className="mb-3 inline-flex rounded-lg bg-aether-500/10 p-2">
                    <Icon className="size-5 text-aether-500" />
                  </div>
                  <h3 className="font-semibold text-sm">{benefit.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold mb-6">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-aether-500 to-aether-400 text-white font-bold text-lg">
                S
              </div>
              <div>
                <h3 className="font-semibold">Saad Asim</h3>
                <p className="text-sm text-muted-foreground">Founder & Lead Developer</p>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Users className="size-5 text-aether-500" />
              </div>
              <div>
                <h3 className="font-semibold">Community Contributors</h3>
                <p className="text-sm text-muted-foreground">Open Source Community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Compact */}
      <section className="py-12 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-2xl bg-gradient-to-br from-aether-500/10 to-aether-400/10 p-8 text-center">
            <h2 className="text-2xl font-bold gradient-text">Ready to Make an Impact?</h2>
            <p className="mt-2 text-muted-foreground">
              Email us at{' '}
              <a href="mailto:careers@openaether.com" className="text-aether-500 hover:underline">
                careers@openaether.com
              </a>
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:careers@openaether.com">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                  <Mail className="size-4 mr-2" />
                  Email Us
                </Button>
              </a>
              <Link to="/contributing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Start Contributing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CareersPage;
