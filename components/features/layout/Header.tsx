'use client';

import { Moon, Sun, Menu, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { MonthPicker } from './MonthPicker';
import { useAuth } from '@/providers/auth-provider';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { usuario, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Suspense>
          <MonthPicker />
        </Suspense>
      </div>
      <div className="flex items-center gap-2">
        {usuario && (
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {usuario.nome}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Alternar tema"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        {usuario && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Sair"
          >
            {isLoggingOut ? <Spinner size="sm" /> : <LogOut className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </header>
  );
}
