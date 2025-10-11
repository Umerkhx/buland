import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseClient";

export async function POST(req: Request) {
  const user_id = req.headers.get("x-user-id");

  if (!user_id)
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

  const { data: user, error: userError } = await supabaseServer
    .from("users")
    .select("role")
    .eq("id", user_id)
    .single();

  if (userError || !user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.role !== "admin")
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { error } = await supabaseServer.from("notifications").delete().neq("id", 0);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
