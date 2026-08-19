import { getSupabaseClient } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import {
  projectSchema,
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
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch projects" },
        { status: 500 }
      );
    }

    return NextResponse.json({ projects: data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for project creation
 * Security layers (in order):
 * 1. Content-Type validation (Task 7.2)
 * 2. Payload size validation (Task 7.2)
 * 3. Rate limiting (Task 7.1)
 * 4. Comprehensive validation with Zod schema (Task 7.2)
 * 
 * Requirements covered: 4.1-4.4, 9.2, 10.4-10.8
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

    // LAYER 2: Payload size validation (implied from contact API pattern)
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

    // LAYER 3: Rate limiting (Task 7.1, Requirements 4.1-4.4)
    const clientIdentifier = getClientIdentifier(request);
    const rateLimitResult = checkRateLimit(clientIdentifier, "PROJECTS");

    if (!rateLimitResult.allowed) {
      // Log rate limit violations
      logRateLimitViolation(clientIdentifier, "PROJECTS");

      // Requirement 4.3: Return HTTP 429
      return NextResponse.json(
        { error: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    // LAYER 4: Comprehensive validation with Zod schema (Task 7.2, Requirements 9.2, 10.4-10.8)
    const validationResult = validateData(projectSchema, body);

    if (!validationResult.success) {
      // Return specific validation error message (Requirement 10.4, 10.5, 10.6, 10.7, 10.8)
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    // Extract validated and sanitized data
    // Data is already normalized (whitespace) and HTML-escaped by Zod transform (Requirement 9.2)
    const { title, description, technologies, github_url, live_url, image_url } = validationResult.data;

    // Insert project into Supabase
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .insert({
        title,
        description,
        image_url: image_url || null,
        github_url: github_url || null,
        live_url: live_url || null,
        technologies,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create project" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Project created successfully!",
        data: data[0]
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