import { supabaseServer } from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, theme, release_date, description, user_id } = body;

    if (!user_id)
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });

    const { data: userData, error: userError } = await supabaseServer
      .from("users")
      .select("role")
      .eq("id", user_id)
      .single();

    if (userError)
      return NextResponse.json({ error: userError.message }, { status: 400 });

    if (userData?.role !== "admin")
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const { data, error } = await supabaseServer
      .from("design_categories")
      .insert([{ name, theme, release_date, description }])
      .select("*");

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data[0], { status: 201 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
