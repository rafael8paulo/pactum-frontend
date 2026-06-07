'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import type { Usuario, LoginRequest, CadastroRequest } from '@/types/auth';

interface AuthContextType {
  usuario: Usuario | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  cadastro: (data: CadastroRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    authApi
      .me()
      .then((u) => setUsuario(u))
      .catch(() => setUsuario(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(data: LoginRequest) {
    const u = await authApi.login(data);
    setUsuario(u);
    router.push('/resumo');
  }

  async function cadastro(data: CadastroRequest) {
    const u = await authApi.cadastro(data);
    setUsuario(u);
    router.push('/resumo');
  }

  async function logout() {
    await authApi.logout();
    setUsuario(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ usuario, isLoading, login, cadastro, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
