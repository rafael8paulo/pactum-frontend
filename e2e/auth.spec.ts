import { test, expect } from '@playwright/test';
import { CadastroPage } from './pages/CadastroPage';
import { LoginPage } from './pages/LoginPage';
import { cadastrarELogar } from './support/session';
import { SENHA_TESTE, uniqueEmail } from './support/unique';

test.describe('autenticação', () => {
  test('cadastro de novo usuário e login com as mesmas credenciais', async ({ page }) => {
    const email = uniqueEmail();

    const cadastro = new CadastroPage(page);
    await cadastro.goto();
    expect(await cadastro.cadastrar('Novo Usuário', email, SENHA_TESTE)).toBe(201);

    await page.context().clearCookies();
    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, SENHA_TESTE);
    await expect(page).toHaveURL(/\/inicio/);
  });

  test('cadastro com e-mail já existente mostra erro no campo', async ({ page }) => {
    const email = uniqueEmail();
    const cadastro = new CadastroPage(page);

    await cadastro.goto();
    expect(await cadastro.cadastrar('Duplicado', email, SENHA_TESTE)).toBe(201);

    await page.context().clearCookies();
    await cadastro.goto();
    expect(await cadastro.cadastrar('Duplicado', email, SENHA_TESTE)).toBe(409);
    await expect(page.getByText('Este email já está cadastrado.')).toBeVisible();
  });

  test('logout volta ao estado não autenticado', async ({ page }) => {
    await cadastrarELogar(page, 'Usuário Logout');

    await page.getByRole('button', { name: 'Sair' }).click();
    await expect(page).toHaveURL(/\/login/);

    await page.goto('/lancamentos');
    await expect(page).toHaveURL(/\/login/);
  });

  test('rota protegida sem sessão redireciona para /login', async ({ page }) => {
    await page.goto('/lancamentos');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login com senha incorreta mostra erro e permanece em /login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(uniqueEmail(), 'senha-errada-123');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/credenciais inválidas/i).first()).toBeVisible();
  });
});
