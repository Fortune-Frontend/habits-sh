import { createClient } from '@supabase/supabase-js'

// These values will come from your Vercel environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)



export async function getOrCreateUser() {
  let userId = localStorage.getItem('user_id')

  if (!userId) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ sync_code: crypto.randomUUID() }]) // generates a unique sync code
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return null
    }

    userId = data.id
    localStorage.setItem('user_id', userId)
    localStorage.setItem('sync_code', data.sync_code)
  }

  return userId
}
