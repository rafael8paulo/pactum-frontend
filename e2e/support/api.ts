import type { APIRequestContext } from '@playwright/test';

const API_URL = process.env.E2E_API_URL ?? 'http://localhost:8081';

export function competenciaAtual(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
}

/** Cria dados de apoio direto na API, usando a sessão do contexto de teste. */
export async function criarDespesaViaApi(
  request: APIRequestContext,
  dados: { descricao: string; valor: number; status: 'PENDENTE' | 'AGENDADA' | 'PAGA' }
) {
  const resposta = await request.post(`${API_URL}/api/v1/despesas`, {
    data: { categoria: 'OUTROS', competencia: competenciaAtual(), ...dados },
  });
  if (!resposta.ok()) {
    throw new Error(`Falha ao criar despesa via API: ${resposta.status()} ${await resposta.text()}`);
  }
}

export async function criarReceitaViaApi(
  request: APIRequestContext,
  dados: { descricao: string; valor: number }
) {
  const resposta = await request.post(`${API_URL}/api/v1/receitas`, {
    data: { categoria: 'SALARIO', competencia: competenciaAtual(), ...dados },
  });
  if (!resposta.ok()) {
    throw new Error(`Falha ao criar receita via API: ${resposta.status()} ${await resposta.text()}`);
  }
}
