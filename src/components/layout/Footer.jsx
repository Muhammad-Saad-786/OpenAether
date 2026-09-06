// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Mail } from 'lucide-react';

// Custom SVG Icons
function GithubIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GmailIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  );
}

const footerLinks = {
  product: [
    { label: 'Chat', to: '/chat' },
    { label: 'Models', to: '/models' },
    { label: 'Dashboard', to: '/dashboard' },
  ],
  resources: [
    { label: 'Documentation', to: '/docs' },
    { label: 'Contributing', to: '/contributing' },
    { label: 'About', to: '/about' },
  ],
  company: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'GitHub', to: 'https://github.com/Muhammad-Saad-786/openaether', external: true },
    {
      label: 'Discord',
      to: 'https://discord.com/channels/@me/1348013074589945866',
      external: true,
    },
  ],
};

const socialLinks = [
  { icon: GithubIcon, href: 'https://github.com/Muhammad-Saad-786', label: 'GitHub' },
  { icon: LinkedinIcon, href: 'https://www.linkedin.com/in/muhammad-saad-asim', label: 'LinkedIn' },
  { icon: GmailIcon, href: 'mailto:saadasim123@gmail.com', label: 'Gmail' },
  {
    icon: MessageCircle,
    href: 'https://discord.com/channels/@me/1348013074589945866',
    label: 'Discord',
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      {/* Main Footer */}
      <div className="mx-auto max-full px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-aether-500 to-aether-400 transition-transform group-hover:scale-110">
                <span className="text-lg font-bold text-white">O</span>
              </div>
              <span className="text-xl font-bold gradient-text">OpenAether</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              Democratizing AI access through open source. Paste your API key and you're done. Free,
              private, and accessible to everyone.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex size-10 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-all hover:border-aether-500/30 hover:text-aether-500"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Community</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label} ↗
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-background/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row lg:px-8">
          <p className="text-sm text-muted-foreground">© 2025 OpenAether. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            Built with by{' '}
            <a
              href="https://saadasim.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-aether-500 hover:underline font-medium"
            >
              Saad Asim
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
