import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { ArticleEditor } from './ArticleEditor';
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
  categorySlug: string;
  tags: string[];
  status: string;
}

export function AdminBlog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'design-tips', label: 'Design Tips' },
    { id: 'trends', label: 'Trends' },
    { id: 'projects', label: 'Projects' },
    { id: 'insights', label: 'Insights' },
  ];

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await api.getArticles();
      setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || article.categorySlug === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleStatus = async (article: Article) => {
    try {
      const newStatus = article.status === 'published' ? 'draft' : 'published';
      await api.updateArticle(article.id, { ...article, status: newStatus });
      setArticles(prev => prev.map(a => 
        a.id === article.id ? { ...a, status: newStatus } : a
      ));
    } catch (error) {
      console.error('Error updating article status:', error);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Article',
      message: 'Are you sure you want to delete this article? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await api.deleteArticle(id);
          setArticles(prev => prev.filter(a => a.id !== id));
        } catch (error) {
          console.error('Error deleting article:', error);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleSave = () => {
    loadArticles();
    setEditingArticle(null);
    setIsCreating(false);
  };

  if (isCreating || editingArticle) {
    return (
      <ArticleEditor
        article={editingArticle}
        onSave={handleSave}
        onCancel={() => {
          setEditingArticle(null);
          setIsCreating(false);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl tracking-wide">Blog Articles</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-black/80 transition-colors"
        >
          <Plus size={20} />
          <span>Add Article</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-black/20 rounded focus:border-black focus:outline-none"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-black/20 rounded focus:border-black focus:outline-none bg-white"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-black/5">
              <tr>
                <th className="text-left px-6 py-4 text-sm tracking-wider text-black/60">ARTICLE</th>
                <th className="text-left px-6 py-4 text-sm tracking-wider text-black/60">CATEGORY</th>
                <th className="text-left px-6 py-4 text-sm tracking-wider text-black/60">AUTHOR</th>
                <th className="text-left px-6 py-4 text-sm tracking-wider text-black/60">DATE</th>
                <th className="text-left px-6 py-4 text-sm tracking-wider text-black/60">STATUS</th>
                <th className="text-right px-6 py-4 text-sm tracking-wider text-black/60">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-black/60">
                    No articles found
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium line-clamp-1">{article.title}</p>
                          <p className="text-sm text-black/60">{article.readTime}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{article.category}</td>
                    <td className="px-6 py-4">{article.author}</td>
                    <td className="px-6 py-4 text-sm">{article.date}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        article.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(article)}
                          className="p-2 hover:bg-neutral-100 rounded transition-colors"
                          title={article.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {article.status === 'published' ? (
                            <EyeOff size={18} className="text-black/60" />
                          ) : (
                            <Eye size={18} className="text-black/60" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingArticle(article)}
                          className="p-2 hover:bg-neutral-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} className="text-black/60" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
