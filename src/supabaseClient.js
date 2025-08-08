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


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getOrCreateUser() {
  let userId = localStorage.getItem('user_id')
  if (!userId) {
    userId = crypto.randomUUID()
    localStorage.setItem('user_id', userId)
  }
  return userId
}

export async function loadHabits() {
  const userId = await getOrCreateUser()
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
  if (error) {
    console.error('Error loading habits:', error)
    return []
  }
  return data
}

export async function saveHabit(habitName) {
  const userId = await getOrCreateUser()
  const { data, error } = await supabase
    .from('habits')
    .insert([{ user_id: userId, habit_name: habitName, streak: 0 }])
  if (error) {
    console.error('Error saving habit:', error)
  } else {
    console.log('Habit saved:', data)
  }
}

export async function incrementStreak(habitId) {
  const { data, error } = await supabase
    .from('habits')
    .update({ streak: supabase.sql`streak + 1` })
    .eq('id', habitId)
  if (error) {
    console.error('Error updating streak:', error)
  } else {
    console.log('Streak updated:', data)
  }
}
