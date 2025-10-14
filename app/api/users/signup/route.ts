import { NextResponse } from 'next/server';
import { supabaseServer } from '@/app/lib/supabaseClient';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const {
    email,
    password,
    full_name,
    phone_number,
    alt_phone_number,
    address,
    city,
  } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabaseServer
    .from('users')
    .insert([
      {
        email,
        password: hashedPassword,
        full_name,
        role: 'user',
        phone_number,
        alt_phone_number,
        address,
        city,
      }
    ])
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const cookieStore = await cookies();
  cookieStore.set("user_session", JSON.stringify({ 
    id: data.id, 
    role: data.role 
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, 
    path: "/",
  });

  return NextResponse.json({ message: 'User created successfully', user: data });
}