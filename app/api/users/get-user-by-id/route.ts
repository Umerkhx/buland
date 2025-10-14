import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

  const { data: user, error } = await supabaseServer
    .from("users")
    .select("id, email, full_name, role, city, phone_number, address")
    .eq("id", id)
    .single();

  if (error || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user });
}
