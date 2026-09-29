'use client';

import { Toaster } from 'sonner';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// tab bar (4rem) + folga, acima da safe-area do aparelho
const MOBILE_BOTTOM = 'calc(5rem + env(safe-area-inset-bottom))';

/**
 * Desktop: canto superior direito. Mobile: base da tela, acima da tab bar.
 * O sonner anuncia via região aria-live e não move o foco do campo em edição.
 */
export function AppToaster() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const mobile = isDesktop === false;

  return (
    <Toaster
      richColors
      position={mobile ? 'bottom-center' : 'top-right'}
      offset={mobile ? { bottom: MOBILE_BOTTOM } : undefined}
      mobileOffset={{ bottom: MOBILE_BOTTOM }}
    />
  );
}
