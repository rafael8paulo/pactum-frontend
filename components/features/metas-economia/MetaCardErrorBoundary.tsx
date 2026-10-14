'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/** Isola falhas de render do card para não derrubar a tela inicial. */
export class MetaCardErrorBoundary extends Component<Props, { falhou: boolean }> {
  state = { falhou: false };

  static getDerivedStateFromError() {
    return { falhou: true };
  }

  render() {
    if (this.state.falhou) {
      return (
        <div className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
          Meta de economia indisponível no momento.
        </div>
      );
    }
    return this.props.children;
  }
}
