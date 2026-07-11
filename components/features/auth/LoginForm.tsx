'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/providers/auth-provider';
import { getErrorMessage } from '@/lib/api/error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormValues) {
    setAuthError(null);
    try {
      await login(data);
    } catch (err) {
      const message = getErrorMessage(err, 'Email ou senha incorretos.');
      setAuthError(message);
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="senha">Senha</Label>
        <Input id="senha" type="password" autoComplete="current-password" {...register('senha')} />
        {errors.senha && (
          <p className="text-sm text-destructive">{errors.senha.message}</p>
        )}
      </div>

      {authError && (
        <p className="text-sm text-destructive">{authError}</p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Spinner size="sm" /> : 'Entrar'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        * Não tem conta?{' '}
        <Link href="/cadastro" className="font-medium text-foreground hover:underline">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
