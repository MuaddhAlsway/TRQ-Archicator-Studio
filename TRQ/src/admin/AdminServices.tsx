import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, Eye, EyeOff, Image as ImageIcon, RefreshCw } from 'lucide-react';
import * as Icons from 'lucide-react';
import * as api from '../api';
import { ConfirmModal } from './ConfirmModal';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
  sortOrder: number;
  isActive: number;
}

const availableIcons = [
  'Home', 'Briefcase', 'Store', 'Building2', 'Boxes', 'Calendar', 'Armchair',
  'Building', 'Hotel', 'Warehouse', 'Palette', 'PenTool', 'Ruler', 'Hammer',
  'Wrench', 'Settings', 'Star', 'Award', 'Crown', 'Diamond', 'Gem',
  'Sofa', 'Lamp', 'DoorOpen', 'LayoutGrid', 'Layers', 'Package', 'Gift'
];

const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Briefcase;
};

// Default services data (same as frontend)
const defaultServicesData: Omit<Service, 'id'>[] = [
  {
    title: 'Residential Interior Design',
    description: 'Transform your home into a sanctuary that reflects your personality and lifestyle.',
    image: 'https://images.unsplash.com/photo-1669387448840-610c588f003d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGRlc2lnbiUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzY4MDI4ODQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: 'Home',
    features: ['Custom space planning and layout design', 'Material selection and color palettes', 'Furniture and fixture specification', 'Lighting design and integration', 'Complete project management', 'Post-completion support'],
    sortOrder: 1,
    isActive: 1,
  },
  {
    title: 'Commercial Interior Design',
    description: 'Create inspiring workspaces that enhance productivity and reflect your brand identity.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjgwMDk5MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: 'Briefcase',
    features: ['Office design and planning', 'Brand integration and identity', 'Ergonomic workspace solutions', 'Meeting room and collaboration spaces', 'Reception and common areas', 'Sustainable design practices'],
    sortOrder: 2,
    isActive: 1,
  },
  {
    title: 'Retail Design',
    description: 'Design retail spaces that attract customers and maximize sales potential.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    icon: 'Store',
    features: ['Store layout and flow optimization', 'Visual merchandising solutions', 'Brand experience design', 'Customer journey mapping', 'Point-of-sale integration', 'Adaptive design for seasonal changes'],
    sortOrder: 3,
    isActive: 1,
  },
  {
    title: 'Hotel Design',
    description: 'Craft memorable hospitality experiences through thoughtful and luxurious design.',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2ODA0Njc1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    icon: 'Building2',
    features: ['Lobby and reception design', 'Guest room and suite planning', 'Restaurant and bar concepts', 'Spa and wellness facilities', 'Public areas and amenities', 'Brand consistency throughout'],
    sortOrder: 4,
    isActive: 1,
  },
  {
    title: 'Booth & Exhibition Stand Design',
    description: 'Stand out at trade shows and exhibitions with captivating, custom-designed booths.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    icon: 'Boxes',
    features: ['Custom booth design and fabrication', 'Brand storytelling and messaging', 'Interactive display integration', 'Modular and reusable solutions', 'Fast turnaround capabilities', 'On-site installation and support'],
    sortOrder: 5,
    isActive: 1,
  },
  {
    title: 'Event Design',
    description: 'Create unforgettable experiences with bespoke event design and styling.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    icon: 'Calendar',
    features: ['Concept development and theming', 'Space planning and layout', 'Décor and styling', 'Lighting and audiovisual design', 'Coordination with vendors', 'On-site execution and management'],
    sortOrder: 6,
    isActive: 1,
  },
  {
    title: 'Furniture Design',
    description: 'Bespoke furniture pieces that combine functionality with artistic expression.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    icon: 'Armchair',
    features: ['Custom furniture design', 'Material and finish selection', 'Prototype development', 'Collaboration with master craftsmen', 'Quality control and finishing', 'Installation and placement'],
    sortOrder: 7,
    isActive: 1,
  },
];

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const emptyService: Omit<Service, 'id'> = {
    title: '',
    description: '',
    image: '',
    icon: 'Briefcase',
    features: [],
    sortOrder: 0,
    isActive: 1,
  };

  const [formData, setFormData] = useState<Omit<Service, 'id'>>(emptyService);
  const [newFeature, setNewFeature] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning';
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setFormData({ ...emptyService, sortOrder: services.length + 1 });
    setIsCreating(true);
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setFormData({
      title: service.title,
      description: service.description,
      image: service.image,
      icon: service.icon,
      features: service.features || [],
      sortOrder: service.sortOrder,
      isActive: service.isActive,
    });
    setEditingService(service);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingService(null);
    setIsCreating(false);
    setFormData(emptyService);
    setNewFeature('');
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await api.createService(formData);
      } else if (editingService) {
        await api.updateService(editingService.id, formData);
      }
      await loadServices();
      handleCancel();
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Service',
      message: 'Are you sure you want to delete this service? This action cannot be undone.',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await api.deleteService(id);
          await loadServices();
        } catch (error) {
          console.error('Failed to delete service:', error);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await api.updateService(service.id, { ...service, isActive: service.isActive ? 0 : 1 });
      await loadServices();
    } catch (error) {
      console.error('Error toggling service:', error);
    }
  };

  const handleResetToDefaults = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset to Defaults',
      message: 'This will delete all existing services and restore the default 7 services. This action cannot be undone.',
      variant: 'warning',
      onConfirm: async () => {
        try {
          for (const service of services) {
            await api.deleteService(service.id);
          }
          for (const service of defaultServicesData) {
            await api.createService(service);
          }
          await loadServices();
        } catch (error) {
          console.error('Failed to reset services:', error);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  const IconPreview = getIconComponent(formData.icon);

  return (
    <div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-light tracking-wide">Services</h1>
          <p className="text-black/60 mt-1 text-sm sm:text-base">Manage services displayed on the services page</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-2 border border-black/20 px-3 py-2 sm:px-4 hover:bg-black/5 transition-colors text-sm"
            title="Reset to default 7 services"
          >
            <RefreshCw size={18} />
            <span className="hidden sm:inline">Reset Defaults</span>
            <span className="sm:hidden">Reset</span>
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-black text-white px-3 py-2 sm:px-4 hover:bg-black/80 transition-colors text-sm"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Service</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Editor Modal */}
      {(isCreating || editingService) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-light">
                {isCreating ? 'Create New Service' : 'Edit Service'}
              </h2>
              <button onClick={handleCancel} className="p-2 hover:bg-black/5 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Preview Card */}
              <div className="border p-6 bg-neutral-50">
                <p className="text-xs text-black/40 mb-4">PREVIEW</p>
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-black flex items-center justify-center flex-shrink-0">
                    <IconPreview className="text-white" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl mb-2">{formData.title || 'Service Title'}</h3>
                    <p className="text-black/60 text-sm">{formData.description || 'Service description...'}</p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border p-2"
                    placeholder="e.g., Residential Interior Design"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border p-2 h-24 resize-none"
                  placeholder="Service description..."
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Icon</label>
                <div className="grid grid-cols-7 gap-2 p-4 border bg-neutral-50 max-h-48 overflow-y-auto">
                  {availableIcons.map((iconName) => {
                    const Icon = getIconComponent(iconName);
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: iconName })}
                        className={`p-3 flex flex-col items-center gap-1 rounded transition-colors ${
                          formData.icon === iconName
                            ? 'bg-black text-white'
                            : 'hover:bg-black/10'
                        }`}
                        title={iconName}
                      >
                        <Icon size={24} />
                        <span className="text-[10px] truncate w-full text-center">{iconName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border p-2"
                  placeholder="https://..."
                />
                {formData.image && (
                  <div className="mt-2 w-48 h-32 bg-neutral-100 overflow-hidden">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium mb-2">Features</label>
                <div className="space-y-2 mb-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 bg-neutral-50 p-2">
                      <div className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                      <span className="flex-1 text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-1 hover:bg-red-50 text-red-600 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 border p-2"
                    placeholder="Add a feature..."
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-black text-white hover:bg-black/80"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Sort Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full border p-2"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive === 1}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked ? 1 : 0 })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Active (visible on website)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-black text-white px-6 py-2 hover:bg-black/80 transition-colors"
              >
                <Save size={18} />
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="bg-white p-12 text-center">
            <ImageIcon size={48} className="mx-auto text-black/20 mb-4" />
            <p className="text-black/60">No services yet. Create your first service.</p>
          </div>
        ) : (
          services.map((service) => {
            const Icon = getIconComponent(service.icon);
            return (
              <div
                key={service.id}
                className={`bg-white border flex items-stretch ${!service.isActive ? 'opacity-60' : ''}`}
              >
                <div className="w-48 h-32 flex-shrink-0 bg-neutral-100">
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                        <Icon className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium">{service.title}</h3>
                        <p className="text-sm text-black/60 mt-1 line-clamp-2">{service.description}</p>
                        {service.features && service.features.length > 0 && (
                          <p className="text-xs text-black/40 mt-2">{service.features.length} features</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-black/40">#{service.sortOrder}</span>
                      <button
                        onClick={() => handleToggleActive(service)}
                        className={`p-2 rounded transition-colors ${service.isActive ? 'text-green-600 hover:bg-green-50' : 'text-black/40 hover:bg-black/5'}`}
                        title={service.isActive ? 'Active' : 'Inactive'}
                      >
                        {service.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 hover:bg-black/5 rounded transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
