import { test, expect } from '@playwright/test';
import { LancamentosPage } from './pages/LancamentosPage';
import { cadastrarELogar } from './support/session';
import { uniqueText } from './support/unique';

// Usuário próprio e vazio: o progresso da meta depende do saldo exato do mês.
test.use({ storageState: { cookies: [], origins: [] } });

test('define a meta, acompanha o progresso e remove', async ({ page }) => {
  await cadastrarELogar(page, 'Usuário Metas');

  // Sem meta: a home convida a definir.
  await expect(page.getByText('Quanto você quer guardar neste mês?')).toBeVisible();

  await page.goto('/mais/metas-economia');
  await expect(page.getByRole('heading', { name: 'Metas de economia' })).toBeVisible();
  await page.getByLabel(/Quanto você quer guardar/).fill('1000,00');
  await page.getByRole('button', { name: 'Definir meta' }).click();

  const barra = page.getByRole('progressbar', { name: 'Progresso da meta de economia' }).first();
  await expect(barra).toHaveAttribute('aria-valuenow', '0');

  // Uma receita de R$ 600 sem despesas = 60% da meta.
  const lancamentos = new LancamentosPage(page);
  await lancamentos.goto('receita');
  await lancamentos.criar('receita', uniqueText('Salário'), '600,00');

  await page.goto('/inicio');
  const card = page.getByRole('region', { name: 'Meta de economia' });
  await expect(card).toContainText('60%');
  await expect(card).toContainText('600,00');
  await expect(card.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60');

  // Remoção com confirmação volta ao estado "sem meta".
  await page.goto('/mais/metas-economia');
  await page.getByRole('button', { name: 'Remover meta' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Remover' }).click();
  await expect(page.getByRole('region', { name: 'Meta de economia' })).toContainText(
    'Quanto você quer guardar neste mês?'
  );
});
