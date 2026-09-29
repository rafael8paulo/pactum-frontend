import { Suspense } from 'react';
import { MaisHub } from '@/components/features/mais/MaisHub';

export default function MaisPage() {
  return (
    <Suspense>
      <MaisHub />
    </Suspense>
  );
}
