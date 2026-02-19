import type { Metadata } from "next";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Space Portfolio - Alternative View",
  description: "Portfolio with space theme, 3D effects and cosmic aesthetics",
};

export default function SpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}