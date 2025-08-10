import { createClient } from '@supabase/supabase-js';

// Make sure environment variables exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Load all habits
async function loadHabits() {
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
async function saveHabit(habit: { name: string }) {
  const { data, error } = await supabase
    .from('habits')
    .insert([habit]);

  if (error) {
    console.error('Error saving habit:', error);
    return null;
  }

  return data;
}

// Increment a habit's streak
async function incrementStreak(habitId: string) {
  const { data: habit, error: fetchError } = await supabase
    .from('habits')
    .select('streak')
    .eq('id', habitId)
    .single();

  if (fetchError) {
    console.error('Error fetching habit:', fetchError);
    return null;
  }

  const { data, error } = await supabase
    .from('habits')
    .update({ streak: habit.streak + 1 })
    .eq('id', habitId)
    .select();

  if (error) {
    console.error('Error incrementing streak:', error);
    return null;
  }

  return data;
}

// Explicit exports to avoid missing export errors
export {
  loadHabits,
  saveHabit,
  incrementStreak
};
