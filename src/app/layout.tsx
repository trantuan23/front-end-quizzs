import { ReactNode } from "react";
import "./globals.css"; 
import { SidebarProvider } from "@/context/SidebarContext";

interface LayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "Quiz online",
  description: "Next.js ShadCN UI Dashboard",
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <SidebarProvider>
       {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
