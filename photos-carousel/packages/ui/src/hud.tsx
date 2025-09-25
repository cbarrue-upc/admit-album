import type { PropsWithChildren } from 'react';
import { cn } from './utils.js';

interface HUDProps {
  visible: boolean;
  anchor?: 'top' | 'bottom';
}

export function HUD({ visible, anchor = 'bottom', children }: PropsWithChildren<HUDProps>) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute left-0 right-0 flex justify-center transition-opacity duration-200',
        anchor === 'bottom' ? 'bottom-0' : 'top-0',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div className="pointer-events-auto m-4 flex items-center gap-4 rounded-full bg-black/60 px-6 py-4 backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}
