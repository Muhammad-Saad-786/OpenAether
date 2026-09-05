// src/pages/ContactPage.jsx
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Custom SVG Icons
function GithubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function TwitterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DiscordIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
    </svg>
  );
}

function LinkedinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl gradient-text">
              Contact
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Get in touch with us. We'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Address */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Location</h3>
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-aether-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">OpenAether HQ</p>
                  <p className="text-sm text-muted-foreground">
                    Open Source Community
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Phone</h3>
              <div className="flex items-start gap-3">
                <Phone className="size-5 text-aether-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">+1 (555) 123-4567</p>
                  <p className="text-muted-foreground text-sm">
                    Available: 9am - 6pm UTC
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Email</h3>
              <div className="flex items-start gap-3">
                <Mail className="size-5 text-aether-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">contact@openaether.com</p>
                  <p className="text-muted-foreground text-sm">
                    Response within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="py-24 sm:py-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground mb-6">Follow Us</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/Muhammad-Saad-786"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-muted-foreground transition-all hover:border-aether-500/30 hover:text-aether-500"
              >
                <GithubIcon className="size-4" />
                <span className="text-sm">GitHub</span>
              </a>
              <a
                href="https://discord.gg/openaether"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-muted-foreground transition-all hover:border-aether-500/30 hover:text-aether-500"
              >
                <DiscordIcon className="size-4" />
                <span className="text-sm">Discord</span>
              </a>
              <a
                href="https://linkedin.com/company/openaether"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-muted-foreground transition-all hover:border-aether-500/30 hover:text-aether-500"
              >
                <LinkedinIcon className="size-4" />
                <span className="text-sm">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-aether-500/10 to-aether-400/10 px-8 py-12 text-center sm:px-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
                Start Chatting Now
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Have a question about AI? Start a conversation instantly.
              </p>
              <div className="mt-8">
                <Link to="/chat">
                  <Button variant="gradient" size="xl" className="px-8">
                    Start Free Chat
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

export default ContactPage;