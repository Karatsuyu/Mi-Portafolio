import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Theme Selector - Portfolio",
  description: "Choose your preferred theme for the portfolio experience",
};

export default function ThemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}