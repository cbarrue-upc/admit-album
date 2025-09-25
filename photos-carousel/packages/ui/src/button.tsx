import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from './utils.js';

export type ButtonVariant = 'primary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const baseStyles =
  'inline-flex items-center justify-center rounded-full text-lg font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-60 disabled:cursor-not-allowed';
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700',
  ghost: 'bg-transparent text-white border border-white/40 hover:bg-white/10',
};

export function Button({
  children,
  className,
  variant = 'primary',
  fullWidth,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(baseStyles, variants[variant], fullWidth && 'w-full', className)}
      {...props}
    >
      {children}
    </button>
  );
}
