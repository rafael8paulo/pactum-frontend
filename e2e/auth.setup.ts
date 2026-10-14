import { test as setup } from '@playwright/test';
import { cadastrarELogar } from './support/session';

const AUTH_FILE = 'e2e/.auth/user.json';

setup('cadastra usuário único e salva a sessão', async ({ page }) => {
  await cadastrarELogar(page);
  await page.context().storageState({ path: AUTH_FILE });
});
