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

    const images = formData.getAll("images") as File[];

    if (!name || !description || !price || images.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const imageUrls: string[] = [];

    for (const image of images) {
      if (!(image instanceof File)) {
        console.error("Invalid image in form data:", image);
        continue;
      }

      const fileName = `${Date.now()}-${image.name}`;
      console.log("Uploading:", fileName);

      const { error: uploadError } = await supabaseServer.storage
        .from("product-images")
        .upload(fileName, image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        return NextResponse.json({ error: uploadError.message }, { status: 400 });
      }

      const {
        data: { publicUrl },
      } = supabaseServer.storage.from("product-images").getPublicUrl(fileName);

      imageUrls.push(publicUrl);
    }

    console.log("All uploaded URLs:", imageUrls);

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
          image_url: imageUrls,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Database insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Product uploaded successfully",
      product: data,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
