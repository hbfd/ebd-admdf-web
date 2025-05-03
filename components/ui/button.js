import { cn } from '../../lib/utils';

export function Button({ className, variant = "default", ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent text-white hover:bg-white/10",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
}
