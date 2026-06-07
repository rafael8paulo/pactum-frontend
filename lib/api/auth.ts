import { api } from './client';
import type { Usuario, LoginRequest, CadastroRequest } from '@/types/auth';

export const authApi = {
  login: (data: LoginRequest) =>
    api
      .post<Usuario>('/api/v1/auth/login', new URLSearchParams({ email: data.email, senha: data.senha }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then((r) => r.data),

  cadastro: (data: CadastroRequest) =>
    api.post<Usuario>('/api/v1/auth/cadastro', data).then((r) => r.data),

  logout: () =>
    api.post('/api/v1/auth/logout').then((r) => r.data),

  me: () =>
    api.get<Usuario>('/api/v1/auth/me').then((r) => r.data),
};
