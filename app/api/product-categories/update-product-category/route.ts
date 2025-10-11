import { supabaseServer } from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, description, user_id } = body;

    // Validate
    if (!id) return NextResponse.json({ error: "Missing category ID" }, { status: 400 });
    if (!user_id) return NextResponse.json({ error: "Missing user_id" }, { status: 400 });

    const { data: userData, error: userError } = await supabaseServer
      .from("users")
      .select("role")
      .eq("id", user_id)
      .single();

    if (userError) return NextResponse.json({ error: userError.message }, { status: 400 });
    if (userData?.role !== "admin")
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const { data, error } = await supabaseServer
      .from("product_categories")
      .update({ name, description })
      .eq("id", id)
      .select("*");

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data?.length) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    return NextResponse.json(data[0], { status: 200 });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
