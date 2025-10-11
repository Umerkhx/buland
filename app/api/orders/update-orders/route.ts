import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseClient";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { order_id, user_id, updates } = body;

    if (!order_id || !user_id) return NextResponse.json({ error: "order_id and user_id required" }, { status: 400 });

    const { data: userData, error: userError } = await supabaseServer
      .from("users")
      .select("role")
      .eq("id", user_id)
      .single();

    if (userError || !userData) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (userData.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { data, error } = await supabaseServer
      .from("orders")
      .update(updates)
      .eq("id", order_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ updated_order: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
