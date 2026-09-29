import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  /** Título contextualizado (ex.: "Nenhuma despesa em setembro de 2026"). */
  title?: string;
  /** Ação primária do estado vazio. */
  children?: React.ReactNode;
}

export function EmptyState({ message, title, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
      <Inbox className="h-10 w-10 text-muted-foreground" aria-hidden />
      {title && <p className="text-base font-semibold">{title}</p>}
      <p className="text-sm text-muted-foreground">{message}</p>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
