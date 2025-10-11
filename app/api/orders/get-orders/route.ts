import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseClient";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");
    if (!userId) return NextResponse.json({ error: "user_id required" }, { status: 400 });

    const { data: userData, error: userError } = await supabaseServer
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (userError || !userData) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let query = supabaseServer.from("orders").select("*");

    if (userData.role !== "admin") {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ orders: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
