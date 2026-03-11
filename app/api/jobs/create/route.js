import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { encodeSqid } from "@/lib/sqids";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const openAiApiKey = process.env.OPENAI_API_KEY;
const extractionModel = process.env.OPENAI_JOB_EXTRACTION_MODEL || "gpt-5-mini";

function cleanExtractedText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

async function extractJobDetails({ pageText }) {
  const client = new OpenAI({ apiKey: openAiApiKey });
  const response = await client.responses.create({
    model: extractionModel,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: "Extract structured job-posting data from the supplied webpage content. Use only the supplied content. Do not invent details. Prefer the main job description over navigation or footer text. For the job posting's responsibilities and qualifications, convert the relevant section text as Markdown when available.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: pageText,
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "job_posting",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            company: { type: "string" },
            location: { type: "string" },
            responsibilities: { type: "string" },
            minimum_qualifications: { type: "string" },
            preferred_qualifications: { type: "string" },
          },
          required: [
            "title",
            "company",
            "location",
            "responsibilities",
            "minimum_qualifications",
            "preferred_qualifications",
          ],
        },
      },
    },
  });

  return JSON.parse(response.output_text);
}

export async function POST(request) {
  if (!supabaseUrl || !supabasePublishableKey) {
    return NextResponse.json({ error: "Missing Supabase environment variables." }, { status: 500 });
  }

  if (!openAiApiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY." }, { status: 500 });
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const rawUrl = cleanExtractedText(body?.url);
  const pageText = body?.body;
  const parsedUrl = parseUrl(rawUrl);

  if (!parsedUrl) {
    return NextResponse.json({ error: "A valid http(s) job posting URL is required." }, { status: 400 });
  }

  let extracted;
  try {
    extracted = await extractJobDetails({
      pageText,
      sourceUrl: parsedUrl.toString(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to extract job details from the URL." }, { status: 502 });
  }

  const jobToInsert = {
    user_id: userId,
    title: cleanExtractedText(extracted.title),
    company: cleanExtractedText(extracted.company),
    location: cleanExtractedText(extracted.location),
    responsibilities: cleanExtractedText(extracted.responsibilities),
    minimum_qualifications: cleanExtractedText(extracted.minimum_qualifications),
    preferred_qualifications: cleanExtractedText(extracted.preferred_qualifications),
    url: parsedUrl.toString(),
  };

  const supabase = createClient(supabaseUrl, supabasePublishableKey);
  const { data, error } = await supabase.from("jobs").insert(jobToInsert).select("*").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      ...data,
      sqid: encodeSqid(data.id),
    },
    { status: 201 },
  );
}
