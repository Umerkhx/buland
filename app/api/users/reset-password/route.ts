import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseServer } from '@/app/lib/supabaseClient'

export async function POST(req: Request) {
  const { email } = await req.json()
  const reset_code = Math.random().toString(36).slice(2, 8)

  const { error } = await supabaseServer
    .from('users')
    .update({ reset_code })
    .eq('email', email)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ message: 'Reset code generated', reset_code })
}

export async function PATCH(req: Request) {
  const { email, reset_code, newPassword } = await req.json()
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  const { data, error } = await supabaseServer
    .from('users')
    .update({ password: hashedPassword, reset_code: null })
    .eq('email', email)
    .eq('reset_code', reset_code)
    .select('*')
    .single()

  if (error || !data)
    return NextResponse.json({ error: 'Invalid code or email' }, { status: 400 })

  return NextResponse.json({ message: 'Password reset successfully', user: data })
}
