import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseServer } from '@/app/lib/supabaseClient'

export async function PATCH(req: Request) {
  const { email, password, newFullName } = await req.json()

  const { data: user, error } = await supabaseServer
    .from('users')
    .select('password')
    .eq('email', email)
    .single()

  if (error || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const { data: updated, error: updateError } = await supabaseServer
    .from('users')
    .update({ full_name: newFullName })
    .eq('email', email)
    .select('*')
    .single()

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 })
  return NextResponse.json({ message: 'Full name updated', user: updated })
}
