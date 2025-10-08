import { NextResponse } from 'next/server'
import { supabaseServer } from '@/app/lib/supabaseClient'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { email, password, full_name } = await req.json()

  const hashedPassword = await bcrypt.hash(password, 10)

  const { data, error } = await supabaseServer
    .from('users')
    .insert([{ email, password: hashedPassword, full_name, role: 'user' }])
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ message: 'User created successfully', user: data })
}
