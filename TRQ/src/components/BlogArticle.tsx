import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../context/LanguageContext';
import * as api from '../api';

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
  categorySlug?: string;
  tags: string[];
}

interface BlogArticleProps {
  article: Article;
  onBack: () => void;
}

export function BlogArticle({ article, onBack }: BlogArticleProps) {
  const { ts, td, translateBatch, isRTL, language } = useLanguage();
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  
  // Text alignment class for Arabic
  const textAlign = isRTL ? 'text-right' : 'text-left';

  // Split content into paragraphs for translation
  const contentParagraphs = article.content ? article.content.split('\n\n').filter(p => p.trim()) : [];

  // Fetch related articles (same category, excluding current)
  useEffect(() => {
    api.getPublishedArticles()
      .then((articles: Article[]) => {
        const related = articles
          .filter(a => a.id !== article.id && (a.categorySlug === article.categorySlug || a.category === article.category))
          .slice(0, 3);
        // If not enough in same category, fill with other articles
        if (related.length < 3) {
          const others = articles
            .filter(a => a.id !== article.id && !related.find(r => r.id === a.id))
            .slice(0, 3 - related.length);
          related.push(...others);
        }
        setRelatedArticles(related);
      })
      .catch(() => setRelatedArticles([]));
  }, [article.id, article.categorySlug, article.category]);

  // Translate dynamic content from database
  useEffect(() => {
    if (language === 'ar') {
      const articleTexts = [
        article.title, 
        article.excerpt, 
        article.category, 
        article.author, 
        ...contentParagraphs,
        ...(article.tags || []),
        ...relatedArticles.flatMap(a => [a.title, a.excerpt, a.category])
      ];
      translateBatch(articleTexts.filter(Boolean));
    }
  }, [language, article.id, relatedArticles]); // eslint-disable-line react-hooks/exhaustive-deps

  // Format read time for Arabic
  const formatReadTime = (readTime: string) => {
    if (language === 'ar') {
      const minutes = readTime.replace(/[^0-9]/g, '');
      return `${minutes} ${ts('blogArticle.minRead')}`;
    }
    return readTime;
  };

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Back Button */}
      <div className="bg-white border-b border-black/5 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={onBack} className={`inline-flex items-center gap-2 text-black hover:opacity-70 transition-opacity ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''} />
            <span className="tracking-wider">{ts('blogArticle.backToBlog')}</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative h-[70vh] overflow-hidden">
        <ImageWithFallback src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className={`absolute bottom-0 left-0 right-0 text-white p-8 ${isRTL ? 'text-right' : ''}`}>
          <div className="max-w-4xl mx-auto">
            <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-sm tracking-widest mb-4">{td(article.category)}</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-wide mb-4 leading-tight">{td(article.title)}</h1>
            <p className="text-xl opacity-90 mb-6 max-w-3xl">{td(article.excerpt)}</p>
            <div className={`flex flex-wrap items-center gap-6 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><User size={16} /><span>{td(article.author)}</span></div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Calendar size={16} /><span>{article.date}</span></div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><Clock size={16} /><span>{formatReadTime(article.readTime)}</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Social Share */}
          <div className={`flex items-center justify-between border-b border-black/10 pb-8 mb-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Share2 size={20} className="text-black/40" />
              <span className="text-sm text-black/60 tracking-wider">{ts('blogArticle.shareArticle')}</span>
            </div>
            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors"><Facebook size={18} /></button>
              <button className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors"><Twitter size={18} /></button>
              <button className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors"><Linkedin size={18} /></button>
            </div>
          </div>

          {/* Article Body - Rich Text Content */}
          <div 
            className={`blog-rich-content prose prose-lg max-w-none ${isRTL ? 'text-right' : 'text-left'}`}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          <div className="mt-16 pt-8 border-t border-black/10">
            <p className="text-sm text-black/60 tracking-wider mb-4">{ts('blogArticle.tags')}</p>
            <div className={`flex flex-wrap gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {(article.tags || []).map((tag, index) => (
                <span key={index} className="px-4 py-2 border border-black/20 text-sm tracking-wider hover:bg-black hover:text-white hover:border-black transition-colors cursor-pointer">{td(tag)}</span>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-16 p-8 bg-neutral-50">
            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <div className="w-20 h-20 bg-black/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={32} className="text-black/40" />
              </div>
              <div>
                <h3 className="text-2xl mb-2 tracking-wide">{td(article.author)}</h3>
                <p className="text-sm text-black/60 mb-3">{ts('blogArticle.seniorWriter')}</p>
                <p className="text-black/70">{ts('blogArticle.authorBio')}</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl mb-12 text-center tracking-wide">{ts('blogArticle.relatedArticles')}</h2>
          {relatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <article
                  key={relatedArticle.id}
                  onClick={() => {
                    window.location.hash = `blog/${relatedArticle.slug}`;
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className={`group cursor-pointer bg-white ${isRTL ? 'text-right' : ''}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'}`}>
                      <span className="inline-block px-3 py-1 bg-white text-xs tracking-wider">
                        {td(relatedArticle.category)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg mb-2 group-hover:opacity-70 transition-opacity line-clamp-2">
                      {td(relatedArticle.title)}
                    </h3>
                    <p className="text-sm text-black/60 mb-4 line-clamp-2">
                      {td(relatedArticle.excerpt)}
                    </p>
                    <div className={`flex items-center gap-4 text-xs text-black/60 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Calendar size={12} />
                        <span>{relatedArticle.date}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Clock size={12} />
                        <span>{relatedArticle.readTime}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center text-black/60"><p>{ts('blogArticle.moreComingSoon')}</p></div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl mb-6 tracking-wide">{ts('blogArticle.stayInspired')}</h2>
          <p className="text-lg text-white/70 mb-12">{ts('blogArticle.newsletterText')}</p>
          
          {subscribeStatus === 'success' ? (
            <div className="flex items-center justify-center gap-3 text-green-400">
              <CheckCircle size={24} />
              <span className="text-lg">{subscribeMessage || ts('blogArticle.subscribeSuccess')}</span>
            </div>
          ) : (
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email) return;
                setSubscribeStatus('loading');
                try {
                  const result = await api.subscribeNewsletter(email);
                  if (result.success) {
                    setSubscribeStatus('success');
                    setSubscribeMessage(result.message);
                    setEmail('');
                  } else {
                    setSubscribeStatus('error');
                    setSubscribeMessage(result.message);
                  }
                } catch {
                  setSubscribeStatus('error');
                  setSubscribeMessage('Failed to subscribe');
                }
              }}
              className={`flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto ${isRTL ? 'sm:flex-row-reverse' : ''}`}
            >
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ts('blogArticle.emailPlaceholder')} 
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white" 
                dir={isRTL ? 'rtl' : 'ltr'} 
                required
              />
              <button 
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="px-8 py-4 bg-white text-black hover:bg-white/90 transition-colors tracking-wider disabled:opacity-50"
              >
                {subscribeStatus === 'loading' ? '...' : ts('blogArticle.subscribe')}
              </button>
            </form>
          )}
          
          {subscribeStatus === 'error' && (
            <p className="text-red-400 mt-4">{subscribeMessage}</p>
          )}
        </div>
      </section>
    </div>
  );
}
