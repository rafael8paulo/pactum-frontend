import { randomBytes } from 'node:crypto';

export function uniqueSuffix(): string {
  return `${Date.now().toString(36)}${randomBytes(3).toString('hex')}`;
}

export function uniqueEmail(): string {
  return `e2e+${uniqueSuffix()}@pactum.test`;
}

export function uniqueText(prefix: string): string {
  return `${prefix} ${uniqueSuffix()}`;
}

export const SENHA_TESTE = 'Senha-e2e-123';
