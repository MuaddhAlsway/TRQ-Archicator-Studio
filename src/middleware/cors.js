/**
 * CORS Middleware - Handles preflight and response headers
 */

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://trqlatestversion.trq-efw.pages.dev',
  'https://trq-studio.pages.dev',
  'https://trqlatestversion.trq-frontend.pages.dev',
  'https://260b10f1.trq-frontend.pages.dev',
];

const ALLOWED_ORIGINS_REGEX = [
  /\.trq-efw\.pages\.dev$/,
  /\.trq-studio-7ie\.pages\.dev$/,
  /\.trq-frontend\.pages\.dev$/,
];

function isOriginAllowed(origin) {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return ALLOWED_ORIGINS_REGEX.some(regex => regex.test(origin));
}

export function handleCors(request) {
  const origin = request.headers.get('origin');
  const isAllowed = isOriginAllowed(origin);

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isAllowed ? origin : '',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  // Attach CORS headers to response (handled in response wrapper)
  request.corsHeaders = {
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export function addCorsHeaders(response, corsHeaders) {
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    if (value) newHeaders.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
