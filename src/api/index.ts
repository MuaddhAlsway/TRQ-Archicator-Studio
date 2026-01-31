// Use environment variable or fallback based on environment
const API_URL = (() => {
  // First check for explicit env variable
  const viteEnv = (import.meta as any).env;
  if (viteEnv?.VITE_API_URL) {
    return viteEnv.VITE_API_URL;
  }
  
  // Check if we're in development
  if (viteEnv?.DEV) {
    return 'http://localhost:4242/api';
  }
  
  // Production - use Cloudflare Pages Function (same domain as frontend)
  return '/api';
})() as string;

console.log('API URL:', API_URL);

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
  backoffMultiplier: 2,
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('trq_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

// Retry wrapper for fetch requests
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 0): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    return response;
  } catch (error: any) {
    const isNetworkError = error.name === 'TypeError' || error.name === 'AbortError';
    const shouldRetry = isNetworkError && retries < RETRY_CONFIG.maxRetries;

    if (shouldRetry) {
      const delay = Math.min(
        RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, retries),
        RETRY_CONFIG.maxDelay
      );
      
      console.warn(`API request failed (attempt ${retries + 1}/${RETRY_CONFIG.maxRetries}). Retrying in ${delay}ms...`, error);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries + 1);
    }

    throw error;
  }
}

// ============ AUTH ============
export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (data.success && data.token) {
    localStorage.setItem('trq_token', data.token);
  }
  return data;
}

export async function logout() {
  localStorage.removeItem('trq_token');
}

export async function verifyToken() {
  const token = localStorage.getItem('trq_token');
  if (!token) return { success: false };
  
  const res = await fetch(`${API_URL}/auth/verify`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  return res.json();
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await fetch(`${API_URL}/auth/change-password`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return res.json();
}

export async function updateEmail(email: string) {
  const res = await fetch(`${API_URL}/auth/update-email`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email }),
  });
  return res.json();
}

// ============ PROJECTS ============
export async function getProjects() {
  const res = await fetch(`${API_URL}/projects`);
  return res.json();
}

export async function getPublishedProjects() {
  try {
    const res = await fetch(`${API_URL}/projects/published`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching published projects:', error);
    // Fallback to all projects if published endpoint fails
    try {
      const res = await fetch(`${API_URL}/projects`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }
}

export async function getProject(id: number) {
  const res = await fetch(`${API_URL}/projects/${id}`);
  return res.json();
}

export async function createProject(project: any) {
  const res = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(project),
  });
  return res.json();
}

export async function updateProject(id: number, project: any) {
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(project),
  });
  return res.json();
}

export async function deleteProject(id: number) {
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

// ============ CONTACTS ============
export async function getContacts() {
  const res = await fetch(`${API_URL}/contacts`);
  return res.json();
}

export async function createContact(contact: any) {
  const res = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact),
  });
  return res.json();
}

export async function updateContactStatus(id: number, status: string) {
  const res = await fetch(`${API_URL}/contacts/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function sendContactReply(id: number, data: { subject: string; message: string }) {
  const res = await fetch(`${API_URL}/contacts/${id}/reply`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

// ============ PRICING ============
export async function getPricingRequests() {
  try {
    const res = await fetch(`${API_URL}/pricing`);
    if (!res.ok) {
      console.warn(`Pricing API returned ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching pricing requests:', error);
    return [];
  }
}

export async function createPricingRequest(request: any) {
  const res = await fetch(`${API_URL}/pricing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return res.json();
}

export async function updatePricingStatus(id: number, status: string) {
  const res = await fetch(`${API_URL}/pricing/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function sendQuote(id: number, data: { subject: string; message: string; quoteAmount?: string }) {
  const res = await fetch(`${API_URL}/pricing/${id}/send-quote`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

// ============ SERVICES ============
export async function getServices() {
  const res = await fetch(`${API_URL}/services`);
  return res.json();
}

export async function getActiveServices() {
  const res = await fetch(`${API_URL}/services/active`);
  return res.json();
}

export async function getService(id: number) {
  const res = await fetch(`${API_URL}/services/${id}`);
  return res.json();
}

export async function createService(service: any) {
  const res = await fetch(`${API_URL}/services`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(service),
  });
  return res.json();
}

export async function updateService(id: number, service: any) {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(service),
  });
  return res.json();
}

export async function deleteService(id: number) {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

// ============ SETTINGS ============
export async function getSettings() {
  const res = await fetch(`${API_URL}/settings`);
  return res.json();
}

export async function updateSettings(settings: Record<string, string>) {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });
  return res.json();
}

// ============ hero-slider-container SLIDES ============
export async function getSlides() {
  const res = await fetch(`${API_URL}/slides`);
  return res.json();
}

export async function getActiveSlides() {
  try {
    const res = await fetch(`${API_URL}/slides/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching slides:', error);
    return [];
  }
}

export async function getSlide(id: number) {
  const res = await fetch(`${API_URL}/slides/${id}`);
  return res.json();
}

export async function createSlide(slide: any) {
  const res = await fetch(`${API_URL}/slides`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(slide),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create slide');
  }
  return data;
}

export async function updateSlide(id: number, slide: any) {
  const res = await fetch(`${API_URL}/slides/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(slide),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update slide');
  }
  return data;
}

export async function deleteSlide(id: number) {
  const res = await fetch(`${API_URL}/slides/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

// ============ TRANSLATION DISABLED ============
// No automatic translation - use direct database fields only
// Arabic content is managed through admin panels

// ============ BLOG ARTICLES ============
export async function getArticles() {
  const res = await fetch(`${API_URL}/articles`);
  return res.json();
}

export async function getPublishedArticles() {
  const res = await fetch(`${API_URL}/articles/published`);
  return res.json();
}

export async function getArticle(id: number) {
  const res = await fetch(`${API_URL}/articles/${id}`);
  return res.json();
}

export async function getArticleBySlug(slug: string) {
  const res = await fetch(`${API_URL}/articles/slug/${slug}`);
  return res.json();
}

export async function createArticle(article: any) {
  const res = await fetch(`${API_URL}/articles`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(article),
  });
  return res.json();
}

export async function updateArticle(id: number, article: any) {
  const res = await fetch(`${API_URL}/articles/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(article),
  });
  return res.json();
}

export async function deleteArticle(id: number) {
  const res = await fetch(`${API_URL}/articles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

// ============ NEWSLETTER ============
export async function subscribeNewsletter(email: string) {
  const res = await fetch(`${API_URL}/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function getNewsletterSubscribers() {
  const res = await fetch(`${API_URL}/newsletter/subscribers`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function unsubscribeNewsletter(email: string) {
  const res = await fetch(`${API_URL}/newsletter/unsubscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
}


export async function sendNewsletter(subject: string, content: string) {
  const res = await fetch(`${API_URL}/newsletter/send`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ subject, content }),
  });
  return res.json();
}
