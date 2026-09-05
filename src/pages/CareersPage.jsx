// src/pages/CareersPage.jsx
import { Link } from 'react-router-dom';
import { Users, Briefcase, MapPin, Phone, Mail, Shield, Zap, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const teamMembers = [
  {
    name: 'Saad Asim',
    role: 'Founder & Developer',
    description: 'Lead developer and open source advocate',
    isFounder: true,
  },
  {
    name: 'Community Contributors',
    role: 'Open Source Community',
    description: 'Developers worldwide contributing to the project',
    isFounder: false,
  },
];

const benefits = [
  {
    icon: Shield,
    title: 'Remote Friendly',
    description: 'Work from anywhere in the world',
  },
  {
    icon: Zap,
    title: 'Open Source',
    description: 'Contribute to meaningful open source projects',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Join a passionate community of AI enthusiasts',
  },
];

export function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl gradient-text">
              Careers
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              We're always looking for talented individuals to help shape the future
              of open AI access. Join us in building tools that empower developers
              worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
              Our Team
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Passionate people building accessible AI for everyone.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:border-aether-500/30 hover:shadow-lg"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-aether-500/10">
                {member.isFounder ? (
                  <User className="size-6 text-aether-500" />
                ) : (
                  <Users className="size-6 text-aether-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 sm:py-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
              Why Join Us
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Be part of a movement that's democratizing AI access.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:border-aether-500/30 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-xl bg-aether-500/10 p-3">
                  <Icon className="size-6 text-aether-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-aether-500/10 to-aether-400/10 px-8 py-12 text-center sm:px-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
                Have Questions?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Email us at careers@openaether.com or reach out via our social channels.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button variant="outline" size="xl" className="px-8 w-full sm:w-auto">
                    Contact Us
                  </Button>
                </Link>
                <Link to="/chat">
                  <Button variant="gradient" size="xl" className="px-8 w-full sm:w-auto">
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

export default CareersPage;