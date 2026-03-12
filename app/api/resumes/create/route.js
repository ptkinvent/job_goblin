import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import mammoth from "mammoth";
import OpenAI from "openai";
import { PDFParse } from "pdf-parse";
import { NextResponse } from "next/server";
import { encodeSqid } from "@/lib/sqids";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const openAiApiKey = process.env.OPENAI_API_KEY;
const resumeFormattingModel = process.env.OPENAI_RESUME_FORMATTING_MODEL || "gpt-5-mini";
const maxUploadBytes = 10 * 1024 * 1024;
const acceptedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const acceptedExtensions = new Set(["pdf", "docx"]);

function getFileExtension(filename) {
  const segments = filename.toLowerCase().split(".");
  return segments.length > 1 ? segments.at(-1) : "";
}

function normalizeExtractedText(text) {
  return typeof text === "string" ? text.replace(/\u0000/g, "").replace(/\r\n/g, "\n").trim() : "";
}

function normalizeMarkdown(text) {
  return typeof text === "string" ? text.trim() : "";
}

function isAcceptedResume(file) {
  const extension = getFileExtension(file.name);
  return acceptedMimeTypes.has(file.type) || acceptedExtensions.has(extension);
}

async function extractPdfText(buffer) {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    return normalizeExtractedText(result.text);
  } finally {
    await parser.destroy().catch(() => null);
  }
}

async function extractDocxText(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return normalizeExtractedText(result.value);
}

async function extractResumeText(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = getFileExtension(file.name);

  if (file.type === "application/pdf" || extension === "pdf") {
    return extractPdfText(buffer);
  }

  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === "docx"
  ) {
    return extractDocxText(buffer);
  }

  return "";
}

async function formatResumeAsMarkdown(rawText) {
  const client = new OpenAI({ apiKey: openAiApiKey });
  const response = await client.responses.create({
    model: resumeFormattingModel,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: "Convert the supplied resume text into clean Markdown. Preserve the candidate's facts, wording, chronology, and section meaning. Do not invent experience, dates, metrics, or contact details. Use concise Markdown headings and bullet lists where helpful. Return Markdown only.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: rawText,
          },
        ],
      },
    ],
  });

  return normalizeMarkdown(response.output_text);
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

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("resume");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A resume file is required." }, { status: 400 });
  }

  if (!isAcceptedResume(file)) {
    return NextResponse.json({ error: "Resume must be a PDF or DOCX file." }, { status: 400 });
  }

  if (file.size > maxUploadBytes) {
    return NextResponse.json({ error: "Resume must be 10MB or smaller." }, { status: 400 });
  }

  let rawText = "";
  try {
    rawText = await extractResumeText(file);
  } catch {
    return NextResponse.json({ error: "Failed to extract text from the uploaded file." }, { status: 422 });
  }

  if (!rawText) {
    return NextResponse.json({ error: "No readable text was found in the uploaded file." }, { status: 422 });
  }

  let markdown = "";
  try {
    markdown = await formatResumeAsMarkdown(rawText);
  } catch {
    return NextResponse.json({ error: "Failed to format the resume with OpenAI." }, { status: 502 });
  }

  if (!markdown) {
    return NextResponse.json({ error: "OpenAI returned an empty resume result." }, { status: 502 });
  }

  const supabase = createClient(supabaseUrl, supabasePublishableKey);

  try {
    const { data, error } = await supabase.from("resumes").insert({
      user_id: userId,
      fileName: file.name,
      body: markdown,
    }).select("*").single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        ...data,
        sqid: typeof data?.id === "number" ? encodeSqid(data.id) : null,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to save resume." }, { status: 500 });
  }
}
