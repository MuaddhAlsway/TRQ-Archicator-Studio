// Portfolio data store - manages projects and categories
export type Category = 'all' | 'residential' | 'commercial' | 'booths' | 'events' | 'furniture';

export interface Project {
  id: number;
  title: string;
  category: Category;
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
  gallery?: string[];
  visible: boolean;
}

export interface CategoryItem {
  id: Category;
  label: string;
  visible: boolean;
}

// Default categories
const defaultCategories: CategoryItem[] = [
  { id: 'all', label: 'All Projects', visible: true },
  { id: 'residential', label: 'Residential', visible: true },
  { id: 'commercial', label: 'Commercial', visible: true },
  { id: 'booths', label: 'Booths & Exhibitions', visible: true },
  { id: 'events', label: 'Events', visible: true },
  { id: 'furniture', label: 'Furniture', visible: true },
];

// Default projects
const defaultProjects: Project[] = [
  {
    id: 1,
    title: 'Royal Residence',
    category: 'residential',
    subcategory: 'Luxury Villa',
    description: 'A timeless luxury villa featuring classical elegance and modern comfort.',
    image: 'https://images.unsplash.com/photo-1669387448840-610c588f003d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    year: '2025',
    location: 'Riyadh, Saudi Arabia',
    client: 'Private Client',
    size: '800 sqm',
    duration: '8 months',
    visible: true,
  },
  {
    id: 2,
    title: 'Master Suite Retreat',
    category: 'residential',
    subcategory: 'Bedroom Design',
    description: 'Serene and sophisticated bedroom suite with custom furniture and luxe finishes.',
    image: 'https://images.unsplash.com/photo-1625579002297-aeebbf69de89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    year: '2025',
    visible: true,
  },
  {
    id: 3,
    title: 'Culinary Excellence',
    category: 'residential',
    subcategory: 'Kitchen Design',
    description: 'Modern kitchen design blending functionality with stunning aesthetics.',
    image: 'https://images.unsplash.com/photo-1682888813795-192fca4a10d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    year: '2024',
    visible: true,
  },
  {
    id: 4,
    title: 'Grand Hotel Lobby',
    category: 'commercial',
    subcategory: 'Hospitality',
    description: 'Breathtaking hotel lobby that sets the tone for luxury hospitality.',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    year: '2025',
    visible: true,
  },
  {
    id: 5,
    title: 'Tech Startup Headquarters',
    category: 'commercial',
    subcategory: 'Office Design',
    description: 'Innovative office space promoting collaboration and creativity.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    year: '2024',
    visible: true,
  },
  {
    id: 6,
    title: 'Executive Workspace',
    category: 'commercial',
    subcategory: 'Corporate Design',
    description: 'Refined corporate office reflecting professionalism and sophistication.',
    image: 'https://images.unsplash.com/photo-1686100508812-c38b3593b301?crop=entropy&c