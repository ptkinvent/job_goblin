import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { encodeSqid } from "@/lib/sqids";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function GET() {
  if (!supabaseUrl || !supabasePublishableKey) {
    return NextResponse.json(
      { error: "Missing Supabase environment variables." },
      { status: 500 },
    );
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  const supabase = createClient(supabaseUrl, supabasePublishableKey);
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  const jobs = data.map((job) => ({
    ...job,
    sqid: encodeSqid(job.id),
  }));

  return NextResponse.json(jobs, { status: 200 });
}
