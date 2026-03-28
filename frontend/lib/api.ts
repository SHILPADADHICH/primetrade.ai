const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const fetcher = async (url: string, options: any = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const api = {
  auth: {
    login: (credentials: any) => fetcher('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (data: any) => fetcher('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  },
  tasks: {
    getAll: () => fetcher('/tasks'),
    getOne: (id: string) => fetcher(`/tasks/${id}`),
    create: (data: any) => fetcher('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetcher(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetcher(`/tasks/${id}`, { method: 'DELETE' }),
  },
};
