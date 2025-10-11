import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, ...orderData } = body;

    if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });

    const { data: userData, error: userError } = await supabaseServer
      .from("users")
      .select("id")
      .eq("id", user_id)
      .single();

    if (userError || !userData) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { data, error } = await supabaseServer
      .from("orders")
      .insert([{ user_id, ...orderData }])
      .select("*"); 

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ order: data?.[0] }); 
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
