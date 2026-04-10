import { getSupabaseClient } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("visits")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch visits" }, { status: 500 });
  }
  return NextResponse.json({ visits: data });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { page, user_agent } = await request.json();

    if (!page) {
      return NextResponse.json({ error: "page is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("visits")
      .insert({ page, user_agent, created_at: new Date().toISOString() })
      .select();

    if (error) {
      return NextResponse.json({ error: "Failed to record visit" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data?.[0] }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}