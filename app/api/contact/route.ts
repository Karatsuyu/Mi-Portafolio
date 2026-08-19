import { getSupabaseClient } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import {
  contactFormSchema,
  validateContentType,
  validatePayloadSize,
  validateData,
} from "@/lib/security/validation";
import {
  checkRateLimit,
  getClientIdentifier,
  logRateLimitViolation,
} from "@/lib/security/rateLimit";

/**
 * POST endpoint for contact form submissions
 * Security layers (in order):
 * 1. Honeypot validation (Task 6.2)
 * 2. Rate limiting (Task 6.3)
 * 3. Comprehensive validation (Task 6.4)
 * 
 * Requirements covered: 1.1-1.10, 3.1-3.5, 5.1-5.5, 9.1-9.5, 10.1-10.3
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

    // LAYER 2: Payload size validation (Requirement 1.7)
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

    // LAYER 3: Honeypot validation - BEFORE expensive operations (Task 6.2, Requirement 5.2, 5.5)
    // Check honeypot field before rate limiting and validation
    if (body.honeypot && body.honeypot.trim() !== "") {
      // Requirement 5.4: Log honeypot triggers
      const clientIp = getClientIdentifier(request);
      const timestamp = new Date().toISOString();
      console.warn(
        `[HONEYPOT] ${timestamp} - Bot detected from IP ${clientIp} - honeypot field filled`
      );

      // Requirement 5.2, 5.3: Return generic error without revealing honeypot detection
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 }
      );
    }

    // LAYER 4: Rate limiting (Task 6.3, Requirements 3.1-3.5)
    const clientIdentifier = getClientIdentifier(request);
    const rateLimitResult = checkRateLimit(clientIdentifier, "CONTACT");

    if (!rateLimitResult.allowed) {
      // Requirement 3.5: Log rate limit violations
      logRateLimitViolation(clientIdentifier, "CONTACT");

      // Requirement 3.2: Return HTTP 429
      return NextResponse.json(
        { error: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    // LAYER 5: Comprehensive validation with Zod schema (Task 6.4, Requirements 1.1-1.10)
    const validationResult = validateData(contactFormSchema, body);

    if (!validationResult.success) {
      // Return specific validation error message (Requirement 1.4, 1.5, 1.6)
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    // Extract validated and sanitized data
    // Data is already normalized (whitespace) and HTML-escaped by Zod transform
    const { name, email, message } = validationResult.data;

    // Insert message into Supabase
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({
        name,
        email,
        message,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save message" },
        { status: 500 }
      );
    }

    // Requirement 1.10: Return HTTP 201 with success confirmation
    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully!",
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

/**
 * GET endpoint for retrieving contact messages
 * 
 * @returns 401 Unauthorized - Authentication is required to access messages
 * 
 * NOTE: This endpoint previously exposed all contact messages publicly.
 * Admin access requires proper authentication implementation (future enhancement).
 * For now, all GET requests are blocked to prevent unauthorized access to private messages.
 * 
 * Requirements covered: 2.1-2.5 (Eliminate Public Access to Private Messages)
 */
export async function GET() {
  return NextResponse.json(
    { error: "Authentication required" },
    { status: 401 }
  );
}