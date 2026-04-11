"use client";

import React from "react";
import { usePathname } from "next/navigation";

import StarsCanvas from "@/components/main/StarBackground";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname && (pathname.startsWith("/runic") || pathname.startsWith("/cyber"))) {
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
