import { test, expect } from '@playwright/test';
import { criarReceitaViaApi } from './support/api';
import { cadastrarELogar } from './support/session';
import { uniqueText } from './support/unique';

// Usuário próprio e vazio: o valor disponível depende do saldo exato do mês.
test.use({ storageState: { cookies: [], origins: [] } });

test('saldo disponível após a meta aparece no bloco de saldo do mobile', async ({ page }) => {
  await cadastrarELogar(page, 'Usuário Metas Mobile');

  const resumo = page.getByRole('region', { name: 'Resumo do mês' });
  await expect(resumo).toBeVisible();
  await expect(resumo.getByText('Disponível após a meta')).toHaveCount(0);

  await page.goto('/mais/metas-economia');
  await page.getByLabel(/Quanto você quer guardar/).fill('1000,00');
  await page.getByRole('button', { name: 'Definir meta' }).click();
  await expect(page.getByRole('progressbar', { name: 'Progresso da meta de economia' }).first()).toBeVisible();

  // No mobile o lançamento é feito por sheet; a receita de apoio vem direto da API.
  await criarReceitaViaApi(page.request, { descricao: uniqueText('Salário'), valor: 600 });

  await page.goto('/inicio');
  await expect(resumo.getByText('Disponível após a meta')).toBeVisible();
  await expect(resumo.getByText(/-R\$\s*400,00/)).toBeVisible();
  await expect(resumo.getByText('Saldo abaixo da meta')).toBeVisible();
});
