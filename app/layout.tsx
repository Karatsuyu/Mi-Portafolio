import { Inter } from "next/font/google";
import "./globals.css";
import LayoutContent from "@/components/global/LayoutContent";

const inter = Inter({ subsets: ["latin"] });

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
