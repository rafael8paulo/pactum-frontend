'use client';

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

const cadastroSchema = z
  .object({
    nome: z.string().min(2, 'Nome obrigatório'),
    email: z.string().email('Email inválido'),
    senha: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não conferem',
    path: ['confirmarSenha'],
  });

type CadastroFormValues = z.infer<typeof cadastroSchema>;

export function CadastroForm() {
  const { cadastro } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
  });

  async function onSubmit(data: CadastroFormValues) {
    try {
      await cadastro({ nome: data.nome, email: data.email, senha: data.senha });
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      toast.error(message);
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        setError('email', { message: 'Este email já está cadastrado.' });
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" type="text" autoComplete="name" {...register('nome')} />
        {errors.nome && (
          <p className="text-sm text-destructive">{errors.nome.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="senha">Senha</Label>
        <Input id="senha" type="password" autoComplete="new-password" {...register('senha')} />
        {errors.senha && (
          <p className="text-sm text-destructive">{errors.senha.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
        <Input
          id="confirmarSenha"
          type="password"
          autoComplete="new-password"
          {...register('confirmarSenha')}
        />
        {errors.confirmarSenha && (
          <p className="text-sm text-destructive">{errors.confirmarSenha.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Spinner size="sm" /> : 'Criar conta'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
