import { supabaseServer } from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { id, user_id } = await req.json();

  if (!id || !user_id)
    return NextResponse.json({ error: "Missing cart ID or user ID" }, { status: 400 });

  const { data: userData, error: userError } = await supabaseServer
    .from("users")
    .select("role")
    .eq("id", user_id)
    .single();

  if (userError) return NextResponse.json({ error: userError.message }, { status: 400 });

  let query = supabaseServer.from("cart").delete().eq("id", id);

  if (userData?.role !== "admin") {
    query = query.eq("user_id", user_id);
  }

  const { error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: "Cart deleted successfully" }, { status: 200 });
}
