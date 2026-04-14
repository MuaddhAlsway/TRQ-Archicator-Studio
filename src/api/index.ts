// API base URL — set VITE_API_URL in .env files.
// .env.development → http://localhost:4242/api
// .env.production  → https://trq-api-prod.muaddhalsway.workers.dev/api
const API_URL = import.meta.env.VITE_API_URL as string;

// Error handler for API responses
class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public responseBody?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Handle 401 Unauthorized - logout user
function handleUnauthorized() {
  localStorage.removeItem('trq_access_token');
  localStorage.removeItem('trq_refresh_token');
  localStorage.removeItem('trq_token_expiry');
  localStorage.removeItem('trq_user');
  window.location.href = '/admin/login';
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
  backoffMultiplier: 2,
};

// Helper to get auth headers with JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('trq_access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

// Helper to refresh token if expired
async function refreshTokenIfNeeded() {
  const refreshToken = localStorage.getItem('trq_refresh_token');
  const tokenExpiry = localStorage.getItem('trq_token_expiry');
  
  if (!refreshToken || !tokenExpiry) return false;
  
  const now = Date.now();
  const expiryTime = parseInt(tokenExpiry);
  
  // Refresh if token expires in less than 2 minutes
  if (expiryTime - now < 2 * 60 * 1000) {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('trq_access_token', data.accessToken);
        localStorage.setItem('trq_token_expiry', Date.now() + (data.expiresIn * 1000));
        return true;
      } else if (res.status === 401) {
        // Refresh token expired, logout user
        handleUnauthorized();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Don't logout on network error, let the request fail naturally
      return false;
    }
  }
  
  return false;
}

