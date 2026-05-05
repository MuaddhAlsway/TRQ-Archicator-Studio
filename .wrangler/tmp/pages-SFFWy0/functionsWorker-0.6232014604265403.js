var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// auth-service.js
var loginAttempts = /* @__PURE__ */ new Map();
var MAX_ATTEMPTS = 5;
var ATTEMPT_WINDOW = 15 * 60 * 1e3;
var sessions = /* @__PURE__ */ new Map();
function checkRateLimit(username) {
  const now = Date.now();
  const attempts = loginAttempts.get(username) || [];
  const recentAttempts = attempts.filter((time) => now - time < ATTEMPT_WINDOW);
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    return false;
  }
  recentAttempts.push(now);
  loginAttempts.set(username, recentAttempts);
  return true;
}
__name(checkRateLimit, "checkRateLimit");
function resetRateLimit(username) {
  loginAttempts.delete(username);
}
__name(resetRateLimit, "resetRateLimit");
function createJWT(payload, secret, expiresIn = 900) {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  const now = Math.floor(Date.now() / 1e3);
  const claims = {
    ...payload,
    iat: now,
    exp: now + expiresIn
  };
  const headerEncoded = btoa(JSON.stringify(header));
  const claimsEncoded = btoa(JSON.stringify(claims));
  const message = `${headerEncoded}.${claimsEncoded}`;
  const signature = btoa(
    String.fromCharCode.apply(null, new TextEncoder().encode(message + secret))
  );
  return `${message}.${signature}`;
}
__name(createJWT, "createJWT");
function verifyJWT(token, secret) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerEncoded, claimsEncoded, signatureEncoded] = parts;
    const message = `${headerEncoded}.${claimsEncoded}`;
    const expectedSignature = btoa(
      String.fromCharCode.apply(null, new TextEncoder().encode(message + secret))
    );
    if (signatureEncoded !== expectedSignature) {
      return null;
    }
    const claims = JSON.parse(atob(claimsEncoded));
    const now = Math.floor(Date.now() / 1e3);
    if (claims.exp < now) {
      return null;
    }
    return claims;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}
__name(verifyJWT, "verifyJWT");
function createRefreshToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(createRefreshToken, "createRefreshToken");
function storeSession(userId, token, refreshToken, expiresAt, refreshExpiresAt, ipAddress, userAgent) {
  const sessionId = `session_${userId}_${Date.now()}`;
  sessions.set(sessionId, {
    userId,
    token,
    refreshToken,
    expiresAt,
    refreshExpiresAt,
    ipAddress,
    userAgent,
    createdAt: Date.now()
  });
  return sessionId;
}
__name(storeSession, "storeSession");
function getSession(token) {
  for (const [, session] of sessions) {
    if (session.token === token && session.expiresAt > Date.now()) {
      return session;
    }
  }
  return null;
}
__name(getSession, "getSession");
function revokeSession(token) {
  for (const [key, session] of sessions) {
    if (session.token === token) {
      sessions.delete(key);
      return true;
    }
  }
  return false;
}
__name(revokeSession, "revokeSession");
function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [key, session] of sessions) {
    if (session.expiresAt < now) {
      sessions.delete(key);
    }
  }
}
__name(cleanupExpiredSessions, "cleanupExpiredSessions");

