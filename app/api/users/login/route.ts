import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseClient";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    const { data: user, error } = await supabaseServer
      .from("users")
      .select("id, email, password, role")
      .eq("email", email)
      .single();
    
    if (error || !user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("user_session", JSON.stringify({ 
      id: user.id, 
      role: user.role 
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    });
    
    return NextResponse.json({
      message: "Login successful",
      user: { id: user.id, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}