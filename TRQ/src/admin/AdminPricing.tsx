import { useState } from 'react';
import { Mail, Phone, Calendar, Building, MapPin, Clock, DollarSign, X, Send } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { PricingRequest } from './types';
import * as api from '../api';

export function AdminPricing() {
  const { pricingRequests, updatePricingStatus, refreshData } = useAdmin();
  const [selectedRequest, setSelectedRequest] = useState<PricingRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    subject: 'Your Quote from TRQ Design',
    message: '',
    quoteAmount: '',
  });

  const filteredRequests = filterStatus === 'all' 
    ? pricingRequests 
    : pricingRequests.filter(r => r.status === filterStatus);

  const statusColors = {
    new: 'bg-orange-100 text-orange-700',
    reviewed: 'bg-blue-100 text-blue-700',
    quoted: 'bg-purple-100 text-purple-700',
    closed: 'bg-green-100 text-green-700',
  };

  const budgetLabels: Record<string, string> = {
    'under-100k': 'Under 100,000 SAR',
    '100k-300k': '100,000 - 300,000 SAR',
    '300k-500k': '300,000 - 500,000 SAR',
    '500k-1m': '500,000 - 1,000,000 SAR',
    '1m-plus': '1,000,000+ SAR',
    'not-sure': 'Not sure yet',
  };

  const projectTypeLabels: Record<string, string> = {
    'residential-villa': 'Residential - Villa',
    'residential-apartment': 'Residential - Apartment',
    'commercial-office': 'Commercial - Office',
    'commercial-retail': 'Commercial - Retail',
    'commercial-hotel': 'Commercial - Hotel',
    'commercial-restaurant': 'Commercial - Restaurant',
    'exhibition-booth': 'Exhibition Booth',
    'event-design': 'Event Design',
    'furniture-design': 'Furniture Design',
    'other': 'Other',
  };

  const handleStatusChange = (id: number, status: PricingRequest['status']) => {
    updatePricingStatus(id, status);
    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status });
    }
  };

  const handleSendQuote = async () => {
    if (!selectedRequest || !quoteForm.message) return;
    
    setSending(true);
    try {
      const result = await api.sendQuote(selectedRequest.id, quoteForm);
      if (result.success) {
        alert('Quote sent successfully!');
        setShowQuoteModal(false);
        setQuoteForm({ subject: 'Your Quote from TRQ Design', message: '', quoteAmount: '' });
        setSelectedRequest({ ...selectedRequest, status: 'quoted' });
        refreshData();
      } else {
        alert(result.message || 'Failed to send quote');
      }
    } catch (error) {
      alert('Failed to send quote. Check server configuration.');
    } finally {
      setSending(false);
    }
  };

  const openQuoteModal = () => {
    if (!selectedRequest) return;
    setQuoteForm({
      subject: 'Your Quote from TRQ Design',
      message: `Thank you for your interest in TRQ Design services.\n\nBased on your ${projectTypeLabels[selectedRequest.projectType] || selectedRequest.projectType} project requirements, we have prepared the following quote for you.\n\nPlease feel free to contact us if you have any questions.`,
      quoteAmount: '',
    });
    setShowQuoteModal(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl tracking-wide">Pricing Requests</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-black/20 rounded focus:border-black focus:outline-none bg-white"
        >
          <option value="all">All Requests</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="quoted">Quoted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-black/5 max-h-[600px] overflow-y-auto">
            {filteredRequests.length === 0 ? (
              <p className="p-6 text-black/60 text-center">No requests found</p>
            ) : (
              filteredRequests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`w-full text-left p-4 hover:bg-neutral-50 transition-colors ${
                    selectedRequest?.id === request.id ? 'bg-neutral-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">{request.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${statusColors[request.status]}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-black/60">{projectTypeLabels[request.projectType] || request.projectType}</p>
                  <p className="text-sm text-black/40">{budgetLabels[request.budget] || request.budget}</p>
                  <p className="text-xs text-black/40 mt-1">{request.date}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Request Detail */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          {selectedRequest ? (
            <div>
              <div className="p-6 border-b border-black/5 flex items-center justify-between">
                <h2 className="text-xl">{selectedRequest.name}</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="lg:hidden p-2 hover:bg-neutral-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-black/40" />
                    <div>
                      <p className="text-sm text-black/60">Email</p>
                      <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 hover:underline">
                        {selectedRequest.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-black/40" />
                    <div>
                      <p className="text-sm text-black/60">Phone</p>
                      <a href={`tel:${selectedRequest.phone}`} className="hover:underline">
                        {selectedRequest.phone}
                      </a>
                    </div>
                  </div>
                  {selectedRequest.company && (
                    <div className="flex items-center gap-3">
                      <Building size={20} className="text-black/40" />
                      <div>
                        <p className="text-sm text-black/60">Company</p>
                        <p>{selectedRequest.company}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-black/40" />
                    <div>
                      <p className="text-sm text-black/60">Date</p>
                      <p>{selectedRequest.date}</p>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="border-t border-black/10 pt-6">
                  <h3 className="text-lg mb-4">Project Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Building size={20} className="text-black/40 mt-0.5" />
                      <div>
                        <p className="text-sm text-black/60">Project Type</p>
                        <p>{projectTypeLabels[selectedRequest.projectType] || selectedRequest.projectType}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-black/40 mt-0.5" />
                      <div>
                        <p className="text-sm text-black/60">Location</p>
                        <p>{selectedRequest.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign size={20} className="text-black/40 mt-0.5" />
                      <div>
                        <p className="text-sm text-black/60">Budget</p>
                        <p>{budgetLabels[selectedRequest.budget] || selectedRequest.budget}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={20} className="text-black/40 mt-0.5" />
                      <div>
                        <p className="text-sm text-black/60">Timeline</p>
                        <p className="capitalize">{selectedRequest.timeline.replace(/-/g, ' ')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-black/60 mb-2">Project Description</p>
                  <div className="bg-neutral-50 p-4 rounded">
                    <p className="whitespace-pre-wrap">{selectedRequest.description}</p>
                  </div>
                </div>

                {/* Preferred Contact */}
                <div>
                  <p className="text-sm text-black/60 mb-1">Preferred Contact Method</p>
                  <p className="capitalize">{selectedRequest.contactMethod}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-black/10">
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => handleStatusChange(selectedRequest.id, e.target.value as PricingRequest['status'])}
                    className="px-4 py-2 border border-black/20 rounded focus:border-black focus:outline-none bg-white"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="quoted">Quoted</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    onClick={openQuoteModal}
                    className="flex items-center gap-2 px-6 py-2 bg-black text-white hover:bg-black/80 transition-colors"
                  >
                    <Send size={18} />
                    Send Quote
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-black/60">
              <DollarSign size={48} className="mx-auto mb-4 opacity-20" />
              <p>Select a request to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Send Quote Modal */}
      {showQuoteModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-black/10 flex items-center justify-between">
              <h2 className="text-xl">Send Quote to {selectedRequest.name}</h2>
              <button onClick={() => setShowQuoteModal(false)} className="p-2 hover:bg-neutral-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-black/60 mb-1">To</label>
                <p className="px-4 py-2 bg-neutral-100 rounded">{selectedRequest.email}</p>
              </div>
              <div>
                <label className="block text-sm text-black/60 mb-1">Subject</label>
                <input
                  type="text"
                  value={quoteForm.subject}
                  onChange={(e) => setQuoteForm({ ...quoteForm, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-black/20 rounded focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-black/60 mb-1">Quote Amount (SAR)</label>
                <input
                  type="text"
                  value={quoteForm.quoteAmount}
                  onChange={(e) => setQuoteForm({ ...quoteForm, quoteAmount: e.target.value })}
                  className="w-full px-4 py-2 border border-black/20 rounded focus:border-black focus:outline-none"
                  placeholder="e.g., 150,000"
                />
              </div>
              <div>
                <label className="block text-sm text-black/60 mb-1">Message</label>
                <textarea
                  value={quoteForm.message}
                  onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                  className="w-full px-4 py-2 border border-black/20 rounded focus:border-black focus:outline-none resize-none"
                  rows={6}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSendQuote}
                  disabled={sending || !quoteForm.message}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-black text-white hover:bg-black/80 transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                  {sending ? 'Sending...' : 'Send Quote'}
                </button>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="px-6 py-3 border border-black/20 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
