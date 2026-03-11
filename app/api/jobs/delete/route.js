import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { decodeSqid } from "@/lib/sqids";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function DELETE(request) {
  if (!supabaseUrl || !supabasePublishableKey) {
    return NextResponse.json({ error: "Missing Supabase environment variables." }, { status: 500 });
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const jobSqid = typeof body?.sqid === "string" ? body.sqid : "";
  const jobId = decodeSqid(jobSqid);

  if (jobId === null) {
    return NextResponse.json({ error: "Invalid job sqid." }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabasePublishableKey);
  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
