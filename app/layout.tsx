"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StarsCanvas from "@/components/main/StarBackground";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Space Portfolio",
//   description: "This is my portfolio",
// };

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Si la ruta es /runic o subruta, no renderizar navbar, footer ni estrellas
  if (pathname && pathname.startsWith("/runic")) {
    return <>{children}</>;
  }

  return (
    <>
      <StarsCanvas />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#030014] overflow-y-scroll overflow-x-hidden`}
      >
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
