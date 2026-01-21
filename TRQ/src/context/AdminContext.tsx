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

export interface SiteContent {
  about: {
    heroTitle: string;
    heroSubtitle: string;
    whoWeAre: string;
    vision: string;
    mission: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
  };
}

interface AdminContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  contactSubmissions: ContactSubmission[];
  addContactSubmission: (submission: Omit<ContactSubmission, 'id' | 'date' | 'read'>) => void;
  markContactRead: (id: number) => void;
  pricingRequests: PricingRequest[];
  addPricingRequest: (request: Omit<PricingRequest, 'id' | 'date' | 'status'>) => void;
  updatePricingStatus: (id: number, status: PricingRequest['status']) => void;
  siteContent: SiteContent;
  updateSiteContent: (content: Partial<SiteContent>) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

const ADMIN_PASSWORD = 'trq2024';

const defaultProjects: Project[] = [
  {
    id: 1,
    title: 'Royal Residence',
    category: 'residential',
    subcategory: 'Luxury Villa',
    description: 'A timeless luxury villa featuring classical elegance and modern comfort.',
    image: 'https://images.unsplash.com/photo-1669387448840-610c588f003d?w=1080',
    year: '2025',
    location: 'Riyadh, Saudi Arabia',
    client: 'Private Client',
    size: '800 sqm',
    duration: '12 months',
  },
  {
    id: 2,
    title: 'Master Suite Retreat',
    category: 'residential',
    subcategory: 'B