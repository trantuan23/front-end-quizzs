import { ReactNode } from "react";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { Toaster } from "@/components/ui/toaster";
import { ReduxProvider } from "@/store/ReduxProvider";

export const metadata = {
  title: "Quiz Online",
  description: "Next.js ShadCN UI Dashboard",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-100" suppressHydrationWarning={true}>
        <ReduxProvider>
          <SidebarProvider>
            <main className="flex-grow">{children}</main>
          </SidebarProvider>
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
