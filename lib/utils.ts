import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatCompetencia(competencia: string): string {
  const [year, month] = competencia.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

export function getCurrentCompetencia(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function addMonths(competencia: string, delta: number): string {
  const [year, month] = competencia.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  return `${newYear}-${newMonth}`;
}

/** Percentual da receita já comprometido por despesas (0–100). */
export function percentualComprometido(totalReceitas: number, totalDespesas: number): number {
  if (totalReceitas > 0) return Math.min(100, Math.round((totalDespesas / totalReceitas) * 100));
  return totalDespesas > 0 ? 100 : 0;
}
