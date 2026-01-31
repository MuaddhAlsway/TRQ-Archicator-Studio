export interface Project {
  id: number;
  // English fields
  title: string;
  category: 'residential' | 'commercial' | 'booths' | 'events' | 'furniture';
  subcategory: string;
  description: string;
  image: string;
  year: string;
  location: string;
  client: string;
  size: string;
  duration: string;
  detailedDescription: string;
  challenge: string;
  solution: string;
  features: string[];
  materials: string[];
  awards: string[];
  team: string[];
  gallery: string[];
  clientQuote: string;
  clientName: string;
  status: 'published' | 'draft';
  
  // Arabic fields (_ar suffix)
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
  features_ar?: string | string[];
  materials_ar?: string | string[];
  awards_ar?: string | string[];
  team_ar?: string | string[];
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
  status: 'new' | 'read' | 'replied';
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
  status: 'new' | 'reviewed' | 'quoted' | 'closed';
}

export interface SiteContent {
  about: {
    heroTitle: string;
    heroSubtitle: string;
    whoWeAre: string;
    vision: string;
    mission: string;
    values: { icon: string; title: string; description: string }[];
  };
  services: {
    heroTitle: string;
    heroSubtitle: string;
    intro: string;
    services: {
      icon: string;
      title: string;
      description: string;
      features: string[];
      image: string;
    }[];
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
  };
}

export interface AdminUser {
  username: string;
  isAuthenticated: boolean;
}
