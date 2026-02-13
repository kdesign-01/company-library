import { supabase } from "./supabase";

// Get all books
export async function getAllBooks() {
  const { data, error } = await supabase
    .from("books")
    .select(
      `
      *,
      borrower:persons(id, name, email, department)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Transform data to match our component structure
  return data.map((book) => ({
    ...book,
    borrowedBy: book.borrowed_by,
    borrowedDate: book.borrowed_date,
    coverUrl: book.cover_url,
    publicationYear: book.publication_year,
    borrower: book.borrower,
  }));
}

// Add a new book
export async function addBook(bookData) {
  const { data, error } = await supabase
    .from("books")
    .insert([
      {
        title: bookData.title,
        summary: bookData.summary,
        cover_url: bookData.coverUrl,
        publication_year: bookData.publicationYear,
        language: bookData.language,
        isbn: bookData.isbn,
        owner: bookData.owner,
        status: "Available",
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    borrowedBy: data.borrowed_by,
    borrowedDate: data.borrowed_date,
    coverUrl: data.cover_url,
    publicationYear: data.publication_year,
  };
}

// Update a book
export async function updateBook(bookId, updates) {
  const dbUpdates = {
    title: updates.title,
    summary: updates.summary,
    cover_url: updates.coverUrl,
    publication_year: updates.publicationYear,
    language: updates.language,
    isbn: updates.isbn,
    owner: updates.owner,
  };

  const { data, error } = await supabase
    .from("books")
    .update(dbUpdates)
    .eq("id", bookId)
    .select(
      `
      *,
      borrower:persons(id, name, email, department)
    `,
    )
    .single();

  if (error) throw error;

  return {
    ...data,
    borrowedBy: data.borrowed_by,
    borrowedDate: data.borrowed_date,
    coverUrl: data.cover_url,
    publicationYear: data.publication_year,
    borrower: data.borrower,
  };
}

// Delete a book
export async function deleteBook(bookId) {
  const { error } = await supabase.from("books").delete().eq("id", bookId);

  if (error) throw error;
}

// Borrow a book
export async function borrowBook(bookId, personId, borrowedDate) {
  // Start a transaction-like operation
  const { data: book, error: fetchError } = await supabase
    .from("books")
    .select("*")
    .eq("id", bookId)
    .single();

  if (fetchError) throw fetchError;

  if (book.status === "Borrowed") {
    throw new Error("Book is already borrowed");
  }

  // Update book status
  const { data, error: updateError } = await supabase
    .from("books")
    .update({
      status: "Borrowed",
      borrowed_date: borrowedDate,
      borrowed_by: personId,
    })
    .eq("id", bookId)
    .select(
      `
      *,
      borrower:persons(id, name, email, department)
    `,
    )
    .single();

  if (updateError) throw updateError;

  // Create borrowing history record
  await supabase.from("borrowing_history").insert([
    {
      book_id: bookId,
      person_id: personId,
      borrowed_date: borrowedDate,
    },
  ]);

  return {
    ...data,
    borrowedBy: data.borrowed_by,
    borrowedDate: data.borrowed_date,
    coverUrl: data.cover_url,
    publicationYear: data.publication_year,
    borrower: data.borrower,
  };
}

// Return a book
export async function returnBook(bookId) {
  // Update borrowing history
  const { error: historyError } = await supabase
    .from("borrowing_history")
    .update({ returned_date: new Date().toISOString().split("T")[0] })
    .eq("book_id", bookId)
    .is("returned_date", null);

  if (historyError) throw historyError;

  // Update book status
  const { data, error } = await supabase
    .from("books")
    .update({
      status: "Available",
      borrowed_date: null,
      borrowed_by: null,
    })
    .eq("id", bookId)
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    borrowedBy: data.borrowed_by,
    borrowedDate: data.borrowed_date,
    coverUrl: data.cover_url,
    publicationYear: data.publication_year,
  };
}
