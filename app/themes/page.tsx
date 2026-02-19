import { redirect } from "next/navigation";

// This route is deprecated; immediately redirect to the homepage.
export default function ThemesPage() {
  redirect("/");
}