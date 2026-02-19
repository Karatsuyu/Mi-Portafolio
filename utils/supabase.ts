import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  github_url?: string;
  live_url?: string;
  technologies: string[];
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon_url?: string;
  created_at: string;
}