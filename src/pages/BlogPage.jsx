// src/pages/BlogPage.jsx
import { Link } from 'react-router-dom';
import { Zap, Users, Globe, Code2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl gradient-text">
              Blog
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Read latest articles about AI, open source, and development tips.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Post 1 */}
            <div>
              <div className="group rounded-xl bg-card p-6 transition-all duration-300 hover:border-aether-500/30 hover:shadow-lg">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-aether-500/10">
                  <Zap className="size-6 text-aether-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">AI Model Comparison</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Comparing different AI models for various use cases.
                </p>
                <div className="mt-4">
                  <Link to="#" className="text-primary hover:underline transition-colors">
                    Read more
                  </Link>
                </div>
              </div>
            </div>
            {/* Post 2 */}
            <div>
              <div className="group rounded-xl bg-card p-6 transition-all duration-300 hover:border-aether-500/30 hover:shadow-lg">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-aether-500/10">
                  <Users className="size-6 text-aether-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Open Source AI</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  How open source is transforming AI accessibility.
                </p>
                <div className="mt-4">
                  <Link to="#" className="text-primary hover:underline transition-colors">
                    Read more
                  </Link>
                </div>
              </div>
            </div>
            {/* Post 3 */}
            <div>
              <div className="group rounded-xl bg-card p-6 transition-all duration-300 hover:border-aether-500/30 hover:shadow-lg">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-aether-500/10">
                  <Globe className="size-6 text-aether-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Local AI Deployment</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Running AI models locally for privacy and control.
                </p>
                <div className="mt-4">
                  <Link to="#" className="text-primary hover:underline transition-colors">
                    Read more
                  </Link>
                </div>
              </div>
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
                Stay Updated
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Subscribe for latest news and articles.
              </p>
              <div className="mt-8">
                <Link to="/contact">
                  <Button variant="outline" size="xl" className="px-8">
                    Contact Us
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

export default BlogPage;