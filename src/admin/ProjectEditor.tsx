import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, X, Image as ImageIcon, Upload, Loader } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { Project } from './types';
import * as api from '../api';

interface ProjectEditorProps {
  project: Project | null;
  onSave: () => void;
  onCancel: () => void;
}

interface Category {
  id: string;
  label: string;
}

const emptyProject: Omit<Project, 'id'> = {
  title: '',
  category: 'residential',
  subcategory: '',
  description: '',
  image: '',
  year: new Date().getFullYear().toString(),
  location: '',
  client: '',
  size: '',
  duration: '',
  detailedDescription: '',
  challenge: '',
  solution: '',
  features: [''],
  materials: [''],
  awards: [''],
  team: [''],
  gallery: [''],
  clientQuote: '',
  clientName: '',
  status: 'draft',
};

export function ProjectEditor({ project, onSave, onCancel }: ProjectEditorProps) {
  const { addProject, updateProject } = useAdmin();
  
  // Parse project data - convert JSON strings to arrays
  const parseProjectData = (proj: Project | null) => {
    if (!proj) return emptyProject;
    
    return {
      ...proj,
      features: typeof proj.features === 'string' ? JSON.parse(proj.features || '[]') : (proj.features || []),
      materials: typeof proj.materials === 'string' ? JSON.parse(proj.materials || '[]') : (proj.materials || []),
      awards: typeof proj.awards === 'string' ? JSON.parse(proj.awards || '[]') : (proj.awards || []),
      team: typeof proj.team === 'string' ? JSON.parse(proj.team || '[]') : (proj.team || []),
      gallery: typeof proj.gallery === 'string' ? JSON.parse(proj.gallery || '[]') : (proj.gallery || []),
    };
  };
  
  const [formData, setFormData] = useState<Omit<Project, 'id'>>(parseProjectData(project));
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'content' | 'gallery' | 'team'>('basic');
  const [categories, setCategories] = useState<Category[]>([
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'booths', label: 'Booths & Exhibitions' },
    { id: 'events', label: 'Events' },
    { id: 'furniture', label: 'Furniture' },
  ]);

  // Update formData when project changes
  useEffect(() => {
    setFormData(parseProjectData(project));
  }, [project]);

  // Fetch categories from settings
  useEffect(() => {
    api.getSettings().then((settings) => {
      if (settings.portfolioCategories) {
        try {
          const parsed = JSON.parse(settings.portfolioCategories);
          // Filter out 'all' category as it's not a real category for projects
          const filtered = parsed.filter((cat: Category) => cat.id !== 'all');
          if (filtered.length > 0) {
            setCategories(filtered);
          }
        } catch (e) {
          console.error('Error parsing portfolio categories:', e);
        }
      }
    }).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up empty array items
    const cleanedData = {
      ...formData,
      features: formData.features.filter(f => f.trim()),
      materials: formData.materials.filter(m => m.trim()),
      awards: formData.awards.filter(a => a.trim()),
      team: formData.team.filter(t => t.trim()),
      gallery: formData.gallery.filter(g => g.trim()),
    };

    // Convert arrays to JSON strings for storage
    const dataToSend = {
      title: cleanedData.title,
      category: cleanedData.category,
      subcategory: cleanedData.subcategory,
      description: cleanedData.description,
      image: cleanedData.image,
      year: cleanedData.year,
      location: cleanedData.location,
      client: cleanedData.client,
      size: cleanedData.size,
      duration: cleanedData.duration,
      detailedDescription: cleanedData.detailedDescription,
      challenge: cleanedData.challenge,
      solution: cleanedData.solution,
      features: JSON.stringify(cleanedData.features),
      materials: JSON.stringify(cleanedData.materials),
      awards: JSON.stringify(cleanedData.awards),
      team: JSON.stringify(cleanedData.team),
      gallery: JSON.stringify(cleanedData.gallery),
      clientQuote: cleanedData.clientQuote,
      clientName: cleanedData.clientName,
      status: cleanedData.status,
    };

    if (project) {
      console.log('Updating existing project:', project.id);
      updateProject(project.id, dataToSend);
    } else {
      console.log('Creating new project');
      addProject(dataToSend);
    }
    onSave();
  };

  const handleArrayChange = (field: 'features' | 'materials' | 'awards' | 'team' | 'gallery', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const handleArrayAdd = (field: 'features' | 'materials' | 'awards' | 'team' | 'gallery') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const handleArrayRemove = (field: 'features' | 'materials' | 'awards' | 'team' | 'gallery', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length ? newArray : [''] });
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'details', label: 'Project Details' },
    { id: 'content', label: 'Content' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'team', label: 'Team & Awards' },
  ];

  return (
    <div>
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-black/60 hover:text-black mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Projects</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-black/5">
          <h1 className="text-2xl tracking-wide">
            {project ? 'Edit Project' : 'New Project'}
          </h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-black/5 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-4 text-sm tracking-wider whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-black/60 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">TITLE *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">SUBCATEGORY *</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="e.g., Luxury Villa, Office Design"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">CATEGORY *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Project['category'] })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none bg-white"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">YEAR *</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">STATUS</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">SHORT DESCRIPTION *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">MAIN IMAGE URL *</label>
                <div className="flex gap-4">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="https://..."
                    required
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="w-20 h-14 object-cover rounded" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Project Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">LOCATION</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="Riyadh, Saudi Arabia"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">CLIENT</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="Private Client"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">SIZE</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="500 sqm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">DURATION</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="6 months"
                  />
                </div>
              </div>

              {/* Key Features */}
              <div>
                <label className="block mb-2 text-sm tracking-wider">KEY FEATURES</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange('features', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Feature description"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('features', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleArrayAdd('features')}
                  className="flex items-center gap-2 text-sm text-black/60 hover:text-black"
                >
                  <Plus size={16} /> Add Feature
                </button>
              </div>

              {/* Materials */}
              <div>
                <label className="block mb-2 text-sm tracking-wider">MATERIALS & FINISHES</label>
                {formData.materials.map((material, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => handleArrayChange('materials', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Material name"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('materials', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleArrayAdd('materials')}
                  className="flex items-center gap-2 text-sm text-black/60 hover:text-black"
                >
                  <Plus size={16} /> Add Material
                </button>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm tracking-wider">PROJECT OVERVIEW</label>
                <textarea
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={5}
                  placeholder="Detailed description of the project..."
                />
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">THE CHALLENGE</label>
                <textarea
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={4}
                  placeholder="What challenges did this project present?"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">OUR SOLUTION</label>
                <textarea
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={4}
                  placeholder="How did you solve these challenges?"
                />
              </div>

              <div className="border-t border-black/10 pt-6">
                <h3 className="text-lg mb-4">Client Quote</h3>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">QUOTE TEXT</label>
                  <textarea
                    value={formData.clientQuote}
                    onChange={(e) => setFormData({ ...formData, clientQuote: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                    rows={3}
                    placeholder="Client testimonial..."
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm tracking-wider">CLIENT NAME</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="— PROJECT CLIENT"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <p className="text-black/60">Add image URLs for the project gallery.</p>
              
              {formData.gallery.map((url, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleArrayChange('gallery', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="https://..."
                      />
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('gallery', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  {url && (
                    <img src={url} alt={`Gallery ${index + 1}`} className="w-24 h-16 object-cover rounded" />
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => handleArrayAdd('gallery')}
                className="flex items-center gap-2 px-4 py-2 border border-dashed border-black/20 hover:border-black text-black/60 hover:text-black w-full justify-center"
              >
                <ImageIcon size={20} /> Add Gallery Image
              </button>
            </div>
          )}

          {/* Team & Awards Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {/* Team */}
              <div>
                <label className="block mb-2 text-sm tracking-wider">PROJECT TEAM</label>
                {formData.team.map((member, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={member}
                      onChange={(e) => handleArrayChange('team', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Role: Name"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('team', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleArrayAdd('team')}
                  className="flex items-center gap-2 text-sm text-black/60 hover:text-black"
                >
                  <Plus size={16} /> Add Team Member
                </button>
              </div>

              {/* Awards */}
              <div>
                <label className="block mb-2 text-sm tracking-wider">AWARDS & RECOGNITION</label>
                {formData.awards.map((award, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={award}
                      onChange={(e) => handleArrayChange('awards', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Award name"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('awards', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleArrayAdd('awards')}
                  className="flex items-center gap-2 text-sm text-black/60 hover:text-black"
                >
                  <Plus size={16} /> Add Award
                </button>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-black/10">
            <button
              type="submit"
              className="px-8 py-3 bg-black text-white hover:bg-black/80 transition-colors"
            >
              {project ? 'Update Project' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 border border-black/20 hover:border-black transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
