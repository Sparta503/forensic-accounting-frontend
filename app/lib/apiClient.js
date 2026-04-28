const DEFAULT_BASE_URL = "http://127.0.0.1:8000";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;
}

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function apiRequest(path, { method = "GET", headers, body } = {}) {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const url = path.startsWith("http") ? path : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body instanceof FormData ? body : body != null ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const message = (() => {
      if (!data) return res.statusText;
      if (typeof data === "string") return data || res.statusText;

      const detail = data.detail ?? data.message;
      if (!detail) return res.statusText;

      if (typeof detail === "string") return detail;
      if (Array.isArray(detail)) {
        return detail
          .map((d) => (typeof d === "string" ? d : d?.msg || d?.message || JSON.stringify(d)))
          .filter(Boolean)
          .join("; ");
      }

      if (typeof detail === "object") {
        return detail.msg || detail.message || JSON.stringify(detail);
      }

      return res.statusText;
    })();
    const error = new Error(message || `Request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function tryPostJson(paths, payload) {
  let lastError = null;

  for (const p of paths) {
    try {
      return await apiRequest(p, {
        method: "POST",
        body: payload,
      });
    } catch (e) {
      // Only fall back to the next path when the endpoint doesn't exist
      // or the method isn't allowed. For other errors (422 validation, 401 auth,
      // 409 conflicts, etc.) surface the real error immediately.
      if (e?.status && e.status !== 404 && e.status !== 405) {
        throw e;
      }

      lastError = e;
    }
  }

  throw lastError || new Error("Request failed");
}

export function extractAccessToken(data) {
  if (!data) return null;
  if (typeof data === "string") return data;

  return (
    data.access_token ||
    data.accessToken ||
    data.token ||
    data.jwt ||
    null
  );
}

export async function apiLogin({ email, password }) {
  return tryPostJson(["/auth/login", "/auth/login/"], {
    email,
    password,
  });
}

export async function apiRegister({ email, password, role }) {
  return tryPostJson(["/auth/register", "/auth/register/"], {
    email,
    password,
    role,
  });
}
