import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '../api';

export interface Project {
  id: number;
  title: string;
  category: 'residential' | 'commercial' | 'booths' | 'events' | 'furniture';
  subcategory: string;
  description: string;
  image: string;
  year: string;
  location?: string;
  client?: string;
  size?: string;
  duration?: string;
  detailedDescription?: string;
  challenge?: string;
  solution?: string;
  features?: string[];
  materials?: string[];
  awards?: string[];
  team?: string[];
  gallery?: string[];
  clientQuote?: string;
  clientName?: string;
  status?: 'draft' | 'published';
  sortOrder?: number;
  title_ar?: string;
  category_ar?: string;
  subcategory_ar?: string;
  description_ar?: string;
  location_ar?: string;
  client_ar?: string;
  size_ar?: string;
  duration_ar?: string;
  detailedDescription_ar?: string;
  challenge_ar?: string;
  solution_ar?: string;
  features_ar?: string[];
  materials_ar?: string[];
  awards_ar?: string[];
  team_ar?: string[];
  clientQuote_ar?: string;
  clientName_ar?: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface PricingRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  projectSize: string;
  location: string;
  budget: string;
  timeline: string;
  description: string;
  contactMethod: string;
  date: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
}

export interface SiteSettings {
  id?: number;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  servicesTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  heroTitle_ar?: string;
  heroSubtitle_ar?: string;
  aboutTitle_ar?: string;
  aboutDescription_ar?: string;
  servicesTitle_ar?: string;
  contactEmail_ar?: string;
  contactPhone_ar?: string;
  contactAddress_ar?: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  projects: Project[];
  loadProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: number, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  contactSubmissions: ContactSubmission[];
  loadContactSubmissions: () => Promise<void>;
  markContactRead: (id: number) => Promise<void>;
  deleteContact: (id: number) => Promise<void>;
  pricingRequests: PricingRequest[];
  loadPricingRequests: () => Promise<void>;
  updatePricingStatus: (id: number, status: PricingRequest['status']) => Promise<void>;
  deletePricingRequest: (id: number) => Promise<void>;
  siteSettings: SiteSettings;
  loadSiteSettings: () => Promise<void>;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [pricingRequests, setPricingRequests] = useState<PricingRequest[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('trq_access_token');
    if (token) {
      setIsAuthenticated(true);
      loadProjects();
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.login(username, password);
      if (response && response.accessToken) {
        setIsAuthenticated(true);
        await loadProjects();
        return true;
      }
      setError('Login failed');
      return false;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('trq_access_token');
    localStorage.removeItem('trq_refresh_token');
    localStorage.removeItem('trq_token_expiry');
    localStorage.removeItem('trq_user');
    setIsAuthenticated(false);
    setProjects([]);
    setContactSubmissions([]);
    setPricingRequests([]);
    setSiteSettings({});
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      await api.createProject(project);
      await loadProjects();
    } catch (err: any) {
      setError(err.message || 'Failed to add project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id: number, project: Partial<Project>) => {
    try {
      setLoading(true);
      setError(null);
      await api.updateProject(id, project);
      await loadProjects();
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await api.deleteProject(id);
      await loadProjects();
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadContactSubmissions = async () => {
    try {
      setLoading(true);
      const data = await api.getContacts();
      setContactSubmissions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const markContactRead = async (id: number) => {
    try {
      await api.markContactRead(id);
      await loadContactSubmissions();
    } catch (err: any) {
      setError(err.message || 'Failed to mark contact as read');
      throw err;
    }
  };

  const deleteContact = async (id: number) => {
    try {
      await api.deleteContact(id);
      await loadContactSubmissions();
    } catch (err: any) {
      setError(err.message || 'Failed to delete contact');
      throw err;
    }
  };

  const loadPricingRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getPricingRequests();
      setPricingRequests(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load pricing requests');
    } finally {
      setLoading(false);
    }
  };

  const updatePricingStatus = async (id: number, status: PricingRequest['status']) => {
    try {
      await api.updatePricingStatus(id, status);
      await loadPricingRequests();
    } catch (err: any) {
      setError(err.message || 'Failed to update pricing status');
      throw err;
    }
  };

  const deletePricingRequest = async (id: number) => {
    try {
      await api.deletePricingRequest(id);
      await loadPricingRequests();
    } catch (err: any) {
      setError(err.message || 'Failed to delete pricing request');
      throw err;
    }
  };

  const loadSiteSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getSettings();
      setSiteSettings(data || {});
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    try {
      setLoading(true);
      setError(null);
      await api.updateSettings(settings);
      await loadSiteSettings();
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: AdminContextType = {
    isAuthenticated,
    login,
    logout,
    projects,
    loadProjects,
    addProject,
    updateProject,
    deleteProject,
    contactSubmissions,
    loadContactSubmissions,
    markContactRead,
    deleteContact,
    pricingRequests,
    loadPricingRequests,
    updatePricingStatus,
    deletePricingRequest,
    siteSettings,
    loadSiteSettings,
    updateSiteSettings,
    loading,
    error,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
