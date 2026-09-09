// src/pages/CLILandingPage.jsx
// Dedicated landing page optimized for the search query "openaether cli".
// Includes FAQ schema, breadcrumbs, and CLI-targeted metadata.

import { Link } from 'react-router-dom';
import { Terminal, Download, KeyRound, MessageSquare, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/seo/SEO';
import {
  cliSoftwareSchema,
  softwareApplicationSchema,
  breadcrumbSchema,
  faqSchema,
} from '@/components/seo/structuredData';

// Inline GitHub icon (lucide-react does not export a Github icon)
function GithubIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const CLI_FAQS = [
  {
    question: 'What is OpenAether CLI?',
    answer:
      'OpenAether CLI is a free, open-source command-line tool that brings multiple AI models (GPT-4o Mini, Gemma, GLM, MiniMax) into your terminal. Install it via npm and chat with AI without ever opening a browser.',
  },
  {
    question: 'How do I install OpenAether CLI?',
    answer:
      'Install OpenAether CLI globally with npm using: npm install -g openaether. Then set your OPENAETHER_API_KEY environment variable and run the "openaether" command.',
  },
  {
    question: 'Is OpenAether CLI free?',
    answer:
      'Yes. OpenAether CLI is 100% free and open source under the MIT license. It uses the free tier of OpenRouter, so you only need a free OpenRouter API key to use it.',
  },
  {
    question: 'Which AI models does OpenAether CLI support?',
    answer:
      'OpenAether CLI supports GPT-4o Mini, Gemma 4 26B/31B, GLM 5.2, MiniMax M3, Nemotron 3.5, Cohere North Mini, and any new free models added to OpenRouter — automatically.',
  },
  {
    question: 'Does OpenAether CLI work on Windows, macOS, and Linux?',
    answer:
      'Yes. OpenAether CLI is a cross-platform Node.js package and runs natively on Windows, macOS, and Linux. It works in PowerShell, bash, zsh, fish, and any standard terminal.',
  },
  {
    question: 'How is OpenAether CLI different from the web app?',
    answer:
      'Both use the same OpenAether engine. The web app offers a graphical chat UI, dashboards, and history. The CLI is built for developers who prefer to live in the terminal — it is faster, scriptable, and works over SSH.',
  },
];

function CopyBlock({ text }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      className="group flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-muted px-4 py-3 font-mono text-sm text-left transition-colors hover:bg-muted/70"
      aria-label="Copy command"
    >
      <span className="truncate">{text}</span>
      {copied ? (
        <Check className="size-4 text-green-500 shrink-0" />
      ) : (
        <Copy className="size-4 text-muted-foreground group-hover:text-foreground shrink-0" />
      )}
    </button>
  );
}

export function CLILandingPage() {
  return (
    <>
      <SEO
        title="OpenAether CLI - Free AI in Your Terminal"
        description="OpenAether CLI brings GPT-4o Mini, Gemma, GLM, MiniMax and more to your terminal. Free, open source, npm-installable. Chat with AI without a browser."
        keywords="openaether cli, openaether npm, openaether command line, AI CLI, AI in terminal, free AI terminal, chatgpt cli, openrouter cli"
        path="/cli"
        structuredData={[
          cliSoftwareSchema(),
          softwareApplicationSchema(),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'OpenAether CLI', url: '/cli' },
          ]),
          faqSchema(CLI_FAQS),
        ]}
      />

      <div className="flex flex-col">
        {/* Hero */}
        <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="absolute inset-0 bg-gradient-to-b from-aether-500/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="gradient-text">openaether cli</span>
              <br />
              <span className="text-foreground">AI in your terminal.</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto sm:text-xl leading-relaxed">
              The free, open-source CLI for chatting with GPT-4o Mini, Gemma, GLM, and MiniMax —
              directly from your terminal. No browser. No subscriptions. Just{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
                npm install -g openaether
              </code>
              .
            </p>

            {/* Quick install */}
            <div className="mt-10 mx-auto max-w-2xl space-y-3 text-left">
              <CopyBlock text="npm install -g openaether" />
              <CopyBlock text="Save your Groq and OpenRouter API keys" />
              <CopyBlock text="openaether" />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.npmjs.com/package/openaether"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="gradient" size="xl" className="px-8 group">
                  <Download className="mr-2 size-5" />
                  Install from npm
                </Button>
              </a>
              <a
                href="https://github.com/Muhammad-Saad-786/openaether"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="xl" className="px-8">
                  <GithubIcon className="mr-2 size-5" />
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why developers love <span className="gradient-text">openaether cli</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border bg-card p-6">
                <Terminal className="size-7 text-aether-500 mb-3" />
                <h3 className="font-semibold text-lg mb-2">100% Terminal Native</h3>
                <p className="text-sm text-muted-foreground">
                  Built for developers. Streams responses, supports markdown, and feels right at
                  home in PowerShell, bash, zsh, and fish.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <KeyRound className="size-7 text-aether-500 mb-3" />
                <h3 className="font-semibold text-lg mb-2">One Key, All Models</h3>
                <p className="text-sm text-muted-foreground">
                  Bring your own OpenRouter key. OpenAether CLI automatically rotates across free
                  models when rate limits hit.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <MessageSquare className="size-7 text-aether-500 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Scriptable</h3>
                <p className="text-sm text-muted-foreground">
                  Pipe prompts in, pipe answers out. Perfect for CI, agents, shell scripts, and SSH
                  workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CLI vs Web */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="gradient-text">openaether</span> Web vs CLI
            </h2>

            <div className="overflow-hidden rounded-xl border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Feature</th>
                    <th className="px-4 py-3 font-semibold text-center">Web</th>
                    <th className="px-4 py-3 font-semibold text-center">CLI</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    ['GPT-4o Mini, Gemma, GLM, MiniMax', '✓', '✓'],
                    ['Auto-rotate on rate limit', '✓', '✓'],
                    ['Conversation history', '✓', 'Local files'],
                    ['Markdown / syntax highlighting', '✓', '✓'],
                    ['Multi-line prompts', '✓', '✓'],
                    ['Scriptable / pipeable', '—', '✓'],
                    ['Works over SSH', '—', '✓'],
                    ['No browser needed', '—', '✓'],
                  ].map(([feat, web, cli]) => (
                    <tr key={feat}>
                      <td className="px-4 py-3">{feat}</td>
                      <td className="px-4 py-3 text-center">{web}</td>
                      <td className="px-4 py-3 text-center">{cli}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 text-center">
              <Link to="/">
                <Button variant="outline" size="lg">
                  ← Back to OpenAether home
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              OpenAether CLI — <span className="gradient-text">FAQ</span>
            </h2>

            <div className="space-y-4">
              {CLI_FAQS.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border bg-card p-5 open:shadow-sm transition-shadow"
                >
                  <summary className="cursor-pointer font-semibold text-base flex items-center justify-between">
                    {faq.question}
                    <span className="ml-4 text-aether-500 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default CLILandingPage;
