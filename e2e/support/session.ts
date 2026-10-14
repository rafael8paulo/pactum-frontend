import { expect, type Page } from '@playwright/test';
import { CadastroPage } from '../pages/CadastroPage';
import { LoginPage } from '../pages/LoginPage';
import { SENHA_TESTE, uniqueEmail } from './unique';

/** Cadastra um usuário novo pela UI e o deixa autenticado em /inicio. */
export async function cadastrarELogar(page: Page, nome = 'Usuário E2E') {
  const email = uniqueEmail();

  const cadastro = new CadastroPage(page);
  await cadastro.goto();
  expect(await cadastro.cadastrar(nome, email, SENHA_TESTE)).toBe(201);

  // O cadastro não abre sessão: parte de um estado limpo e autentica pelo login.
  await page.context().clearCookies();
  const login = new LoginPage(page);
  await login.goto();
  await login.login(email, SENHA_TESTE);
  await expect(page).toHaveURL(/\/inicio/);

  return email;
}
