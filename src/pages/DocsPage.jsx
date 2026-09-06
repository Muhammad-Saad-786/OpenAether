// src/pages/DocsPage.jsx
import { Link } from 'react-router-dom';
import { KeyRound, MessageSquare, Cpu, Terminal, Shield, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const docSections = [
  {
    icon: KeyRound,
    title: 'Getting Started',
    description: 'Set up your API key and start chatting in minutes.',
    steps: [
      'Create account at OpenRouter.ai',
      'Copy your free API key',
      'Paste key in OpenAether Settings',
      'Start chatting with AI models',
    ],
  },
  {
    icon: Cpu,
    title: 'Available Models',
    description: 'Access multiple free models through OpenRouter.',
    models: [
      'GPT-4o Mini',
      'Gemma 4 26B / 31B',
      'GLM 5.2',
      'MiniMax M3',
      'Nemotron 3.5',
      'Cohere North Mini',
    ],
  },
  {
    icon: Terminal,
    title: 'CLI (Coming Soon)',
    description: 'Use OpenAether from your terminal.',
    commands: [
      'npm install -g openaether-cli',
      'openaether setup',
      'openaether chat',
      'openaether ask "Your question"',
    ],
  },
];

export function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl gradient-text">
              Documentation
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Everything you need to know about OpenAether.
            </p>
          </div>
        </div>
      </section>

      {/* Doc Sections */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {docSections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="rounded-2xl border bg-card p-8">
                  <div className="mb-4 inline-flex rounded-xl bg-aether-500/10 p-3">
                    <Icon className="size-6 text-aether-500" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">{section.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{section.description}</p>

                  {section.steps && (
                    <ol className="space-y-2">
                      {section.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="flex size-5 items-center justify-center rounded-full bg-aether-500/10 text-xs font-bold text-aether-500 shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  )}

                  {section.models && (
                    <ul className="space-y-2">
                      {section.models.map((model) => (
                        <li
                          key={model}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="size-1.5 rounded-full bg-aether-500" />
                          {model}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.commands && (
                    <div className="space-y-2">
                      {section.commands.map((cmd) => (
                        <div key={cmd} className="rounded-lg bg-muted px-3 py-2 font-mono text-xs">
                          {cmd}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-aether-500/10 to-aether-400/10 px-8 py-16 text-center">
            <h2 className="text-3xl font-bold gradient-text">Ready to Get Started?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of developers using OpenAether.
            </p>
            <div className="mt-8">
              <Link to="/signup">
                <Button variant="gradient" size="xl" className="px-8">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DocsPage;