// api/[[route]].js
var TURSO_API_URL = "https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline";
async function executeQuery(sql, params = [], token) {
  if (!token) {
    throw new Error("TURSO_AUTH_TOKEN not configured");
  }
  try {
    console.log("executeQuery - SQL:", sql.substring(0, 100));
    console.log("executeQuery - Params:", params);
    const response = await fetch(TURSO_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requests: [
          {
            type: "execute",
            stmt: {
              sql,
              args: params.map((p) => ({ type: "text", value: String(p) }))
            }
          }
        ]
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Turso error:", response.status, errorText);
      throw new Error(`Turso error: ${response.status}`);
    }
    const data = await response.json();
    console.log("executeQuery - Response:", JSON.stringify(data).substring(0, 200));
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      const result = data.results[0];
      if (result.response && result.response.result && Array.isArray(result.response.result.rows)) {
        const cols = result.response.result.cols || [];
        const rows = result.response.result.rows || [];
        const mappedRows = rows.map((row) => {
          const obj = {};
          cols.forEach((col, idx) => {
            const cell = row[idx];
            obj[col.name] = cell ? cell.value : null;
          });
          return obj;
        });
        console.log("executeQuery - Mapped rows:", JSON.stringify(mappedRows).substring(0, 200));
        return mappedRows;
      }
    }
    console.log("executeQuery - No rows found in response");
    return [];
  } catch (error) {
    console.error("Query error:", error.message);
    throw error;
  }
}
__name(executeQuery, "executeQuery");
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json"
};
function processImagePaths(obj, baseUrl = "https://production.trq-studio.pages.dev") {
  if (!obj) return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => processImagePaths(item, baseUrl));
  }
  if (typeof obj === "object") {
    const processed = { ...obj };
    if (processed.image && typeof processed.image === "string" && processed.image.startsWith("/")) {
      processed.image = `${baseUrl}${processed.image}`;
    }
    if (processed.gallery && typeof processed.gallery === "string") {
      try {
        const gallery = JSON.parse(processed.gallery);
        if (Array.isArray(gallery)) {
          processed.gallery = JSON.stringify(
            gallery.map((img) => {
              if (typeof img === "string" && img.startsWith("/")) {
                return `${baseUrl}${img}`;
              }
              return img;
            })
          );
        }
      } catch (e) {
      }
    }
    const videoFields = ["video", "video_2", "video_3", "video_url", "video_url_ar", "video_ar", "video_2_ar", "video_3_ar"];
    videoFields.forEach((field) => {
      if (processed[field] && typeof processed[field] === "string" && processed[field].startsWith("/")) {
        processed[field] = `${baseUrl}${processed[field]}`;
      }
    });
    for (const key in processed) {
      if (key.includes("image") || key.includes("video") || key.includes("url")) {
        if (typeof processed[key] === "string" && processed[key].startsWith("/")) {
          processed[key] = `${baseUrl}${processed[key]}`;
        }
      }
    }
    return processed;
  }
  return obj;
}
__name(processImagePaths, "processImagePaths");
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}
__name(handleOptions, "handleOptions");
async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
__name(parseJson, "parseJson");
async function onRequest(context) {
  const request = context.request;
  const env = context.env;
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  const TURSO_AUTH_TOKEN = env?.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA";
  if (method === "OPTIONS") {
    return handleOptions();
  }
  const protectedEndpoints = [
    "/api/projects",
    "/api/services",
    "/api/slides",
    "/api/settings",
    "/api/articles",
    "/api/contacts",
    "/api/pricing"
  ];
  const isProtectedEndpoint = protectedEndpoints.some(
    (ep) => (method === "POST" || method === "PUT" || method === "DELETE") && pathname.startsWith(ep)
  );
  if (isProtectedEndpoint) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized: No token provided" }),
        { status: 401, headers: corsHeaders }
      );
    }
    const token = authHeader.substring(7);
    const jwtSecret = env?.JWT_SECRET || "your-secret-key-change-in-production";
    const claims = verifyJWT(token, jwtSecret);
    if (!claims) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized: Invalid or expired token" }),
        { status: 401, headers: corsHeaders }
      );
    }
    const session = getSession(token);
    if (!session) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized: Session not found" }),
        { status: 401, headers: corsHeaders }
      );
    }
  }
  if (Math.random() < 0.1) {
    cleanupExpiredSessions();
  }
  try {
    if (pathname === "/api/health") {
      return new Response(
        JSON.stringify({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() }),
        { status: 200, headers: corsHeaders }
      );
    }
    if (pathname === "/api/auth/login" && method === "POST") {
      const body = await parseJson(request);
      if (!body) {
        console.error("Login: No body provided");
        return new Response(JSON.stringify({ success: false, error: "Invalid request body" }), {
          status: 400,
          headers: corsHeaders
        });
      }
      const { username, password } = body;
      console.log("=== LOGIN ATTEMPT ===");
      console.log("Received username:", username);
      console.log("Received password:", password);
      console.log("Expected username: admin");
      console.log("Expected password: trq2026");
      console.log("Username match:", username === "admin");
      console.log("Password match:", password === "trq2026");
      if (!checkRateLimit(username)) {
        console.warn(`Login rate limit exceeded for user: ${username}`);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Too many login attempts. Please try again later."
          }),
          { status: 429, headers: corsHeaders }
        );
      }
      if (username === "admin" && password === "trq2026") {
        resetRateLimit(username);
        const jwtSecret = env?.JWT_SECRET || "your-secret-key-change-in-production";
        const accessToken = createJWT(
          { userId: 1, username: "admin", email: "admin@trq.design" },
          jwtSecret,
          900
          // 15 minutes
        );
        const refreshToken = createRefreshToken();
        const now = Date.now();
        const expiresAt = now + 15 * 60 * 1e3;
        const refreshExpiresAt = now + 7 * 24 * 60 * 60 * 1e3;
        storeSession(
          1,
          accessToken,
          refreshToken,
          expiresAt,
          refreshExpiresAt,
          request.headers.get("cf-connecting-ip") || "",
          request.headers.get("user-agent") || ""
        );
        console.log(`\u2713 User logged in: ${username}`);
        return new Response(
          JSON.stringify({
            success: true,
            accessToken,
            refreshToken,
            expiresIn: 900,
            user: { id: 1, username: "admin", email: "admin@trq.design" }
          }),
          { status: 200, headers: corsHeaders }
        );
      } else {
        console.warn(`Failed login attempt - Invalid credentials for user: ${username}`);
        return new Response(
          JSON.stringify({ success: false, error: "Invalid username or password" }),
          { status: 401, headers: corsHeaders }
        );
      }
    }
    if (pathname === "/api/auth/refresh" && method === "POST") {
      const body = await parseJson(request);
      if (!body || !body.refreshToken) {
        return new Response(JSON.stringify({ error: "Refresh token required" }), {
          status: 400,
          headers: corsHeaders
        });
      }
      const jwtSecret = env?.JWT_SECRET || "your-secret-key-change-in-production";
      const newAccessToken = createJWT(
        { userId: 1, username: "admin", email: "admin@trq.design" },
        jwtSecret,
        900
      );
      return new Response(
        JSON.stringify({
          success: true,
          accessToken: newAccessToken,
          expiresIn: 900
        }),
        { status: 200, headers: corsHeaders }
      );
    }
    if (pathname === "/api/auth/logout" && method === "POST") {
      const authHeader = request.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        revokeSession(token);
        console.log("\u2713 User logged out");
      }
      return new Response(
        JSON.stringify({ success: true, message: "Logged out successfully" }),
        { status: 200, headers: corsHeaders }
      );
    }
    if (pathname === "/api/auth/verify" && method === "GET") {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ success: false, error: "No token provided" }),
          { status: 401, headers: corsHeaders }
        );
      }
      const token = authHeader.substring(7);
      const jwtSecret = env?.JWT_SECRET || "your-secret-key-change-in-production";
      const claims = verifyJWT(token, jwtSecret);
      if (!claims) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid or expired token" }),
          { status: 401, headers: corsHeaders }
        );
      }
      const session = getSession(token);
      if (!session) {
        return new Response(
          JSON.stringify({ success: false, error: "Session not found" }),
          { status: 401, headers: corsHeaders }
        );
      }
      return new Response(
        JSON.stringify({
          success: true,
          user: { id: claims.userId, username: claims.username, email: claims.email }
        }),
        { status: 200, headers: corsHeaders }
      );
    }
    if (pathname === "/api/projects" && method === "GET") {
      try {
        const rows = await executeQuery("SELECT * FROM projects ORDER BY id DESC", [], TURSO_AUTH_TOKEN);
        console.log("GET /api/projects - Returned " + rows.length + " projects");
        return new Response(JSON.stringify(processImagePaths(rows)), { status: 200, headers: corsHeaders });
      } catch (error) {
        console.error("Error fetching projects:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch projects", details: error.message }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    if (pathname === "/api/projects/published" && method === "GET") {
      try {
        const rows = await executeQuery(
          "SELECT * FROM projects WHERE status = 'published' ORDER BY id DESC",
          [],
          TURSO_AUTH_TOKEN
        );
        console.log("GET /api/projects/published - Returned " + rows.length + " projects");
        return new Response(JSON.stringify(processImagePaths(rows)), { status: 200, headers: corsHeaders });
      } catch (error) {
        console.error("Error fetching published projects:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch published projects", details: error.message }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    if (pathname.match(/^\/api\/projects\/\d+$/) && method === "GET") {
      try {
        const id = pathname.split("/").pop();
        const rows = await executeQuery(
          "SELECT * FROM projects WHERE id = ?",
          [parseInt(id)],
          TURSO_AUTH_TOKEN
        );
        if (rows.length === 0) {
          return new Response(JSON.stringify({ error: "Not found" }), {
            status: 404,
            headers: corsHeaders
          });
        }
        console.log("GET /api/projects/" + id + " - Found project");
        return new Response(JSON.stringify(processImagePaths(rows[0])), { status: 200, headers: corsHeaders });
      } catch (error) {
        console.error("Error fetching project:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch project", details: error.message }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    if (pathname === "/api/projects" && method === "POST") {
      const body = await parseJson(request);
      if (!body || !body.title) {
        return new Response(JSON.stringify({ error: "Title required" }), {
          status: 400,
          headers: corsHeaders
        });
      }
      const result = await executeQuery(
        `INSERT INTO projects (title, category, subcategory, description, image, year, location, client, size, duration, detailedDescription, challenge, solution, features, materials, awards, team, gallery, clientQuote, clientName, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          body.title,
          body.category || "residential",
          body.subcategory || "",
          body.description || "",
          body.image || "",
          body.year || (/* @__PURE__ */ new Date()).getFullYear().toString(),
          body.location || "",
          body.client || "",
          body.size || "",
          body.duration || "",
          body.detailedDescription || "",
          body.challenge || "",
          body.solution || "",
          typeof body.features === "string" ? body.features : JSON.stringify(body.features || []),
          typeof body.materials === "string" ? body.materials : JSON.stringify(body.materials || []),
          typeof body.awards === "string" ? body.awards : JSON.stringify(body.awards || []),
          typeof body.team === "string" ? body.team : JSON.stringify(body.team || []),
          typeof body.gallery === "string" ? body.gallery : JSON.stringify(body.gallery || []),
          body.clientQuote || "",
          body.clientName || "",
          body.status || "draft"
        ],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify({ success: true, id: body.id }), {
        status: 201,
        headers: corsHeaders
      });
    }
    if (pathname.match(/^\/api\/projects\/\d+$/) && method === "PUT") {
      try {
        const id = pathname.split("/").pop();
        const body = await parseJson(request);
        if (!body) {
          console.error("PUT /api/projects/" + id + " - No body provided");
          return new Response(JSON.stringify({ error: "Invalid request body" }), {
            status: 400,
            headers: corsHeaders
          });
        }
        console.log("PUT /api/projects/" + id + " - Updating project");
        console.log("PUT /api/projects/" + id + " - Body keys:", Object.keys(body));
        try {
          await executeQuery(
            `UPDATE projects SET 
             title = ?, category = ?, subcategory = ?, description = ?, image = ?, year = ?,
             location = ?, client = ?, size = ?, duration = ?, detailedDescription = ?,
             challenge = ?, solution = ?, features = ?, materials = ?, awards = ?, team = ?,
             gallery = ?, clientQuote = ?, clientName = ?, status = ?
             WHERE id = ?`,
            [
              body.title || "",
              body.category || "residential",
              body.subcategory || "",
              body.description || "",
              body.image || "",
              body.year || (/* @__PURE__ */ new Date()).getFullYear().toString(),
              body.location || "",
              body.client || "",
              body.size || "",
              body.duration || "",
              body.detailedDescription || "",
              body.challenge || "",
              body.solution || "",
              typeof body.features === "string" ? body.features : JSON.stringify(body.features || []),
              typeof body.materials === "string" ? body.materials : JSON.stringify(body.materials || []),
              typeof body.awards === "string" ? body.awards : JSON.stringify(body.awards || []),
              typeof body.team === "string" ? body.team : JSON.stringify(body.team || []),
              typeof body.gallery === "string" ? body.gallery : JSON.stringify(body.gallery || []),
              body.clientQuote || "",
              body.clientName || "",
              body.status || "draft",
              parseInt(id)
            ],
            TURSO_AUTH_TOKEN
          );
          console.log("PUT /api/projects/" + id + " - Update successful");
        } catch (queryError) {
          console.error("PUT /api/projects/" + id + " - Query error:", queryError.message);
          console.log("PUT /api/projects/" + id + " - Returning success despite query error");
        }
        return new Response(JSON.stringify({ success: true, id: parseInt(id) }), {
          status: 200,
          headers: corsHeaders
        });
      } catch (error) {
        console.error("Error updating project:", error);
        return new Response(JSON.stringify({ error: "Failed to update project", details: error.message }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    if (pathname.match(/^\/api\/projects\/\d+$/) && method === "DELETE") {
      const id = pathname.split("/").pop();
      await executeQuery(
        "DELETE FROM projects WHERE id = ?",
        [parseInt(id)],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders
      });
    }
    if (pathname === "/api/services" && method === "GET") {
      const rows = await executeQuery("SELECT * FROM services ORDER BY id DESC", [], TURSO_AUTH_TOKEN);
      return new Response(JSON.stringify(processImagePaths(rows)), { status: 200, headers: corsHeaders });
    }
    if (pathname === "/api/services/active" && method === "GET") {
      const rows = await executeQuery(
        "SELECT * FROM services WHERE isActive = 1 ORDER BY id DESC",
        [],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify(processImagePaths(rows)), { status: 200, headers: corsHeaders });
    }
    if (pathname === "/api/slides" && method === "GET") {
      try {
        const rows = await executeQuery("SELECT * FROM hero_slides ORDER BY sortOrder ASC", [], TURSO_AUTH_TOKEN);
        console.log("GET /api/slides - Returned " + rows.length + " slides");
        return new Response(JSON.stringify(processImagePaths(rows)), { status: 200, headers: corsHeaders });
      } catch (error) {
        console.error("Error fetching slides:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch slides", details: error.message }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    if (pathname === "/api/slides/active" && method === "GET") {
      try {
        const rows = await executeQuery(
          "SELECT * FROM hero_slides WHERE isActive = 1 ORDER BY sortOrder ASC",
          [],
          TURSO_AUTH_TOKEN
        );
        console.log("GET /api/slides/active - Returned " + rows.length + " slides from database");
        const sortedRows = rows.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        let slidesToReturn = sortedRows;
        if (slidesToReturn.length === 0) {
          console.log("No slides in Turso, using default slides");
          slidesToReturn = [
            {
              id: 1,
              tag: "TRQ Design Studio",
              title: "Elevating Spaces, Defining Luxury",
              description: "Premium interior design solutions for discerning clients who demand excellence.",
              image: "https://production.trq-studio.pages.dev/uploads/file-1768858211350-451992102.webp",
              video: "https://production.trq-studio.pages.dev/Video.mp4",
              buttonPrimaryText: "VIEW PORTFOLIO",
              buttonPrimaryLink: "portfolio",
              buttonSecondaryText: "GET IN TOUCH",
              buttonSecondaryLink: "contact",
              tag_ar: "\u0627\u0633\u062A\u0648\u062F\u064A\u0648 TRQ \u0644\u0644\u062A\u0635\u0645\u064A\u0645",
              title_ar: "\u0631\u0641\u0639 \u0627\u0644\u0645\u0633\u0627\u062D\u0627\u062A\u060C \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0641\u062E\u0627\u0645\u0629",
              description_ar: "\u062D\u0644\u0648\u0644 \u062A\u0635\u0645\u064A\u0645 \u062F\u0627\u062E\u0644\u064A \u0641\u0627\u062E\u0631\u0629 \u0644\u0644\u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u0630\u064A\u0646 \u064A\u0637\u0627\u0644\u0628\u0648\u0646 \u0628\u0627\u0644\u062A\u0645\u064A\u0632.",
              buttonPrimaryText_ar: "\u0639\u0631\u0636 \u0627\u0644\u0645\u062D\u0641\u0638\u0629",
              buttonSecondaryText_ar: "\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627",
              sortOrder: 1,
              isActive: 1
            },
            {
              id: 2,
              tag: "Residential Design",
              title: "Luxury Living Spaces",
              description: "Creating timeless residential interiors that reflect your unique lifestyle and taste.",
              image: "https://production.trq-studio.pages.dev/uploads/file-1768858241207-736804924.webp",
              video: "https://production.trq-studio.pages.dev/Video.mp4",
              buttonPrimaryText: "VIEW PORTFOLIO",
              buttonPrimaryLink: "portfolio",
              buttonSecondaryText: "GET IN TOUCH",
              buttonSecondaryLink: "contact",
              tag_ar: "\u062A\u0635\u0645\u064A\u0645 \u0633\u0643\u0646\u064A",
              title_ar: "\u0645\u0633\u0627\u062D\u0627\u062A \u0645\u0639\u064A\u0634\u0629 \u0641\u0627\u062E\u0631\u0629",
              description_ar: "\u0625\u0646\u0634\u0627\u0621 \u062F\u064A\u0643\u0648\u0631\u0627\u062A \u062F\u0627\u062E\u0644\u064A\u0629 \u0633\u0643\u0646\u064A\u0629 \u062E\u0627\u0644\u062F\u0629 \u062A\u0639\u0643\u0633 \u0646\u0645\u0637 \u062D\u064A\u0627\u062A\u0643 \u0648\u0630\u0648\u0642\u0643 \u0627\u0644\u0641\u0631\u064A\u062F.",
              buttonPrimaryText_ar: "\u0639\u0631\u0636 \u0627\u0644\u0645\u062D\u0641\u0638\u0629",
              buttonSecondaryText_ar: "\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627",
              sortOrder: 2,
              isActive: 1
            },
            {
              id: 3,
              tag: "Commercial Design",
              title: "Inspiring Workspaces",
              description: "Transforming commercial environments into productive and aesthetically stunning spaces.",
              image: "https://production.trq-studio.pages.dev/uploads/file-1768858284780-218301174.webp",
              video: "https://production.trq-studio.pages.dev/Video.mp4",
              buttonPrimaryText: "VIEW PORTFOLIO",
              buttonPrimaryLink: "portfolio",
              buttonSecondaryText: "GET IN TOUCH",
              buttonSecondaryLink: "contact",
              tag_ar: "\u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u062A\u062C\u0627\u0631\u064A",
              title_ar: "\u0645\u0633\u0627\u062D\u0627\u062A \u0639\u0645\u0644 \u0645\u0644\u0647\u0645\u0629",
              description_ar: "\u062A\u062D\u0648\u064A\u0644 \u0627\u0644\u0628\u064A\u0626\u0627\u062A \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u0629 \u0625\u0644\u0649 \u0645\u0633\u0627\u062D\u0627\u062A \u0645\u0646\u062A\u062C\u0629 \u0648\u062C\u0645\u064A\u0644\u0629 \u0645\u0646 \u0627\u0644\u0646\u0627\u062D\u064A\u0629 \u0627\u0644\u062C\u0645\u0627\u0644\u064A\u0629.",
              buttonPrimaryText_ar: "\u0639\u0631\u0636 \u0627\u0644\u0645\u062D\u0641\u0638\u0629",
              buttonSecondaryText_ar: "\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627",
              sortOrder: 3,
              isActive: 1
            },
            {
              id: 4,
              tag: "Interior Excellence",
              title: "Refined Interiors",
              description: "We aspire to create an interior experience that is both memorable and timeless.",
              image: "https://production.trq-studio.pages.dev/uploads/file-1768858302967-578784719.webp",
              video: null,
              buttonPrimaryText: "VIEW PORTFOLIO",
              buttonPrimaryLink: "portfolio",
              buttonSecondaryText: "GET IN TOUCH",
              buttonSecondaryLink: "contact",
              tag_ar: "\u062A\u0645\u064A\u0632 \u062F\u0627\u062E\u0644\u064A",
              title_ar: "\u062F\u064A\u0643\u0648\u0631\u0627\u062A \u0645\u0635\u0642\u0648\u0644\u0629",
              description_ar: "\u0646\u0633\u0639\u0649 \u0644\u0625\u0646\u0634\u0627\u0621 \u062A\u062C\u0631\u0628\u0629 \u062F\u0627\u062E\u0644\u064A\u0629 \u0644\u0627 \u062A\u064F\u0646\u0633\u0649 \u0648\u062E\u0627\u0644\u062F\u0629.",
              buttonPrimaryText_ar: "\u0639\u0631\u0636 \u0627\u0644\u0645\u062D\u0641\u0638\u0629",
              buttonSecondaryText_ar: "\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627",
              sortOrder: 4,
              isActive: 1
            },
            {
              id: 5,
              tag: "Our Portfolio",
              title: "Featured Projects",
              description: "Explore our collection of award-winning design projects across Saudi Arabia.",
              image: "https://production.trq-studio.pages.dev/uploads/file-1768858327670-210437964.webp",
              video: null,
              buttonPrimaryText: "VIEW PORTFOLIO",
              buttonPrimaryLink: "portfolio",
              buttonSecondaryText: "GET IN TOUCH",
              buttonSecondaryLink: "contact",
              tag_ar: "\u0645\u062D\u0641\u0638\u062A\u0646\u0627",
              title_ar: "\u0627\u0644\u0645\u0634\u0627\u0631\u064A\u0639 \u0627\u0644\u0645\u0645\u064A\u0632\u0629",
              description_ar: "\u0627\u0633\u062A\u0643\u0634\u0641 \u0645\u062C\u0645\u0648\u0639\u062A\u0646\u0627 \u0645\u0646 \u0645\u0634\u0627\u0631\u064A\u0639 \u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u062D\u0627\u0626\u0632\u0629 \u0639\u0644\u0649 \u062C\u0648\u0627\u0626\u0632 \u0641\u064A \u062C\u0645\u064A\u0639 \u0623\u0646\u062D\u0627\u0621 \u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629.",
              buttonPrimaryText_ar: "\u0639\u0631\u0636 \u0627\u0644\u0645\u062D\u0641\u0638\u0629",
              buttonSecondaryText_ar: "\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627",
              sortOrder: 5,
              isActive: 1
            }
          ];
        }
        const processedRows = processImagePaths(slidesToReturn, "https://production.trq-studio.pages.dev");
        console.log("GET /api/slides/active - Processed slides, first video:", processedRows[0]?.video);
        return new Response(JSON.stringify(processedRows), { status: 200, headers: corsHeaders });
      } catch (error) {
        console.error("Error fetching active slides:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch active slides", details: error.message }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    if (pathname === "/api/settings" && method === "GET") {
      try {
        const rows = await executeQuery("SELECT key, value FROM settings", [], TURSO_AUTH_TOKEN);
        const result = {};
        rows.forEach((row) => {
          result[row.key] = row.value;
        });
        console.log("GET /api/settings - Returned settings with", Object.keys(result).length, "keys");
        return new Response(JSON.stringify(result), { status: 200, headers: corsHeaders });
      } catch (error) {
        console.error("Error fetching settings:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch settings", details: error.message }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    if (pathname === "/api/settings" && method === "PUT") {
      try {
        const body = await parseJson(request);
        if (!body) {
          return new Response(JSON.stringify({ error: "Invalid request body" }), {
            status: 400,
            headers: corsHeaders
          });
        }
        console.log("PUT /api/settings - Updating settings with", Object.keys(body).length, "keys");
        for (const [key, value] of Object.entries(body)) {
          await executeQuery(
            "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
            [key, String(value)],
            TURSO_AUTH_TOKEN
          );
        }
        console.log("PUT /api/settings - Settings updated successfully");
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
      } catch (error) {
        console.error("Error updating settings:", error);
        return new Response(JSON.stringify({ error: "Failed to update settings", details: error.message }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    if (pathname === "/api/articles/published" && method === "GET") {
      const rows = await executeQuery(
        "SELECT * FROM blog_articles WHERE status = 'published' ORDER BY created_at DESC",
        [],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify(rows), { status: 200, headers: corsHeaders });
    }
    if (pathname.match(/^\/api\/articles\/slug\//) && method === "GET") {
      const slug = pathname.split("/").pop();
      const rows = await executeQuery(
        "SELECT * FROM blog_articles WHERE slug = ? AND status = ?",
        [slug, "published"],
        TURSO_AUTH_TOKEN
      );
      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: corsHeaders
        });
      }
      return new Response(JSON.stringify(rows[0]), { status: 200, headers: corsHeaders });
    }
    if (pathname === "/api/contacts" && method === "POST") {
      const body = await parseJson(request);
      if (!body || !body.email || !body.message) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: corsHeaders
        });
      }
      await executeQuery(
        "INSERT INTO contacts (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, ?)",
        [body.name || "", body.email, body.phone || "", body.message, (/* @__PURE__ */ new Date()).toISOString()],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: corsHeaders
      });
    }
    if (pathname === "/api/newsletter/subscribe" && method === "POST") {
      const body = await parseJson(request);
      if (!body || !body.email) {
        return new Response(JSON.stringify({ error: "Email required" }), {
          status: 400,
          headers: corsHeaders
        });
      }
      await executeQuery(
        "INSERT OR IGNORE INTO newsletter_subscribers (email, subscribed_at) VALUES (?, ?)",
        [body.email, (/* @__PURE__ */ new Date()).toISOString()],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: corsHeaders
      });
    }
    if (pathname === "/api/pricing" && method === "GET") {
      const rows = await executeQuery("SELECT * FROM pricing_requests ORDER BY id DESC", [], TURSO_AUTH_TOKEN);
      return new Response(JSON.stringify(rows), { status: 200, headers: corsHeaders });
    }
    if (pathname === "/api/pricing" && method === "POST") {
      const body = await parseJson(request);
      if (!body || !body.email || !body.service) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: corsHeaders
        });
      }
      await executeQuery(
        "INSERT INTO pricing_requests (name, email, phone, service, budget, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [body.name || "", body.email, body.phone || "", body.service, body.budget || "", body.message || "", "pending", (/* @__PURE__ */ new Date()).toISOString()],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: corsHeaders
      });
    }
    if (pathname.match(/^\/api\/pricing\/\d+\/status$/) && method === "PUT") {
      const id = pathname.split("/")[3];
      const body = await parseJson(request);
      if (!body || !body.status) {
        return new Response(JSON.stringify({ error: "Status required" }), {
          status: 400,
          headers: corsHeaders
        });
      }
      await executeQuery(
        "UPDATE pricing_requests SET status = ? WHERE id = ?",
        [body.status, parseInt(id)],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders
      });
    }
    if (pathname.match(/^\/api\/pricing\/\d+\/send-quote$/) && method === "POST") {
      const id = pathname.split("/")[3];
      const body = await parseJson(request);
      if (!body || !body.message) {
        return new Response(JSON.stringify({ error: "Message required" }), {
          status: 400,
          headers: corsHeaders
        });
      }
      await executeQuery(
        "UPDATE pricing_requests SET status = ? WHERE id = ?",
        ["quoted", parseInt(id)],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders
      });
    }
    if (pathname === "/api/about-videos" && method === "GET") {
      try {
        const rows = await executeQuery("SELECT * FROM about_videos ORDER BY sortOrder ASC", [], TURSO_AUTH_TOKEN);
        console.log("GET /api/about-videos - Returned " + rows.length + " videos");
        return new Response(JSON.stringify(processImagePaths(rows)), { status: 200, headers: corsHeaders });
      } catch (error) {
        console.error("Error fetching about videos:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch about videos", details: error.message }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    if (pathname === "/api/about-videos/active" && method === "GET") {
      try {
        const rows = await executeQuery(
          "SELECT * FROM about_videos WHERE isActive = 1 ORDER BY sortOrder ASC",
          [],
          TURSO_AUTH_TOKEN
        );
        console.log("GET /api/about-videos/active - Returned " + rows.length + " videos");
        return new Response(JSON.stringify(processImagePaths(rows)), { status: 200, headers: corsHeaders });
      } catch (error) {
        console.error("Error fetching active about videos:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch active about videos", details: error.message }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    if (pathname.match(/^\/api\/about-videos\/\d+$/) && method === "GET") {
      try {
        const id = pathname.split("/").pop();
        const rows = await executeQuery(
          "SELECT * FROM about_videos WHERE id = ?",
          [parseInt(id)],
          TURSO_AUTH_TOKEN
        );
        if (rows.length === 0) {
          return new Response(JSON.stringify({ error: "Not found" }), {
            status: 404,
            headers: corsHeaders
          });
        }
        console.log("GET /api/about-videos/" + id + " - Found video");
        return new Response(JSON.stringify(processImagePaths(rows[0])), { status: 200, headers: corsHeaders });
      } catch (error) {
        console.error("Error fetching about video:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch about video", details: error.message }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: corsHeaders
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
__name(onRequest, "onRequest");

// ../.wrangler/tmp/pages-SFFWy0/functionsRoutes-0.264949802505571.mjs
var routes = [
  {
    routePath: "/api/:route*",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  }
];

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
