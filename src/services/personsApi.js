import { supabase } from "./supabase";

// Get all persons
export async function getAllPersons() {
  const { data, error } = await supabase
    .from("persons")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

// Add a new person
export async function addPerson(personData) {
  const { data, error } = await supabase
    .from("persons")
    .insert([personData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update a person
export async function updatePerson(personId, updates) {
  const { data, error } = await supabase
    .from("persons")
    .update(updates)
    .eq("id", personId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a person
export async function deletePerson(personId) {
  // Check if person has borrowed books
  const { data: borrowedBooks } = await supabase
    .from("books")
    .select("id")
    .eq("borrowed_by", personId)
    .eq("status", "Borrowed");

  if (borrowedBooks && borrowedBooks.length > 0) {
    throw new Error("Cannot delete person with borrowed books");
  }

  const { error } = await supabase.from("persons").delete().eq("id", personId);

  if (error) throw error;
}
