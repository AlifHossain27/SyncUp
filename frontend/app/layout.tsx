import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/Footer";
import { AuthProvider } from '@/redux/provider'
import NextTopLoader from 'nextjs-toploader'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: "BUCC SyncUp",
  description: "Your Monthly Dose of Digital Insight",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${spaceGrotesk.variable} antialiased`}
      >
        
        <AuthProvider>
        <main className="flex">
          <div className='flex flex-col w-full'>
            <NextTopLoader/>
            <Header/>
            <div className='flex-1'>
                {children}
            </div>
            <Footer/>
            <Toaster />
          </div>
        </main>
        </AuthProvider>
      </body>
    </html>
  );
}