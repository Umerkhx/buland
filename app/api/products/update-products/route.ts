import { supabaseServer } from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const formData = await req.formData();

  const id = parseInt(formData.get("id") as string);
  const updates: any = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: parseFloat(formData.get("price") as string),
    size: formData.get("size"),
  };

  const image = formData.get("image") as File | null;
  if (image) {
    const fileName = `${Date.now()}-${image.name}`;
    const { error: uploadError } = await supabaseServer.storage
      .from("product-images")
      .upload(fileName, image, { cacheControl: "3600", upsert: false });
    if (uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 400 });

    const { data: publicUrl } = supabaseServer.storage
      .from("product-images")
      .getPublicUrl(fileName);
    updates.image_url = publicUrl.publicUrl;
  }

  const { data, error } = await supabaseServer
    .from("products")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data[0]);
}
