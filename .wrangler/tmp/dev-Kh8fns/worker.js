var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-El0rSH/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/bundle-El0rSH/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// server/worker.js
var TURSO_API_URL = "https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline";
async function executeQuery(sql, params = [], tursoToken) {
  if (!tursoToken) {
    throw new Error("TURSO_AUTH_TOKEN not configured");
  }
  try {
    const response = await fetch(TURSO_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tursoToken}`,
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
      throw new Error(`Turso error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      const result = data.results[0];
      if (result.response && result.response.result && Array.isArray(result.response.result.rows)) {
        const cols = result.response.result.cols || [];
        const rows = result.response.result.rows || [];
        return rows.map((row) => {
          const obj = {};
          cols.forEach((col, idx) => {
            const cell = row[idx];
            obj[col.name] = cell ? cell.value : null;
          });
          return obj;
        });
      }
    }
    return [];
  } catch (error) {
    console.error("Query error:", error.message);
    throw error;
  }
}
__name(executeQuery, "executeQuery");
function getCorsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}
__name(getCorsHeaders, "getCorsHeaders");
function handleOptions(request) {
  const origin = request.headers.get("origin") || "";
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin)
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
async function handleRequest(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  const origin = request.headers.get("origin") || "";
  const TURSO_AUTH_TOKEN = env?.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA";
  if (method === "OPTIONS") {
    return handleOptions(request);
  }
  const corsHeaders = getCorsHeaders(origin);
  try {
    if (pathname === "/api/health") {
      return new Response(
        JSON.stringify({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    if (pathname === "/api/projects" && method === "GET") {
      const rows = await executeQuery("SELECT * FROM projects ORDER BY id DESC", [], TURSO_AUTH_TOKEN);
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (pathname === "/api/projects/published" && method === "GET") {
      const rows = await executeQuery(
        "SELECT * FROM projects WHERE status = 'published' ORDER BY id DESC",
        [],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (pathname.match(/^\/api\/projects\/\d+$/) && method === "GET") {
      const id = pathname.split("/").pop();
      const rows = await executeQuery(
        "SELECT * FROM projects WHERE id = ?",
        [parseInt(id)],
        TURSO_AUTH_TOKEN
      );
      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify(rows[0]), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (pathname === "/api/services" && method === "GET") {
      const rows = await executeQuery("SELECT * FROM services ORDER BY id DESC", [], TURSO_AUTH_TOKEN);
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (pathname === "/api/services/active" && method === "GET") {
      const rows = await executeQuery(
        "SELECT * FROM services WHERE isActive = 1 ORDER BY id DESC",
        [],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (pathname === "/api/slides" && method === "GET") {
      const rows = await executeQuery("SELECT * FROM hero_slides ORDER BY id DESC", [], TURSO_AUTH_TOKEN);
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (pathname === "/api/slides/active" && method === "GET") {
      const rows = await executeQuery(
        "SELECT * FROM hero_slides WHERE isActive = 1 ORDER BY id DESC",
        [],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (pathname === "/api/settings" && method === "GET") {
      const rows = await executeQuery("SELECT * FROM settings LIMIT 1", [], TURSO_AUTH_TOKEN);
      return new Response(JSON.stringify(rows[0] || {}), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (pathname === "/api/articles/published" && method === "GET") {
      const rows = await executeQuery(
        "SELECT * FROM blog_articles WHERE status = 'published' ORDER BY created_at DESC",
        [],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
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
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify(rows[0]), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (pathname === "/api/contacts" && method === "POST") {
      const body = await parseJson(request);
      if (!body || !body.email || !body.message) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      await executeQuery(
        "INSERT INTO contacts (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, ?)",
        [body.name || "", body.email, body.phone || "", body.message, (/* @__PURE__ */ new Date()).toISOString()],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (pathname === "/api/newsletter/subscribe" && method === "POST") {
      const body = await parseJson(request);
      if (!body || !body.email) {
        return new Response(JSON.stringify({ error: "Email required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      await executeQuery(
        "INSERT OR IGNORE INTO newsletter_subscribers (email, subscribed_at) VALUES (?, ?)",
        [body.email, (/* @__PURE__ */ new Date()).toISOString()],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
}
__name(handleRequest, "handleRequest");
var worker_default = {
  fetch: handleRequest
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-El0rSH/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-El0rSH/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
