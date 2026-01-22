import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  // Arabic fields
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
  // Arabic fields
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
  login: (password: string) => Promise<boolean>;
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

  // Load projects from API on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  const login = async (password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pass

  const login = (pa