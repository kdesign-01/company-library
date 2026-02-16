import { supabase } from "./supabase";

/**
 * Fetch all persons from the database
 * @returns {Promise<Array<Object>>} Array of person objects sorted by name
 * @throws {Error} If database query fails
 */
export async function getAllPersons() {
  const { data, error } = await supabase
    .from("persons")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Add a new person to the database
 * @param {Object} personData - Person data to insert
 * @param {string} personData.name - Person's full name
 * @param {string} personData.email - Person's email address
 * @param {string} personData.department - Person's department
 * @returns {Promise<Object>} Newly created person object with id
 * @throws {Error} If database insert fails
 */
export async function addPerson(personData) {
  const { data, error } = await supabase
    .from("persons")
    .insert([personData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing person in the database
 * @param {number|string} personId - ID of the person to update
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated person object
 * @throws {Error} If database update fails
 */
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

/**
 * Delete a person from the database
 * @param {number|string} personId - ID of the person to delete
 * @returns {Promise<void>}
 * @throws {Error} If person has borrowed books or database delete fails
 */
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
