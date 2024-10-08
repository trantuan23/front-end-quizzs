import { ReactNode } from "react";
import "./globals.css"; 
import { SidebarProvider } from "@/context/SidebarContext";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "Quiz Online",
  description: "Next.js ShadCN UI Dashboard",
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body suppressHydrationWarning={true}>
        <SidebarProvider>
          <div className="min-h-screen flex flex-col">
            {/* Main content area */}
            <main className="flex-grow">
              {children}
            </main>

            {/* Toaster for notifications */}
            <Toaster />
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
