const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options?.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });

  let data: any = {};
  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = { message: "Failed to parse server response." };
    }
  } else {
    try {
      const text = await res.text();
      data = { message: text || `Server responded with status ${res.status}` };
    } catch {
      data = { message: `Server responded with status ${res.status}` };
    }
  }

  if (!res.ok) {
    throw new ApiError(
      data.message || "Something went wrong",
      res.status,
      data.errors
    );
  }

  return data as T;
}
