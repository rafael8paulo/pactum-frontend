import { Spinner } from './spinner';

export function PageLoader() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Spinner size="md" />
    </div>
  );
}
