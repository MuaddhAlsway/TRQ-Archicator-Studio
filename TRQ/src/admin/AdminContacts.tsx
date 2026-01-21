import { useState } from 'react';
import { Mail, Phone, Calendar, X, Send, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { ContactSubmission } from './types';
import { sendContactReply } from '../api';

export function AdminContacts() {
  const { contacts, updateContactStatus } = useAdmin();
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredContacts = filterStatus === 'all' 
    ? contacts 
    : contacts.filter(c => c.status === filterStatus);

  const statusColors = {
    new: 'bg-orange-100 text-orange-700',
    read: 'bg-blue-100 text-blue-700',
    replied: 'bg-green-100 text-green-700',
  };

  const handleStatusChange = (id: number, status: ContactSubmission['status']) => {
    updateContactStatus(id, status);
    if (selectedContact?.id === id) {
      setSelectedContact({ ...selectedContact, status });
    }
  };

  const openReplyModal = () => {
    if (selectedContact) {
      setReplySubject(`Re: ${selectedContact.subject}`);
      setReplyMessage('');
      setShowReplyModal(true);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSendReply = async () => {
    if (!selectedContact || !replyMessage.trim()) return;
    
    setSending(true);
    try {
      const result = await sendContactReply(selectedContact.id, {
        subject: replySubject,
        message: replyMessage,
      });
      
      if (result.success) {
        showToast('success', 'Reply sent successfully!');
        setShowReplyModal(false);
        handleStatusChange(selectedContact.id, 'replied');
      } else {
        showToast('error', result.message || 'Failed to send reply');
      }
    } catch (error) {
      showToast('error', 'Failed to send reply. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl tracking-wide">Contact Messages</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-black/20 rounded focus:border-black focus:outline-none bg-white"
        >
          <option value="all">All Messages</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-black/5 max-h-[600px] overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <p className="p-6 text-black/60 text-center">No messages found</p>
            ) : (
              filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    if (contact.status === 'new') {
                      handleStatusChange(contact.id, 'read');
                    }
                  }}
                  className={`w-full text-left p-4 hover:bg-neutral-50 transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-neutral-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">{contact.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${statusColors[contact.status]}`}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-sm text-black/60 truncate">{contact.subject}</p>
                  <p className="text-xs text-black/40 mt-1">{contact.date}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          {selectedContact ? (
            <div>
              <div className="p-6 border-b border-black/5 flex items-center justify-between">
                <h2 className="text-xl">{selectedContact.name}</h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="lg:hidden p-2 hover:bg-neutral-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-black/40" />
                    <div>
                      <p className="text-sm text-black/60">Email</p>
                      <span className="text-blue-600">{selectedContact.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-black/40" />
                    <div>
                      <p className="text-sm text-black/60">Phone</p>
                      <a href={`tel:${selectedContact.phone}`} className="hover:underline">
                        {selectedContact.phone || 'Not provided'}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-black/40" />
                    <div>
                      <p className="text-sm text-black/60">Date</p>
                      <p>{selectedContact.date}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-black/60 mb-2">Subject</p>
                  <p className="capitalize">{selectedContact.subject}</p>
                </div>

                <div>
                  <p className="text-sm text-black/60 mb-2">Message</p>
                  <div className="bg-neutral-50 p-4 rounded">
                    <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-black/10">
                  <select
                    value={selectedContact.status}
                    onChange={(e) => handleStatusChange(selectedContact.id, e.target.value as ContactSubmission['status'])}
                    className="px-4 py-2 border border-black/20 rounded focus:border-black focus:outline-none bg-white"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                  <button
                    onClick={openReplyModal}
                    className="px-6 py-2 bg-black text-white hover:bg-black/80 transition-colors flex items-center gap-2"
                  >
                    <Send size={16} />
                    Reply via Email
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-black/60">
              <Mail size={48} className="mx-auto mb-4 opacity-20" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>

      {showReplyModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="p-6 border-b border-black/10 flex items-center justify-between">
              <h3 className="text-xl">Reply to {selectedContact.name}</h3>
              <button onClick={() => setShowReplyModal(false)} className="p-2 hover:bg-neutral-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-black/60 mb-2">To</label>
                <input type="text" value={selectedContact.email} disabled className="w-full px-4 py-2 border border-black/20 rounded bg-neutral-50" />
              </div>
              <div>
                <label className="block text-sm text-black/60 mb-2">Subject</label>
                <input type="text" value={replySubject} onChange={(e) => setReplySubject(e.target.value)} className="w-full px-4 py-2 border border-black/20 rounded focus:border-black focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-black/60 mb-2">Message</label>
                <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} rows={6} className="w-full px-4 py-2 border border-black/20 rounded focus:border-black focus:outline-none resize-none" placeholder="Type your reply..." />
              </div>
            </div>
            <div className="p-6 border-t border-black/10 flex justify-end gap-4">
              <button onClick={() => setShowReplyModal(false)} className="px-6 py-2 border border-black/20 hover:bg-neutral-50 transition-colors">Cancel</button>
              <button onClick={handleSendReply} disabled={sending || !replyMessage.trim()} className="px-6 py-2 bg-black text-white hover:bg-black/80 transition-colors flex items-center gap-2 disabled:opacity-50">
                {sending ? (<><Loader2 size={16} className="animate-spin" />Sending...</>) : (<><Send size={16} />Send Reply</>)}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
