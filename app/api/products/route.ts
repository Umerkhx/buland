import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabaseServer.from("products").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category_id = parseInt(formData.get("category_id") as string);
    const design_category_id = parseInt(formData.get("design_category_id") as string);
    const size = formData.get("size") as string;
    const image = formData.get("image") as File | null;

    if (!name || !description || !price || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const fileName = `${Date.now()}-${image.name}`;
    const { error: uploadError } = await supabaseServer.storage
      .from("product-images")
      .upload(fileName, image, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    const {
      data: { publicUrl },
    } = supabaseServer.storage.from("product-images").getPublicUrl(fileName);

    const { data, error } = await supabaseServer
      .from("products")
      .insert([
        {
          name,
          description,
          price,
          category_id,
          design_category_id,
          size,
          image_url: publicUrl,
        },
      ])
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Product uploaded successfully",
      product: data,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
