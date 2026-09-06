// src/pages/PrivacyPolicyPage.jsx
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Eye,
  Database,
  Trash2,
  Mail,
  FileText,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const policySections = [
  {
    icon: Database,
    title: 'Data We Collect',
    content: 'We collect minimal data necessary for the service to function:',
    items: [
      'Email address (for authentication)',
      'Username (for profile identification)',
      'API keys (stored securely in your Supabase instance)',
      'Chat conversations (stored in your database)',
    ],
  },
  {
    icon: Lock,
    title: 'How We Protect Your Data',
    content: 'Your security is our priority:',
    items: [
      'API keys are stored in your own Supabase instance',
      'Row Level Security (RLS) ensures data isolation',
      'Passwords are hashed and never stored in plain text',
      'HTTPS encryption for all data transmission',
    ],
  },
  {
    icon: Eye,
    title: 'What We Never Do',
    content: 'We are committed to your privacy:',
    items: [
      'We never sell your personal data',
      'We never share your conversations with third parties',
      'We never access your API keys',
      'We never track your browsing activity',
    ],
  },
  {
    icon: Trash2,
    title: 'Your Rights',
    content: 'You have full control over your data:',
    items: [
      'Delete your account anytime',
      'Clear chat history with one click',
      'Export your data (coming soon)',
      'Update your profile information',
    ],
  },
];

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero - Compact */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-aether-500/10">
            <Shield className="size-7 text-aether-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl gradient-text">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy matters. Here's how we protect your data.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-green-500/10 text-green-500">
              <CheckCircle className="size-3 mr-1" />
              Last Updated: January 2025
            </Badge>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-6">
            {policySections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.title}
                  className="rounded-2xl border bg-card p-6 transition-all hover:border-aether-500/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-aether-500/10">
                      <Icon className="size-5 text-aether-500" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
                      <p className="text-sm text-muted-foreground mb-3">{section.content}</p>
                      <ul className="space-y-2">
                        {section.items.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="size-4 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-500 mb-1">Important Notice</h3>
                <p className="text-sm text-muted-foreground">
                  OpenAether is an open-source project. Your API keys and conversations are stored
                  in your own Supabase instance. We do not have access to your data. However, you
                  are responsible for keeping your API keys secure and not sharing them publicly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-2xl bg-gradient-to-br from-aether-500/10 to-aether-400/10 p-8 text-center">
            <h2 className="text-2xl font-bold gradient-text mb-2">Questions About Privacy?</h2>
            <p className="text-muted-foreground mb-6">
              We're here to help. Reach out to us anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:privacy@openaether.com">
                <Button variant="gradient" className="w-full sm:w-auto">
                  <Mail className="size-4 mr-2" />
                  saadasimmalik@gmail.com
                </Button>
              </a>
              <Link to="/contact">
                <Button variant="outline" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicyPage;
