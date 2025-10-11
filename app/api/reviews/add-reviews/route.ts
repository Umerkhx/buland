import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { user_id, product_id, rating, review_text } = await req.json();

    if (!user_id || !product_id || !rating) {
      return NextResponse.json(
        { error: "user_id, product_id, and rating are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("reviews")
      .insert([{ user_id, product_id, rating, review_text }])
      .select();

    if (error) throw error;

    return NextResponse.json({ message: "Review added", data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
