import { CloudAlert } from '@/lib/icons';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

/** Estado de erro recuperável: uma única ação, "Tentar novamente". */
export function ErrorState({
  title = 'Não foi possível carregar',
  message = 'Verifique sua conexão e tente de novo.',
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <CloudAlert className="h-10 w-10 text-muted-foreground" aria-hidden />
      <p className="text-base font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button className="mt-2 h-11" onClick={onRetry} disabled={isRetrying}>
        Tentar novamente
      </Button>
    </div>
  );
}
