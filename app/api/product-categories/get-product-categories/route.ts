import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabaseServer.from("product_categories").select("*");

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 200 });
}
