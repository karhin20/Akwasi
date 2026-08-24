/**
 * Centralized API client.
 * All requests go to /api/* — proxied to the Express backend in dev,
 * served from the same origin in production.
 */

const BASE = '/api';

// ─── Auth token helpers ───────────────────────────────────────────────────────
const TOKEN_KEY = 'akwasi_admin_token';

export const authStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
  includeAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(options.headers as Record<string, string> ?? {}),
  };

  if (includeAuth) {
    const token = authStorage.get();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const auth = {
  login: (username: string, password: string) =>
    request<{ token: string; username: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  verify: () =>
    request<{ valid: boolean; username?: string }>('/auth/verify', {
      method: 'POST',
    }, true),
};

// ─── Listings ─────────────────────────────────────────────────────────────────
export const listings = {
  getAll: (params?: { category?: string; featured?: boolean; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.category && params.category !== 'all') q.set('category', params.category);
    if (params?.featured) q.set('featured', 'true');
    if (params?.limit) q.set('limit', String(params.limit));
    return request<unknown[]>(`/listings${q.toString() ? `?${q}` : ''}`);
  },

  getById: (id: string) => request<unknown>(`/listings/${id}`),

  create: (listing: Record<string, unknown>) =>
    request<unknown>('/listings', {
      method: 'POST',
      body: JSON.stringify(listing),
    }),

  update: (id: string, updates: Record<string, unknown>) =>
    request<unknown>(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }, true),

  delete: (id: string) =>
    request<{ success: boolean }>(`/listings/${id}`, {
      method: 'DELETE',
    }, true),
};

// ─── Media ────────────────────────────────────────────────────────────────────
export const media = {
  upload: async (file: File, folder?: string): Promise<{ url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const q = folder ? `?folder=${encodeURIComponent(folder)}` : '';
    return request<{ url: string; public_id: string }>(`/media/upload${q}`, {
      method: 'POST',
      body: formData,
    });
  },
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const chat = {
  send: (
    message: string,
    history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []
  ) =>
    request<{ reply: string }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),

  saveEnquiry: (enquiry: {
    customerName: string;
    phone: string;
    email?: string;
    category?: string;
    source?: string;
    message: string;
    aiConversationSnippet?: { userPrompt: string; botAnswer: string };
    itemTitle?: string;
    listingId?: string;
  }) =>
    request<{ success: boolean; id: string }>('/chat/enquiry', {
      method: 'POST',
      body: JSON.stringify(enquiry),
    }),
};

// ─── Enquiries (admin) ────────────────────────────────────────────────────────
export const enquiries = {
  getAll: () => request<unknown[]>('/enquiries', {}, true),
  delete: (id: string) =>
    request<{ success: boolean }>(`/enquiries/${id}`, { method: 'DELETE' }, true),
};
