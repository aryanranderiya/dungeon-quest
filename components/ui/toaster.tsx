"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, icon, ...props }) => (
        <Toast key={id} {...props} variant="pixel">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 relative flex-shrink-0 pixelated-toast">
                {icon}
              </div>
            )}
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="text-orange-300 font-bold">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-orange-100">
                  {description}
                </ToastDescription>
              )}
            </div>
          </div>
          {action}
          <ToastClose className="text-orange-300 hover:text-orange-200" />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
