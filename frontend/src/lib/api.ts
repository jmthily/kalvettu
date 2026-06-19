import { getAuthToken } from "./auth";
import type { FamilyMember, MediaItem, Memorial, Tribute } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3021/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  auth = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      (body as { message?: string }).message || res.statusText,
      res.status
    );
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

export const api = {
  auth: {
    setup: (email: string, password: string) =>
      apiFetch("/auth/setup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }, false),

    login: (email: string, password: string) =>
      apiFetch<{ accessToken: string; email: string }>(
        "/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) },
        false
      ),
  },

  memorials: {
    list: () => apiFetch<Memorial[]>("/memorials"),
    get: (id: string) => apiFetch<Memorial>(`/memorials/${id}`),
    getPublic: (slug: string) =>
      apiFetch<Memorial>(`/memorials/public/${slug}`, {}, false),
    create: (body: Record<string, unknown>) =>
      apiFetch<Memorial>("/memorials", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Record<string, unknown>) =>
      apiFetch<Memorial>(`/memorials/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    listPeoplePublic: (memorialId: string) =>
      apiFetch<FamilyMember[]>(
        `/memorials/${memorialId}/people/public`,
        {},
        false
      ),
  },

  tributes: {
    listPublic: (memorialId: string) =>
      apiFetch<Tribute[]>(
        `/memorials/${memorialId}/tributes/public`,
        {},
        false
      ),
    create: (
      memorialId: string,
      body: { name: string; relationship?: string; message: string }
    ) =>
      apiFetch<Tribute>(`/memorials/${memorialId}/tributes`, {
        method: "POST",
        body: JSON.stringify(body),
      }, false),
  },

  media: {
    listPublic: (memorialId: string) =>
      apiFetch<MediaItem[]>(
        `/profiles/${memorialId}/media/public`,
        {},
        false
      ),
  },
};
