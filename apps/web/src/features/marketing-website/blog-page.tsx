import { useState, useMemo, type ReactElement } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowRight, ArrowLeft, BookOpen, Clock, Calendar, Search, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';
import { PageReveal } from '@/features/marketing-website/page-reveal';
import { BLOG_POSTS, type BlogPost } from '@/features/marketing-website/public-site.data';

export function BlogPage(): ReactElement {
  const { slug } = useParams<{ slug?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeArticle: BlogPost | undefined = useMemo(() => {
    if (!slug) return undefined;
    return BLOG_POSTS.find((p) => p.slug === slug);
  }, [slug]);

  const categories = useMemo(() => {
    return ['All', 'Billing & POS', 'Wholesale', 'Tax & Compliance', 'Inventory', 'Retail Growth'];
  }, []);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // If viewing a single article
  if (activeArticle) {
    return (
      <PublicSiteLayout>
        <div className="max-w-4xl mx-auto space-y-10 pt-4">
          <PageReveal>
            <div className="space-y-6">
              <Button asChild variant="ghost" size="sm" className="rounded-xl -ml-3 text-muted-foreground hover:text-foreground">
                <Link to="/blog">
                  <ArrowLeft className="mr-1.5 size-4" />
                  Back to all guides
                </Link>
              </Button>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                  {activeArticle.category}
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.2]">
                  {activeArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground pt-1 border-b border-border/70 pb-6">
                  <span className="font-semibold text-foreground">{activeArticle.author.name}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {activeArticle.publishedDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {activeArticle.readTime}
                  </span>
                </div>
              </div>
            </div>
          </PageReveal>

          {/* Key Takeaways Box */}
          <PageReveal delay={0.05}>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider">
                <Sparkles className="size-4" />
                Key Actionable Takeaways
              </div>
              <ul className="grid gap-2.5 sm:grid-cols-2 text-xs sm:text-sm text-foreground">
                {activeArticle.content.keyTakeaways.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </PageReveal>

          {/* Body Content */}
          <PageReveal delay={0.1}>
            <div className="space-y-8 text-sm sm:text-base leading-relaxed text-foreground/90">
              <p className="text-base sm:text-lg font-medium text-muted-foreground leading-relaxed">
                {activeArticle.content.introduction}
              </p>

              {activeArticle.content.sections.map((section) => (
                <div key={section.heading} className="space-y-3 pt-2">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {section.heading}
                  </h2>
                  {section.body.map((p, idx) => (
                    <p key={idx} className="text-muted-foreground leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              ))}

              <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-2 mt-8">
                <h3 className="text-base font-bold text-foreground">Conclusion</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activeArticle.content.conclusion}
                </p>
              </div>
            </div>
          </PageReveal>

          {/* Inline CTA */}
          <PageReveal delay={0.15}>
            <Card className="rounded-2xl sm:rounded-3xl border-border/80 bg-primary text-primary-foreground shadow-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5">
                <h4 className="text-lg sm:text-xl font-bold">Put these best practices into action</h4>
                <p className="text-xs sm:text-sm text-primary-foreground/90">
                  Try Trimorg free for 14 days and experience high-clarity billing and inventory.
                </p>
              </div>
              <Button asChild size="lg" variant="secondary" className="rounded-xl shadow-md shrink-0 font-semibold">
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </Card>
          </PageReveal>
        </div>
      </PublicSiteLayout>
    );
  }

  // Blog Index Page
  return (
    <PublicSiteLayout>
      <div className="space-y-10 sm:space-y-14">
        {/* Header */}
        <PageReveal>
          <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <BookOpen className="size-4" />
              <span>Trimorg Resources & Guides</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              Business Guides & Operational Insights
            </h1>

            <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Practical guides on inventory management, high-speed POS billing, tax compliance, and scaling wholesale operations.
            </p>
          </div>
        </PageReveal>

        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between max-w-5xl mx-auto">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl h-9.5 text-xs"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {filteredPosts.map((post, index) => (
            <PageReveal key={post.slug} delay={index * 0.05}>
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <Card className="h-full flex flex-col justify-between rounded-2xl border-border/80 bg-card shadow-sm hover:border-primary/40 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="space-y-3 p-6">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                        {post.category}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 border-t border-border/40 mt-auto flex items-center justify-between text-xs font-semibold text-primary">
                    <span>Read Full Guide</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </CardContent>
                </Card>
              </Link>
            </PageReveal>
          ))}
        </div>
      </div>
    </PublicSiteLayout>
  );
}
