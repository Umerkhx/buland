import { NextResponse } from 'next/server'
import { supabaseServer } from '@/app/lib/supabaseClient'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const { data: user, error } = await supabaseServer
    .from('users')
    .select('id, email, password, full_name, role')
    .eq('email', email)
    .single()

  if (error || !user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

  return NextResponse.json({
    message: `Logged in as ${user.role}`,
    user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
  })
}
