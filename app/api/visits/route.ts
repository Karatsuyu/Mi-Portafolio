import { getSupabaseClient } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import {
  visitSchema,
  validateContentType,
  validatePayloadSize,
  validateData,
} from "@/lib/security/validation";
import {
  checkRateLimit,
  getClientIdentifier,
  logRateLimitViolation,
} from "@/lib/security/rateLimit";

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("visits")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch visits" },
        { status: 500 }
      );
    }

    return NextResponse.json({ visits: data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for visit tracking
 * Security layers (in order):
 * 1. Content-Type validation (Task 8.2)
 * 2. Payload size validation (Task 8.2)
 * 3. Rate limiting (Task 8.1)
 * 4. Comprehensive validation with Zod schema (Task 8.2)
 * 
 * Requirements covered: 4.1-4.4, 10.1-10.2
 */
export async function POST(request: NextRequest) {
  try {
    // LAYER 1: Content-Type validation (Requirement 10.1)
    const contentType = request.headers.get("content-type");
    if (!validateContentType(contentType)) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    // LAYER 2: Payload size validation
    const contentLength = request.headers.get("content-length");
    if (!validatePayloadSize(contentLength)) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413 }
      );
    }

    // Parse JSON body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    // LAYER 3: Rate limiting (Task 8.1, Requirements 4.1-4.4)
    const clientIdentifier = getClientIdentifier(request);
    const rateLimitResult = checkRateLimit(clientIdentifier, "VISITS");

    if (!rateLimitResult.allowed) {
      // Log rate limit violations
      logRateLimitViolation(clientIdentifier, "VISITS");

      // Requirement 4.3: Return HTTP 429
      return NextResponse.json(
        { error: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    // LAYER 4: Comprehensive validation with Zod schema (Task 8.2, Requirements 10.1-10.2)
    const validationResult = validateData(visitSchema, body);

    if (!validationResult.success) {
      // Return specific validation error message
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    // Extract validated and sanitized data
    const { page, user_agent } = validationResult.data;

    // Insert visit into Supabase
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("visits")
      .insert({
        page,
        user_agent: user_agent || null,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to record visit" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Visit recorded successfully!",
        data: data[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}