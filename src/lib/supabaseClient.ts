import { createClient } from "@supabase/supabase-js";

// Make sure environment variables exist
const supabaseUrl = "process.env.https://ctdjrxqtajyovwugfkst.supabase.co",
const supabaseAnonKey = "process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGpyeHF0YWp5b3Z3dWdma3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDgwMTEsImV4cCI6MjA3MDE4NDAxMX0.qkEGWf9huL_XFs-H0Xg8d877NS4BmyXim9gtFFVo5ek;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Missing Supabase environment variables. " +
      "Check your .env.local (dev) or your Vercel environment variables (prod)."
  );
}

// Create client with fallbacks to prevent runtime crash
export const supabase = createClient(
  supabaseUrl || "https://ctdjrxqtajyovwugfkst.supabase.co",
  supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGpyeHF0YWp5b3Z3dWdma3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDgwMTEsImV4cCI6MjA3MDE4NDAxMX0.qkEGWf9huL_XFs-H0Xg8d877NS4BmyXim9gtFFVo5ek"
);

// Load all habits
async function loadHabits() {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading habits:", error);
    return [];
  }

  return data || [];
}

// Save a new habit
async function saveHabit(habit: { name: string }) {
  const { data, error } = await supabase.from("habits").insert([habit]);

  if (error) {
    console.error("Error saving habit:", error);
    return null;
  }

  return data;
}

// Increment a habit's streak
async function incrementStreak(habitId: string) {
  const { data: habit, error: fetchError } = await supabase
    .from("habits")
    .select("streak")
    .eq("id", habitId)
    .single();

  if (fetchError) {
    console.error("Error fetching habit:", fetchError);
    return null;
  }

  const { data, error } = await supabase
    .from("habits")
    .update({ streak: habit.streak + 1 })
    .eq("id", habitId)
    .select();

  if (error) {
    console.error("Error incrementing streak:", error);
    return null;
  }

  return data;
}

// Explicit exports to avoid missing export errors
export { loadHabits, saveHabit, incrementStreak };
