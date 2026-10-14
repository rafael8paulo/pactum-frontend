import { test, expect } from '@playwright/test';
import { criarDespesaViaApi } from './support/api';
import { uniqueText } from './support/unique';

// O agrupamento (lib/lancamentos/group) só existe na visão mobile; no desktop há tabela.
test('despesas aparecem agrupadas por status', async ({ page, request }) => {
  const pendente = uniqueText('Pendente');
  const paga = uniqueText('Paga');
  await criarDespesaViaApi(request, { descricao: pendente, valor: 10, status: 'PENDENTE' });
  await criarDespesaViaApi(request, { descricao: paga, valor: 20, status: 'PAGA' });

  await page.goto('/lancamentos?tipo=despesa');

  const grupoPendentes = page.getByRole('region', { name: 'Pendentes' });
  const grupoPagas = page.getByRole('region', { name: 'Pagas' });

  await expect(grupoPendentes).toContainText(pendente);
  await expect(grupoPendentes).not.toContainText(paga);
  await expect(grupoPagas).toContainText(paga);
  await expect(grupoPagas).not.toContainText(pendente);
});
