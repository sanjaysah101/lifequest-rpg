"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "fixed right-8 bottom-8 rounded-lg border border-white/20 bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 text-white shadow-lg backdrop-blur-sm",
          title: "text-white font-semibold",
          description: "text-white opacity-80",
          actionButton: "bg-white text-black rounded-md px-2 py-1",
          cancelButton: "text-white/70 hover:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