// Retry wrapper for fetch requests
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 0): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      handleUnauthorized();
      throw new APIError(401, 'Unauthorized', 'Session expired. Please login again.');
    }
    
    // Retry on 5xx server errors
    if (response.status >= 500 && retries < RETRY_CONFIG.maxRetries) {
      const delay = Math.min(
        RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, retries),
        RETRY_CONFIG.maxDelay
      );
      console.warn(`Server error ${response.status} (attempt ${retries + 1}/${RETRY_CONFIG.maxRetries}). Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries + 1);
    }
    
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
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || 'Login failed' };
    }
    
    const data = await res.json();
    
    if (data.success && data.accessToken) {
      localStorage.setItem('trq_access_token', data.accessToken);
      localStorage.setItem('trq_refresh_token', data.refreshToken);
      localStorage.setItem('trq_token_expiry', Date.now() + (data.expiresIn * 1000));
      localStorage.setItem('trq_user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please check your connection.' };
  }
}

export async function logout() {
  try {
    const token = localStorage.getItem('trq_access_token');
    if (token) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  localStorage.removeItem('trq_access_token');
  localStorage.removeItem('trq_refresh_token');
  localStorage.removeItem('trq_token_expiry');
  localStorage.removeItem('trq_user');
}

export async function verifyToken() {
  try {
    // Refresh token if needed
    await refreshTokenIfNeeded();
    
    const token = localStorage.getItem('trq_access_token');
    if (!token) return { success: false };
    
    const res = await fetch(`${API_URL}/auth/verify`, {
      headers: getAuthHeaders(),
    });
    
    return res.json();
  } catch (error) {
    console.error('Token verification error:', error);
    return { success: false };
  }
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
  try {
    const res = await fetchWithRetry(`${API_URL}/projects`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch projects`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function getPublishedProjects() {
  try {
    const res = await fetchWithRetry(`${API_URL}/projects/published`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch published projects`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching published projects:', error);
    // Fallback to all projects if published endpoint fails
    try {
      const res = await fetchWithRetry(`${API_URL}/projects`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return [];
    }
  }
}

export async function getProject(id: number) {
  try {
    const res = await fetchWithRetry(`${API_URL}/projects/${id}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Project not found`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

export async function createProject(project: any) {
  await refreshTokenIfNeeded();
  const res = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(project),
  });
  return res.json();
}

export async function updateProject(id: number, project: any) {
  try {
    console.log('API: Updating project', id, 'with data:', JSON.stringify(project).substring(0, 200));
    
    // Refresh token if needed before making request
    await refreshTokenIfNeeded();
    
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
      console.error('API Error:', res.status, errorData);
      throw new Error(errorData.error || `HTTP ${res.status}`);
    }
    
    const data = await res.json();
    console.log('API: Update successful:', data);
    return data;
  } catch (error) {
    console.error('API: Update failed:', error);
    throw error;
  }
}

export async function deleteProject(id: number) {
  await refreshTokenIfNeeded();
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

// ============ CONTACTS ============
export async function getContacts() {
  const res = await fetch(`${API_URL}/contacts`, { headers: getAuthHeaders() });
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
    await refreshTokenIfNeeded();
    const res = await fetch(`${API_URL}/pricing`, {
      headers: getAuthHeaders(),
    });
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
  await refreshTokenIfNeeded();
  const res = await fetch(`${API_URL}/pricing/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function sendQuote(id: number, data: { subject: string; message: string; quoteAmount?: string }) {
  await refreshTokenIfNeeded();
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

// ============ ABOUT VIDEOS ============
export async function getAboutVideos() {
  try {
    const res = await fetch(`${API_URL}/about-videos`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function getActiveAboutVideos() {
  try {
    const res = await fetch(`${API_URL}/about-videos/active`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function createAboutVideo(video: any) {
  const res = await fetch(`${API_URL}/about-videos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(video),
  });
  return res.json();
}

export async function updateAboutVideo(id: number, video: any) {
  const res = await fetch(`${API_URL}/about-videos/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(video),
  });
  return res.json();
}

export async function deleteAboutVideo(id: number) {
  const res = await fetch(`${API_URL}/about-videos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

// ============ COMPANY PROFILE ============
export async function getCompanyProfileSettings() {
  const res = await fetch(`${API_URL}/company-profile`);
  return res.json();
}

export async function updateCompanyProfileSettings(language: string, settings: any) {
  const res = await fetch(`${API_URL}/company-profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ language, ...settings }),
  });
  return res.json();
}

// ============ FILE SERVING HELPERS ============
// All images and videos live in /public and are served as static assets.
// Paths stored in the DB may be absolute URLs (from the worker's processImagePaths)
// or root-relative paths like /uploads/foo.webp.
// Both cases are handled below — no hardcoded domains, works on any host.

export function getVideoUrl(filename: string): string {
  if (!filename) return '';

  // Already an absolute URL — extract just the pathname so it resolves
  // correctly regardless of which domain the app is deployed on.
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    try {
      return new URL(filename).pathname;
    } catch {
      return filename;
    }
  }

  // Root-relative path — serve directly as a static asset from /public
  const clean = filename.startsWith('/') ? filename : `/${filename}`;
  return clean;
}

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';

  // New worker-based uploads served via /api/uploads/:id
  if (imagePath.startsWith('/api/uploads/')) {
    return `${API_URL.replace('/api', '')}${imagePath}`;
  }

  // Already an absolute URL — use as-is (could be external CDN or local server)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // For API URLs, try to use them directly first
    // If they fail, the ImageWithFallback component will show error
    return imagePath;
  }

  // Root-relative /uploads/ path — serve from the API server (not the Pages host)
  // because these files only exist on the Express/Worker backend
  const clean = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  if (clean.startsWith('/uploads/')) {
    const base = API_URL.replace(/\/api$/, '');
    return `${base}${clean}`;
  }

  return clean;
}

// ============ BLOG ARTICLES ============
export async function getArticles() {
  try {
    const res = await fetch(`${API_URL}/articles`, { headers: getAuthHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function getPublishedArticles() {
  try {
    const res = await fetch(`${API_URL}/articles/published`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
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
