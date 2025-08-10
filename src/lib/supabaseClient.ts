import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Load all habits
export async function loadHabits() {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error loading habits:', error);
    return [];
  }

  return data || [];
}

// Save a new habit
export async function saveHabit(habit: { name: string }) {
  const { data, error } = await supabase
    .from('habits')
    .insert(habit);

  if (error) {
    console.error('Error saving habit:', error);
    return null;
  }

  return data;
}

// Increment a habit's streak
export async function incrementStreak(habitId: string) {
  const { data, error } = await supabase
    .from('habits')
    .update({ streak: supabase.rpc('increment', { x: 1 }) })
    .eq('id', habitId);

  if (error) {
    console.error('Error incrementing streak:', error);
    return null;
  }

  return data;
}
