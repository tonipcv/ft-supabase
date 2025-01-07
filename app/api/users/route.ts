import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

// Criar cliente Supabase com variáveis de ambiente do servidor
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email } = body

    const randomPhone = Math.floor(Math.random() * 900000000 + 100000000).toString()
    const timestamp = Date.now()
    const uuid = uuidv4().split('-')[0]
    const externalId = `SEC_${timestamp}_${uuid}`

    // Criar novo usuário
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      email_confirm: true,
      password: uuidv4(),
      user_metadata: {
        name: name
      }
    })

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    // Criar perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: newUser.user.id,
          name: name,
          email: email,
          is_premium: true,
          expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          phone_number: randomPhone,
          phone_local_code: '11',
          external_id: externalId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json({ data: profile })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 