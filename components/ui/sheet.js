import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from '../../lib/utils';
import { X } from "lucide-react";
import { forwardRef } from "react";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;

export const SheetContent = forwardRef(
  ({ className, children, side = "right", ...props }, ref) => (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 bg-black/40 z-40" />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-white dark:bg-gray-800 p-6 shadow-lg transition ease-in-out duration-300",
          side === "left" && "top-0 left-0 h-full w-64",
          side === "right" && "top-0 right-0 h-full w-64",
          side === "bottom" && "bottom-0 left-0 w-full h-64",
          side === "top" && "top-0 left-0 w-full h-64",
          className
        )}
        {...props}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          onClick={() => props.onClose?.()}
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
);

SheetContent.displayName = "SheetContent";
