import { test, expect } from '@playwright/test';
import { LancamentosPage } from './pages/LancamentosPage';
import { uniqueText } from './support/unique';

test('criar uma receita e vê-la na lista', async ({ page }) => {
  const lancamentos = new LancamentosPage(page);
  const descricao = uniqueText('Receita');

  await lancamentos.goto('receita');
  await lancamentos.criar('receita', descricao, '2500,00');

  await expect(lancamentos.linha(descricao)).toBeVisible();
  await expect(lancamentos.linha(descricao)).toContainText('2.500,00');
});
