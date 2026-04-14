import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '../api';
import { Project, ContactSubmission, PricingRequest, AdminUser } from './types';

interface AdminContextType {
  user: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  projects: Project[];
  loadProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: number, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  slides: any[];
  loadSlides: () => Promise<void>;
  contacts: ContactSubmission[];
  loadContacts: () => Promise<void>;
  updateContactStatus: (id: number, status: ContactSubmission['status']) => Promise<void>;
  pricingRequests: PricingRequest[];
  loadPricingRequests: () => Promise<void>;
  updatePricingStatus: (id: number, status: PricingRequest['status']) => Promise<void>;
  refreshData: () => Promise<void>;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [slides, setSlides] = useState<any[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [pricingRequests, setPricingRequests] = useState<PricingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('trq_access_token');
      if (token) {
        try {
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Token verification timeout')), 5000)
          );
          
          const result = await Promise.race([
            api.verifyToken(),
            timeoutPromise
          ]) as any;
          
          if (result.success) {
            setUser(result.user);
          } else {
            // Token invalid, clear it
            localStorage.removeItem('trq_access_token');
            localStorage.removeItem('trq_refresh_token');
            localStorage.removeItem('trq_token_expiry');
          }
        } catch (error) {
          console.error('Token verification error:', error);
          localStorage.removeItem('trq_access_token');
          localStorage.removeItem('trq_refresh_token');
          localStorage.removeItem('trq_token_expiry');
        }
      }
      setLoading(false);
    };
    verifyAuth();
  }, []);

  // Load data when user is authenticated
  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadProjects(), loadSlides(), loadContacts(), loadPricingRequests()]);
    } catch (error) {
      console.error('Error loading data:', error);
      // If unauthorized, logout
      if (error instanceof Error && error.message.includes('401')) {
        logout();
      }
    }
    setLoading(false);
  };

  const refreshData = async () => {
    await loadAllData();
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await api.login(username, password);
      if (result.success && result.accessToken) {
        localStorage.setItem('trq_access_token', result.accessToken);
        localStorage.setItem('trq_refresh_token', result.refreshToken);
        localStorage.setItem('trq_token_expiry', Date.now() + (result.expiresIn * 1000));
        setUser(result.user);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    api.logout();
  };

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    }
  };

  const loadSlides = async () => {
    try {
      const data = await api.getSlides();
      setSlides(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading slides:', error);
      setSlides([]);
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      await api.createProject(project);
      await loadProjects();
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (id: number, projectData: Partial<Project>) => {
    try {
      console.log('AdminContext: Updating project:', id, projectData);
      
      // Check if this is an Arabic-only update (only _ar fields provided)
      const isArabicOnlyUpdate = Object.keys(projectData).every(key => key.endsWith('_ar'));
      
      console.log('AdminContext: Is Arabic-only update:', isArabicOnlyUpdate);
      
      if (isArabicOnlyUpdate) {
        // Arabic-only update - send ONLY _ar fields, nothing else
        console.log('AdminContext: Sending Arabic-only update');
        await api.updateProject(id, projectData);
      } else {
        // Full update - send all fields as provided
        console.log('AdminContext: Sending full update');
        await api.updateProject(id, projectData);
      }
      
      console.log('AdminContext: Update successful, reloading projects');
      await loadProjects();
      console.log('AdminContext: Projects reloaded');
    } catch (error) {
      console.error('AdminContext: Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await api.deleteProject(id);
      await loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const loadContacts = async () => {
    try {
      const data = await api.getContacts();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading contacts:', error);
      setContacts([]);
    }
  };

  const updateContactStatus = async (id: number, status: ContactSubmission['status']) => {
    try {
      await api.updateContactStatus(id, status);
      await loadContacts();
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const loadPricingRequests = async () => {
    try {
      const data = await api.getPricingRequests();
      // Ensure data is an array
      setPricingRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading pricing requests:', error);
      setPricingRequests([]);
    }
  };

  const updatePricingStatus = async (id: number, status: PricingRequest['status']) => {
    try {
      await api.updatePricingStatus(id, status);
      await loadPricingRequests();
    } catch (error) {
      console.error('Error updating pricing status:', error);
    }
  };

  return (
    <AdminContext.Provider value={{
      user, login, logout,
      projects, loadProjects, addProject, updateProject, deleteProject,
      slides, loadSlides,
      contacts, loadContacts, updateContactStatus,
      pricingRequests, loadPricingRequests, updatePricingStatus,
      refreshData,
      loading,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
