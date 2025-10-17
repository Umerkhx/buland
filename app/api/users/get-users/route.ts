import { NextResponse } from 'next/server';
import { supabaseServer } from '@/app/lib/supabaseClient';

export async function GET(req: Request) {
  const user_id = req.headers.get("x-user-id");

  if (!user_id)
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

  const { data: admin, error: adminError } = await supabaseServer
    .from('users')
    .select('role')
    .eq('id', user_id)
    .single();

  if (adminError || !admin)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (admin.role !== 'admin')
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });

  // Get all users
  const { data: users, error: getError } = await supabaseServer
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (getError)
    return NextResponse.json({ error: getError.message }, { status: 400 });

  return NextResponse.json({ users });
}