import { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BlogArticle } from './BlogArticle';
import * as api from '../api';
import { useLanguage } from '../context/LanguageContext';

type BlogCategory = 'all' | 'design-tips' | 'trends' | 'projects' | 'insights';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  categorySlug: BlogCategory;
  tags: string[];
}

// Get article slug from hash (e.g., #blog/article-slug)
const getArticleSlugFromHash = (): string | null => {
  const hash = window.location.hash;
  const match = hash.match(/#blog\/(.+)/);
  return match ? match[1] : null;
};

export function Blog() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { ts, td, translateBatch, isRTL, language } = useLanguage();

  // Trigger translation when language changes or articles load
  useEffect(() => {
    if (language === 'ar' && articles.length > 0) {
      const dynamicTexts = articles.flatMap(article => [
        article.title,
        article.excerpt,
        article.category,
      ]);
      translateBatch(dynamicTexts.filter(Boolean));
    }
  }, [language, articles]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [selectedArticle]);

  // Load articles and check for article slug in URL
  useEffect(() => {
    api.getPublishedArticles()
      .then((data) => {
        setArticles(data);
        // Check if URL has article slug
        const slug = getArticleSlugFromHash();
        if (slug) {
          const article = data.find((a: Article) => a.slug === slug);
          if (article) setSelectedArticle(article);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
        setLoading(false);
      });
  }, []);

  // Handle hash changes for article navigation
  useEffect(() => {
    const handleHashChange = () => {
      const slug = getArticleSlugFromHash();
      if (slug) {
        const article = articles.find(a => a.slug === slug);
        if (article) setSelectedArticle(article);
      } else if (window.location.hash === '#blog') {
        setSelectedArticle(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [articles]);

  const categories = [
    { id: 'all', label: ts('blog.allArticles') },
    { id: 'design-tips', label: ts('blog.designTips') },
    { id: 'trends', label: ts('blog.trends') },
    { id: 'projects', label: ts('blog.projects') },
    { id: 'insights', label: ts('blog.insights') },
  ];

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(article => article.categorySlug === activeCategory);

  const featuredArticle = filteredArticles[0];

  // Handle selecting an article - update URL
  const handleSelectArticle = (article: Article) => {
    window.location.hash = `blog/${article.slug}`;
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Handle back to blog - update URL
  const handleBackToBlog = () => {
    window.location.hash = 'blog';
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (selectedArticle) {
    return <BlogArticle article={selectedArticle} onBack={handleBackToBlog} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-black/60">{ts('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl mb-4">{ts('blog.noArticles')}</h2>
          <p className="text-black/60">{ts('common.noResults')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full blog-page ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <ImageWithFallback
          src={featuredArticle?.image || '/images/blog-hero.jpg'}
          alt="TRQ Blog"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-7xl tracking-wider mb-6 blog-title">{ts('blog.heroTitle')}</h1>
          <p className="text-xl opacity-90 blog-excerpt">
            {ts('blog.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm tracking-widest text-black/60 mb-8">{ts('blog.featured')}</p>
          </div>
          <div
            onClick={() => handleSelectArticle(featuredArticle)}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto cursor-pointer group ${isRTL ? 'lg:grid-flow-dense' : ''}`}
          >
            <div className={`relative h-[400px] lg:h-[500px] overflow-hidden ${isRTL ? 'lg:order-2' : ''}`}>
              <ImageWithFallback
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className={`flex flex-col justify-center ${isRTL ? 'lg:order-1 text-right' : ''}`}>
              <div className={`inline-block px-4 py-2 bg-black/5 text-sm tracking-wider mb-4 w-fit ${isRTL ? 'mr-0 ml-auto lg:ml-auto lg:mr-0' : ''}`}>
                {td(featuredArticle.category)}
              </div>
              <h2 className="text-4xl md:text-5xl mb-6 tracking-wide">
                {td(featuredArticle.title)}
              </h2>
              <p className="text-lg text-black/70 mb-8">
                {td(featuredArticle.excerpt)}
              </p>
              <div className={`flex items-center gap-6 text-sm text-black/60 mb-8 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar size={16} />
                  <span>{featuredArticle.date}</span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Clock size={16} />
                  <span>{featuredArticle.readTime}</span>
                </div>
              </div>
              <div className={`flex items-center gap-2 text-black group-hover:gap-4 transition-all ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <span className="tracking-widest">{ts('common.readArticle')}</span>
                <ArrowRight size={20} className={isRTL ? 'rotate-180' : ''} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 border-y border-black/10">
        <div className={`max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as BlogCategory)}
              className={`px-6 py-3 tracking-wider transition-colors ${
                activeCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-transparent text-black hover:bg-black/5'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>


      {/* Articles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.slice(1).map((article) => (
            <article
              key={article.id}
              onClick={() => handleSelectArticle(article)}
              className={`group cursor-pointer ${isRTL ? 'text-right' : ''}`}
            >
              <div className="relative h-64 overflow-hidden mb-4">
                <ImageWithFallback
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'}`}>
                  <span className="inline-block px-3 py-1 bg-white text-sm tracking-wider">
                    {td(article.category)}
                  </span>
                </div>
              </div>
              <h3 className="text-xl mb-3 group-hover:opacity-70 transition-opacity">
                {td(article.title)}
              </h3>
              <p className="text-sm text-black/60 mb-4 line-clamp-2">
                {td(article.excerpt)}
              </p>
              <div className={`flex items-center gap-4 text-xs text-black/60 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar size={14} />
                  <span>{article.date}</span>
                </div>
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Clock size={14} />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-black/60">{ts('blog.noArticles')}</p>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl mb-6 tracking-wide">{ts('blog.newsletterTitle')}</h2>
          <p className="text-lg text-white/70 mb-12">
            {ts('blog.newsletterText')}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 max-w-xl mx-auto ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <input
              type="email"
              placeholder={ts('blog.emailPlaceholder')}
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <button className="px-8 py-4 bg-white text-black tracking-widest hover:bg-white/90 transition-colors">
              {ts('common.subscribe')}
            </button>
          </div>
          <p className="text-xs text-white/50 mt-6">
            {ts('blog.privacyNote')}
          </p>
        </div>
      </section>

      {/* Explore by Category */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-16 tracking-wide">
            {ts('blog.exploreByCategory')}
          </h2>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${isRTL ? 'direction-rtl' : ''}`}>
            {categories.filter(cat => cat.id !== 'all').map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id as BlogCategory);
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }}
                className="p-8 border-2 border-black/10 hover:border-black hover:bg-black hover:text-white transition-all group"
              >
                <h3 className="text-xl mb-2">{category.label}</h3>
                <p className="text-sm opacity-60">
                  {articles.filter(a => a.categorySlug === category.id).length} {ts('blog.articles')}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
