import { supabaseServer } from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id, user_id } = body;

  if (!id || !user_id)
    return NextResponse.json({ error: "Missing category ID or user ID" }, { status: 400 });

  const { data: userData, error: userError } = await supabaseServer
    .from("users")
    .select("role")
    .eq("id", user_id)
    .single();

  if (userError) return NextResponse.json({ error: userError.message }, { status: 400 });
  if (userData?.role !== "admin")
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { error } = await supabaseServer
    .from("design_categories")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
}
