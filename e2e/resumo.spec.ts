import { test, expect } from '@playwright/test';
import { LancamentosPage } from './pages/LancamentosPage';
import { cadastrarELogar } from './support/session';
import { uniqueText } from './support/unique';

// Usuário próprio e vazio: os totais do mês precisam ser exatos.
test.use({ storageState: { cookies: [], origins: [] } });

test('totais do resumo refletem receita e despesa criadas', async ({ page }) => {
  await cadastrarELogar(page, 'Usuário Resumo');

  const lancamentos = new LancamentosPage(page);
  await lancamentos.goto('receita');
  await lancamentos.criar('receita', uniqueText('Salário'), '1000,00');
  await lancamentos.goto('despesa');
  await lancamentos.criar('despesa', uniqueText('Aluguel'), '250,00');

  await page.goto('/inicio');

  const card = (titulo: string) =>
    page.getByText(titulo, { exact: true }).locator('xpath=../..');

  await expect(card('Total Receitas')).toContainText('1.000,00');
  await expect(card('Total Despesas')).toContainText('250,00');
  await expect(card('Saldo')).toContainText('750,00');
});
