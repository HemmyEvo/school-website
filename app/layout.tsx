import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme/ThemeProvider";
import {ConvexClientProvider} from "@/provider/ConvexProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import {Toaster} from "react-hot-toast"
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Class'27 Portal",
  description: "Website for lautech class'27",
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 min-h-[100vh] relative ${geistMono.variable} antialiased`}
      >
             <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        > 
        <TooltipProvider>
          <ConvexClientProvider> 
          {children}
          <Toaster />
          </ConvexClientProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
