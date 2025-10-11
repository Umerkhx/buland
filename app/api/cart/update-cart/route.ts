import { supabaseServer } from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, user_id, ...updates } = body;

  if (!id || !user_id)
    return NextResponse.json({ error: "Missing cart ID or user ID" }, { status: 400 });

  const { data: userData, error: userError } = await supabaseServer
    .from("users")
    .select("role")
    .eq("id", user_id)
    .single();

  if (userError) return NextResponse.json({ error: userError.message }, { status: 400 });

  let queryBuilder = supabaseServer.from("cart").update(updates).eq("id", id);

  if (userData?.role !== "admin") {
    queryBuilder = queryBuilder.eq("user_id", user_id);
  }

  const { data, error } = await queryBuilder.select("*");

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data?.length) return NextResponse.json({ error: "No cart found or unauthorized" }, { status: 404 });

  return NextResponse.json(data[0], { status: 200 });
}
