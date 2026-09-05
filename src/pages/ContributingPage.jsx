// src/pages/ContributingPage.jsx
import { Link } from 'react-router-dom';
import { Users, Heart, Zap, Bug, Code2, Share2, Star, GitPullRequest, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Custom GitHub Icon
function GithubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const contributionWays = [
  {
    icon: Bug,
    title: 'Report Issues',
    description: 'Help us improve by reporting bugs and suggesting features.',
    links: [
      { label: 'Report bugs', href: 'https://github.com/Muhammad-Saad-786/openaether/issues' },
      { label: 'Suggest features', href: 'https://github.com/Muhammad-Saad-786/openaether/issues' },
    ],
  },
  {
    icon: Code2,
    title: 'Code Contributions',
    description: 'Submit pull requests and improve the codebase.',
    links: [
      { label: 'Submit pull requests', href: 'https://github.com/Muhammad-Saad-786/openaether/pulls' },
      { label: 'Improve documentation', href: 'https://github.com/Muhammad-Saad-786/openaether/wiki' },
    ],
  },
  {
    icon: Share2,
    title: 'Spread the Word',
    description: 'Help grow the community by sharing OpenAether.',
    links: [
      { label: 'Star us on GitHub', href: 'https://github.com/Muhammad-Saad-786/openaether' },
      { label: 'Share with community', href: 'https://discord.gg/openaether' },
    ],
  },
];

export function ContributingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl gradient-text">
              Contributing
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Join the open source movement. Learn how you can contribute to OpenAether.
            </p>
          </div>
        </div>
      </section>

      {/* Ways to Contribute */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contributionWays.map((way) => {
              const Icon = way.icon;
              return (
                <div
                  key={way.title}
                  className="rounded-2xl border bg-card p-6 transition-all duration-300 hover:border-aether-500/30 hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-aether-500/10 p-3">
                    <Icon className="size-6 text-aether-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{way.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{way.description}</p>
                  <ul className="space-y-2">
                    {way.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-aether-500 hover:underline"
                        >
                          {link.label} →
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Steps to Contribute */}
      <section className="py-24 sm:py-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
              How to Contribute
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Follow these simple steps to start contributing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '1', title: 'Fork', desc: 'Fork the repository on GitHub' },
              { step: '2', title: 'Clone', desc: 'Clone your fork locally' },
              { step: '3', title: 'Create', desc: 'Create a new branch' },
              { step: '4', title: 'Submit', desc: 'Open a pull request' },
            ].map((item) => (
              <div key={item.step} className="text-center rounded-2xl border bg-card p-6">
                <div className="mb-4 mx-auto flex size-12 items-center justify-center rounded-full bg-aether-500/10">
                  <span className="text-xl font-bold text-aether-500">{item.step}</span>
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-aether-500/10 to-aether-400/10 px-8 py-12 text-center sm:px-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
                Become a Contributor
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Your contributions help democratize AI access for everyone.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://github.com/Muhammad-Saad-786/openaether"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="gradient" size="xl" className="px-8 w-full sm:w-auto">
                    <GithubIcon className="size-5 mr-2" />
                    View on GitHub
                  </Button>
                </a>
                <a
                  href="https://github.com/Muhammad-Saad-786/openaether/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="xl" className="px-8 w-full sm:w-auto">
                    <Bug className="size-5 mr-2" />
                    Report Issue
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContributingPage;