import axios from 'axios';
import { clearFinancialCache } from '@/lib/query-client';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Sessão inválida em endpoint não-auth: purga o cache financeiro e vai ao login,
// preservando a rota pretendida. Falha de rede (sem `response`) NUNCA redireciona.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? '';
    if (error.response?.status === 401 && !url.includes('/auth/')) {
      clearFinancialCache();
      const { pathname, search } = window.location;
      const destino = pathname.startsWith('/login')
        ? '/login'
        : `/login?redirect=${encodeURIComponent(pathname + search)}`;
      window.location.href = destino;
    }
    return Promise.reject(error);
  }
);
