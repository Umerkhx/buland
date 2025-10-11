import { supabaseServer } from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, user_id } = body;

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

    const { error } = await supabaseServer
      .from("product_categories")
      .delete()
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
