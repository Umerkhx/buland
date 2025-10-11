import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseClient";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");
    const userId = searchParams.get("user_id");

    if (!orderId || !userId) return NextResponse.json({ error: "order_id and user_id required" }, { status: 400 });

    const { data: userData, error: userError } = await supabaseServer
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (userError || !userData) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (userData.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { data, error } = await supabaseServer
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ deleted_order: "order deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
