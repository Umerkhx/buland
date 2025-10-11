import { supabaseServer } from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id)
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

  const { data: userData, error: userError } = await supabaseServer
    .from("users")
    .select("role")
    .eq("id", user_id)
    .single();

  if (userError)
    return NextResponse.json({ error: userError.message }, { status: 400 });

  let query = supabaseServer.from("cart").select("*");

  if (userData?.role !== "admin") {
    query = query.eq("user_id", user_id);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 200 });
}
