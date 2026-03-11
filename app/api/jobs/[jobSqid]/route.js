import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { decodeSqid, encodeSqid } from "@/lib/sqids";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function GET(_request, { params }) {
  if (!supabaseUrl || !supabasePublishableKey) {
    return NextResponse.json(
      { error: "Missing Supabase environment variables." },
      { status: 500 },
    );
  }

  const { jobSqid } = await params;
  const jobId = decodeSqid(jobSqid);

  if (jobId === null) {
    return NextResponse.json(
      { error: "Invalid job sqid." },
      { status: 400 },
    );
  }

  const supabase = createClient(supabaseUrl, supabasePublishableKey);
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Job not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      ...data,
      sqid: encodeSqid(data.id),
    },
    { status: 200 },
  );
}
