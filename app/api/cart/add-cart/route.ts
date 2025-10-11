import { supabaseServer } from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      user_id,
      product_id,
      product_category_id,
      design_category_id,
      ...cartItem
    } = body;

    if (!user_id || !product_id || !product_category_id || !design_category_id) {
      return NextResponse.json(
        { error: "Missing required fields (user_id, product_id, product_category_id, design_category_id)" },
        { status: 400 }
      );
    }

    const { data: userData, error: userError } = await supabaseServer
      .from("users")
      .select("id")
      .eq("id", user_id)
      .single();

    if (userError || !userData)
      return NextResponse.json({ error: "User not found" }, { status: 400 });

    const { data: productData, error: productError } = await supabaseServer
      .from("products")
      .select("id")
      .eq("id", product_id)
      .single();

    if (productError || !productData)
      return NextResponse.json({ error: "Product not found" }, { status: 400 });

    const { data: productCatData, error: productCatError } = await supabaseServer
      .from("product_categories")
      .select("id")
      .eq("id", product_category_id)
      .single();

    if (productCatError || !productCatData)
      return NextResponse.json(
        { error: "Product category not found" },
        { status: 400 }
      );

    const { data: designCatData, error: designCatError } = await supabaseServer
      .from("design_categories")
      .select("id")
      .eq("id", design_category_id)
      .single();

    if (designCatError || !designCatData)
      return NextResponse.json(
        { error: "Design category not found" },
        { status: 400 }
      );

    const { data, error } = await supabaseServer
      .from("cart")
      .insert([
        {
          user_id,
          product_id,
          product_category_id,
          design_category_id,
          ...cartItem,
        },
      ])
      .select("*");

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
