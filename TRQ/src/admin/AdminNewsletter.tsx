import { useState, useEffect } from 'react';
import { Mail, Download, Trash2, Users, UserCheck, UserX, Send, X } from 'lucide-react';
import * as api from '../api';

interface Subscriber {
  id: number;
  email: string;
  status: string;
  createdAt: string;
}

export function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [showCompose, setShowCompose] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
  });

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const data = await api.getNewsletterSubscribers();
      setSubscribers(data);
    } catch (error) {
      console.error('Error loading subscribers:', error);
    }
    setLoading(false);
  };

  const handleUnsubscribe = async (email: string) => {
    if (!confirm('Are you sure you want to unsubscribe this email?')) return;
    try {
      await api.unsubscribeNewsletter(email);
      loadSubscribers();
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  };

  const exportCSV = () => {
    const activeSubscribers = subscribers.filter(s => s.status === 'active');
    const csv = ['Email,Subscribed Date', ...activeSubscribers.map(s => `${s.email},${s.createdAt}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredSubscribers = subscribers.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;

  const handleSendNewsletter = async () => {
    if (!emailData.subject || !emailData.content) {
      alert('Please fill in subject and content');
      return;
    }
    if (activeCount === 0) {
      alert('No active subscribers to send to');
      return;
    }
    if (!confirm(`Send newsletter to ${activeCount} subscribers?`)) return;

    setSending(true);
    setSendResult(null);
    try {
      const result = await api.sendNewsletter(emailData.subject, emailData.content);
      setSendResult(result);
      if (result.success) {
        setEmailData({ subject: '', content: '' });
      }
    } catch (error) {
      setSendResult({ success: false, message: 'Failed to send newsletter' });
    }
    setSending(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl tracking-wide">Newsletter Subscribers</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-black/80 transition-colors"
          >
            <Send size={18} />
            Send Newsletter
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-black/20 hover:border-black transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Compose Newsletter Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-medium">Compose Newsletter</h2>
              <button onClick={() => setShowCompose(false)} className="p-2 hover:bg-neutral-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-black/60">
                This will send an email to <strong>{activeCount}</strong> active subscribers.
              </p>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 border border-black/20 rounded focus:border-black focus:outline-none"
                  placeholder="Newsletter subject line"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <textarea
                  value={emailData.content}
                  onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 border border-black/20 rounded focus:border-black focus:outline-none resize-none"
                  rows={10}
                  placeholder="Write your newsletter content here..."
                />
              </div>

              {sendResult && (
                <div className={`p-4 rounded ${sendResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {sendResult.message}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSendNewsletter}
                  disabled={sending}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-black text-white hover:bg-black/80 transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                  {sending ? 'Sending...' : 'Send Newsletter'}
                </button>
                <button
                  onClick={() => setShowCompose(false)}
                  className="px-6 py-3 border border-black/20 hover:border-black transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-black/60">Total Subscribers</p>
              <p className="text-2xl font-medium">{subscribers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-black/60">Active</p>
              <p className="text-2xl font-medium">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <UserX size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-black/60">Unsubscribed</p>
              <p className="text-2xl font-medium">{unsubscribedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'unsubscribed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm tracking-wider transition-colors ${
              filter === f ? 'bg-black text-white' : 'border border-black/20 hover:border-black'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Subscribers List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-black/60">Loading...</div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="p-8 text-center text-black/60">
            <Mail size={48} className="mx-auto mb-4 opacity-30" />
            <p>No subscribers yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-neutral-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-black/60">Email</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-black/60">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-black/60">Subscribed</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-black/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-black/40" />
                      <span>{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs rounded ${
                      subscriber.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {subscriber.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-black/60">
                    {new Date(subscriber.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {subscriber.status === 'active' && (
                      <button
                        onClick={() => handleUnsubscribe(subscriber.email)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Unsubscribe"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
