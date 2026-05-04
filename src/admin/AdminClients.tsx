import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import * as api from '../api';

interface ClientLogo {
  id?: string;
  src: string;
  alt: string;
  isActive?: boolean;
  createdAt?: string;
}

export function AdminClients() {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ src: '', alt: '' });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load clients from localStorage (or API in production)
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    try {
      setLoading(true);
      // Get from localStorage or use default
      const stored = localStorage.getItem('trq_clients');
      if (stored) {
        setClients(JSON.parse(stored));
      } else {
        // Default clients
        const defaultClients: ClientLogo[] = [
          { id: '1', src: '/clientLogos/client1.jpeg', alt: 'Client 1', isActive: true },
          { id: '2', src: '/clientLogos/client2.jpeg', alt: 'Client 2', isActive: true },
          { id: '3', src: '/clientLogos/client3.jpeg', alt: 'Client 3', isActive: true },
          { id: '4', src: '/clientLogos/client4.jpeg', alt: 'Client 4', isActive: true },
          { id: '5', src: '/clientLogos/client1.jpeg', alt: 'Client 5', isActive: true },
          { id: '6', src: '/clientLogos/client2.jpeg', alt: 'Client 6', isActive: true },
        ];
        setClients(defaultClients);
        localStorage.setItem('trq_clients', JSON.stringify(defaultClients));
      }
      setError('');
    } catch (err) {
      setError('Failed to load clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.src || !formData.alt) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const newClient: ClientLogo = {
        id: Date.now().toString(),
        src: formData.src,
        alt: formData.alt,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      const updated = [...clients, newClient];
      setClients(updated);
      localStorage.setItem('trq_clients', JSON.stringify(updated));
      
      setFormData({ src: '', alt: '' });
      setShowForm(false);
      setSuccess('Client logo added successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add client');
      console.error(err);
    }
  };

  const handleDeleteClient = (id: string | undefined) => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this client logo?')) {
      try {
        const updated = clients.filter(c => c.id !== id);
        setClients(updated);
        localStorage.setItem('trq_clients', JSON.stringify(updated));
        setSuccess('Client logo deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete client');
        console.error(err);
      }
    }
  };

  const handleToggleActive = (id: string | undefined) => {
    if (!id) return;

    try {
      const updated = clients.map(c =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      );
      setClients(updated);
      localStorage.setItem('trq_clients', JSON.stringify(updated));
      setSuccess('Client status updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update client');
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // In production, upload to server/CDN
      // For now, create a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setFormData({ ...formData, src: dataUrl });
        setSuccess('Image uploaded successfully');
        setTimeout(() => setSuccess(''), 3000);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const activeClients = clients.filter(c => c.isActive).length;
  const inactiveClients = clients.filter(c => !c.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Client Logos</h1>
          <p className="text-black/60">Manage and customize client logos displayed in the carousel</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-black/80 transition-colors"
        >
          <Plus size={20} />
          Add Client Logo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-black/10">
          <p className="text-black/60 text-sm mb-1">Total Logos</p>
          <p className="text-3xl font-bold">{clients.length}</p>
        </div>
        <div className="bg-white p-4 border border-black/10">
          <p className="text-black/60 text-sm mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">{activeClients}</p>
        </div>
        <div className="bg-white p-4 border border-black/10">
          <p className="text-black/60 text-sm mb-1">Inactive</p>
          <p className="text-3xl font-bold text-red-600">{inactiveClients}</p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3">
          {success}
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="bg-white p-6 border border-black/10">
          <h2 className="text-xl font-bold mb-4">Add New Client Logo</h2>
          <form onSubmit={handleAddClient} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Logo Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.src}
                  onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                  placeholder="Image URL or path (e.g., /clientLogos/client5.jpeg)"
                  className="flex-1 px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                />
                <label className="px-4 py-2 bg-black text-white hover:bg-black/80 transition-colors cursor-pointer flex items-center gap-2">
                  <Upload size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  {uploading ? 'Uploading...' : 'Upload'}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Alt Text</label>
              <input
                type="text"
                value={formData.alt}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                placeholder="Client name or description"
                className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white hover:bg-black/80 transition-colors"
              >
                Add Client
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ src: '', alt: '' });
                }}
                className="px-4 py-2 border border-black/20 hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clients List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/60">Loading clients...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-white p-12 text-center border border-black/10">
          <p className="text-black/60 mb-4">No client logos yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-black/80 transition-colors"
          >
            <Plus size={20} />
            Add First Client
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className={`bg-white p-4 border transition-all ${
                client.isActive ? 'border-black/10' : 'border-red-200 bg-red-50'
              }`}
            >
              {/* Logo Preview */}
              <div className="mb-4 h-24 bg-black/5 flex items-center justify-center rounded overflow-hidden">
                <img
                  src={client.src}
                  alt={client.alt}
                  className="h-full w-full object-contain p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="12" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* Info */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Alt Text</p>
                <p className="text-sm text-black/60 break-words">{client.alt}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Path</p>
                <p className="text-xs text-black/60 break-all font-mono">{client.src}</p>
              </div>

              {client.createdAt && (
                <div className="mb-4">
                  <p className="text-xs text-black/40">
                    Added: {new Date(client.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    client.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {client.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleActive(client.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-black/20 hover:bg-black/5 transition-colors text-sm"
                  title={client.isActive ? 'Hide from carousel' : 'Show in carousel'}
                >
                  {client.isActive ? (
                    <>
                      <Eye size={16} />
                      Hide
                    </>
                  ) : (
                    <>
                      <EyeOff size={16} />
                      Show
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors text-sm"
                  title="Delete client logo"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded">
        <h3 className="font-medium text-blue-900 mb-2">How it works</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Add client logos that will appear in the carousel on all pages</li>
          <li>• Use the "Hide" button to temporarily remove logos from the carousel without deleting them</li>
          <li>• Only active logos will be displayed in the infinite scrolling carousel</li>
          <li>• The carousel will automatically duplicate active logos 12 times for smooth infinite scrolling</li>
          <li>• Upload images or provide direct URLs to logo files</li>
        </ul>
      </div>
    </div>
  );
}
