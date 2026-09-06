// src/pages/BlogPage.jsx
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const blogPosts = [
  {
    id: 1,
    title: 'Introducing OpenAether: Free AI for Everyone',
    excerpt:
      'Learn how OpenAether is democratizing AI access with free models from multiple providers.',
    date: '2025-01-15',
    readTime: '5 min read',
    category: 'Announcement',
    tags: ['Open Source', 'AI', 'Launch'],
  },
  {
    id: 2,
    title: 'How Smart Model Routing Works',
    excerpt:
      'Discover how OpenAether automatically switches between models when rate limits are hit.',
    date: '2025-02-01',
    readTime: '7 min read',
    category: 'Tutorial',
    tags: ['Smart Routing', 'Rate Limits', 'Models'],
  },
  {
    id: 3,
    title: 'Getting Started with OpenRouter API',
    excerpt: 'A step-by-step guide to getting your free API key and connecting it to OpenAether.',
    date: '2025-02-15',
    readTime: '4 min read',
    category: 'Guide',
    tags: ['API', 'Setup', 'OpenRouter'],
  },
  {
    id: 4,
    title: 'CLI Version: Coming Soon',
    excerpt:
      'Use OpenAether directly in your terminal. No more copy-paste between browser and IDE.',
    date: '2025-03-01',
    readTime: '3 min read',
    category: 'Upcoming',
    tags: ['CLI', 'Terminal', 'Developer Tools'],
  },
];

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
              Updates, tutorials, and insights from the OpenAether team.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group relative rounded-2xl border bg-card p-8 transition-all duration-300 hover:border-aether-500/30 hover:shadow-lg hover:shadow-aether-500/5"
              >
                {/* Category Badge */}
                <div className="mb-4">
                  <Badge variant="secondary" className="bg-aether-500/10 text-aether-500">
                    {post.category}
                  </Badge>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-3 group-hover:text-aether-500 transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-muted-foreground mb-6 leading-relaxed">{post.excerpt}</p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>{post.readTime}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                    >
                      <Tag className="size-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Read More */}
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-aether-500 hover:underline"
                >
                  Read More
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-aether-500/10 to-aether-400/10 px-8 py-16 text-center">
            <Sparkles className="size-12 text-aether-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold gradient-text">Stay Updated</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Follow us on GitHub for the latest updates.
            </p>
            <div className="mt-8">
              <a
                href="https://github.com/Muhammad-Saad-786/openaether"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="gradient" size="xl" className="px-8">
                  Follow on GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BlogPage;
