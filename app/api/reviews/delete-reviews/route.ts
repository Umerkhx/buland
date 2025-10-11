import { supabaseServer } from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { review_id } = await req.json();

    if (!review_id) {
      return NextResponse.json({ error: "review_id is required" }, { status: 400 });
    }

    const { error } = await supabaseServer
      .from("reviews")
      .delete()
      .eq("id", review_id);

    if (error) throw error;

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
