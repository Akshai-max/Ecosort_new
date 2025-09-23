export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(path: string, method: HttpMethod = 'GET', body?: any, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  } as RequestInit);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Authenticated profile fetchers
export const Profiles = {
  employee: () => request<{ employee: any }>('/api/employee/profile'),
  user: () => request<{ user: any }>('/api/user/profile'),
  manager: () => request<{ manager: any }>('/api/manager/profile'),
};

export const Employee = {
  tasks: () => request<{ tasks: any[] }>('/api/employee/tasks'),
  notifications: (id: string, params?: { status?: 'read' | 'unread' }) => request<{ notifications: any[]; unreadCount: number }>(`/api/notifications/employee/${id}${params?.status ? `?status=${params.status}` : ''}`),
};

export const Manager = {
  employees: (id: string) => request<{ employees: any[]; teams?: any[] }>(`/api/manager/${id}/employees`),
  notifications: (id: string, params?: { status?: 'read' | 'unread'; type?: string; priority?: string }) => request<{ notifications: any[]; unreadCount: number }>(`/api/notifications/manager/${id}${buildQuery(params)}`),
};

export const Analytics = {
  weekly: (zoneId: string) => request<{ weeklyData: any[]; totalWaste: number }>(`/api/analytics/${zoneId}/weekly`),
  categories: (zoneId: string) => request<{ categories: any[]; totalWaste: number }>(`/api/analytics/${zoneId}/categories`),
};

export const Tasks = {
  list: (params?: { zoneId?: string; status?: string; wasteType?: string }) => request<{ tasks: any[] }>(`/api/tasks${buildQuery(params)}`),
  get: (id: string) => request<{ task: any }>(`/api/tasks/${id}`),
};

export const Issues = {
  list: (params?: { zoneId?: string; status?: string; priority?: string; category?: string }) => request<{ issues: any[] }>(`/api/issues${buildQuery(params)}`),
};

export const Reports = {
  list: () => request<{ reports: any[] }>('/api/reports'),
};

export const Performance = {
  forEmployee: (id: string, params?: { start?: string; end?: string }) => request<{ performance: any }>(`/api/performance/employee/${id}${buildQuery(params)}`),
  forManager: (id: string, params?: { start?: string; end?: string }) => request<any>(`/api/performance/manager/${id}${buildQuery(params)}`),
};

// User app features
export const Leaderboard = {
  top: (params?: { zone?: string; range?: 'week' | 'month' | 'all'; page?: number; pageSize?: number }) => request<{ top: any[]; total: number; summary: { rank: number; points: number; weeklyGain: number } }>(`/api/leaderboard${buildQuery(params as any)}`),
  rankForUser: (id: string) => request<{ rank: number; points: number }>(`/api/users/${id}/rank`),
};

export const RewardsApi = {
  list: (params?: { category?: string }) => request<{ rewards: any[] }>(`/api/rewards${buildQuery(params as any)}`),
  redeem: (data: { userId: string; rewardId: string; quantity: number; deliveryOption?: 'pickup' | 'delivery' }) => request<{ success: boolean; remainingPoints: number; orderId: string }>(`/api/rewards/redeem`, 'POST', data),
  history: (userId: string) => request<{ history: any[] }>(`/api/users/${userId}/redeem-history`),
};

export const SettingsApi = {
  get: (userId: string) => request<{ settings: any }>(`/api/users/${userId}/settings`),
  update: (userId: string, settings: any) => request<{ success: boolean }>(`/api/users/${userId}/settings`, 'PUT', settings),
};

export const SupportApi = {
  faq: () => request<{ faq: Array<{ id: string; q: string; a: string; category?: string }> }>(`/api/support/faq`),
  tickets: {
    create: (data: { subject: string; category: string; description: string; zone?: string; attachments?: string[] }) => request<{ ticketId: string; status: string }>(`/api/support/tickets`, 'POST', data),
    list: () => request<{ tickets: any[] }>(`/api/support/tickets`, 'GET'),
  },
  messages: {
    list: (ticketId: string) => request<{ messages: any[] }>(`/api/support/tickets/${ticketId}/messages`),
    send: (ticketId: string, message: { text: string }) => request<{ success: boolean }>(`/api/support/tickets/${ticketId}/messages`, 'POST', message),
  },
};

function buildQuery(params: Record<string, any> | undefined) {
  if (!params) return '';
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return q ? `?${q}` : '';
}

