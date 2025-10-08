import { NextResponse } from 'next/server'
import { supabaseServer } from '@/app/lib/supabaseClient'
import bcrypt from 'bcryptjs'    

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const { data: admin, error } = await supabaseServer
    .from('users')
    .select('password, role')
    .eq('email', email)
    .single()

  if (error || !admin) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const isMatch = await bcrypt.compare(password, admin.password)
  if (!isMatch || admin.role !== 'admin')
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const { data: users, error: getError } = await supabaseServer.from('users').select('*')
  if (getError) return NextResponse.json({ error: getError.message }, { status: 400 })

  return NextResponse.json({ users })
}
