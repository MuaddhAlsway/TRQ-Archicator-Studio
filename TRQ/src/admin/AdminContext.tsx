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
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [pricingRequests, setPricingRequests] = useState<PricingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('trq_token');
      if (token) {
        try {
          const result = await api.verifyToken();
          if (result.success) {
            setUser(result.user);
          } else {
            // Token invalid, clear it
            localStorage.removeItem('trq_token');
          }
        } catch {
          localStorage.removeItem('trq_token');
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
      await Promise.all([loadProjects(), loadContacts(), loadPricingRequests()]);
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
      if (result.success && result.token) {
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
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
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
      console.log('Updating project:', id, projectData);
      
      // Check if this is an Arabic-only update (only _ar fields provided)
      const isArabicOnlyUpdate = Object.keys(projectData).every(key => key.endsWith('_ar'));
      
      console.log('Is Arabic-only update:', isArabicOnlyUpdate);
      
      if (isArabicOnlyUpdate) {
        // Arabic-only update - send ONLY _ar fields, nothing else
        console.log('Sending Arabic-only update');
        await api.updateProject(id, projectData);
      } else {
        // Full update - send all fields as provided
        console.log('Sending full update');
        await api.updateProject(id, projectData);
      }
      
      console.log('Update successful, reloading projects');
      await loadProjects();
      console.log('Projects reloaded');
    } catch (error) {
      console.error('Error updating project:', error);
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
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
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
      setPricingRequests(data);
    } catch (error) {
      console.error('Error loading pricing requests:', error);
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
