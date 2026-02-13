/**
 * ISBN API Service
 * Uses Open Library API to fetch book metadata
 * Falls back to Google Books API if Open Library fails
 */

// Open Library API
async function fetchFromOpenLibrary(isbn) {
  const response = await fetch(
    `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
  );

  if (!response.ok) {
    throw new Error("Open Library API request failed");
  }

  const data = await response.json();
  const bookData = data[`ISBN:${isbn}`];

  if (!bookData) {
    return null;
  }

  // Extract year from publish_date
  const extractYear = (dateString) => {
    if (!dateString) return null;
    const match = dateString.match(/\d{4}/);
    return match ? parseInt(match[0], 10) : null;
  };

  return {
    title: bookData.title || "",
    summary: bookData.notes || bookData.excerpts?.[0]?.text || "",
    coverUrl:
      bookData.cover?.large ||
      bookData.cover?.medium ||
      bookData.cover?.small ||
      "",
    publicationYear: extractYear(bookData.publish_date),
    language:
      bookData.languages?.[0]?.key?.split("/").pop()?.toUpperCase() ||
      "English",
    authors: bookData.authors?.map((a) => a.name).join(", ") || "",
    publisher: bookData.publishers?.[0]?.name || "",
  };
}

// Google Books API (fallback)
async function fetchFromGoogleBooks(isbn) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`,
  );

  if (!response.ok) {
    throw new Error("Google Books API request failed");
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    return null;
  }

  const book = data.items[0].volumeInfo;

  // Extract year from publishedDate
  const extractYear = (dateString) => {
    if (!dateString) return null;
    const match = dateString.match(/\d{4}/);
    return match ? parseInt(match[0], 10) : null;
  };

  return {
    title: book.title || "",
    summary: book.description || "",
    coverUrl:
      book.imageLinks?.large ||
      book.imageLinks?.medium ||
      book.imageLinks?.thumbnail ||
      book.imageLinks?.smallThumbnail ||
      "",
    publicationYear: extractYear(book.publishedDate),
    language: book.language?.toUpperCase() || "English",
    authors: book.authors?.join(", ") || "",
    publisher: book.publisher || "",
  };
}

/**
 * Fetch book metadata by ISBN
 * Tries Open Library first, then Google Books as fallback
 */
export async function fetchBookByISBN(isbn) {
  // Clean ISBN (remove hyphens and spaces)
  const cleanedISBN = isbn.replace(/[-\s]/g, "");

  // Validate ISBN format
  if (!/^(97[89])?\d{9}[\dX]$/i.test(cleanedISBN)) {
    throw new Error(
      "Invalid ISBN format. Please enter a valid 10 or 13 digit ISBN.",
    );
  }

  try {
    // Try Open Library first
    const openLibraryData = await fetchFromOpenLibrary(cleanedISBN);
    if (openLibraryData) {
      return {
        found: true,
        source: "Open Library",
        data: openLibraryData,
      };
    }
  } catch (error) {
    console.warn("Open Library failed, trying Google Books:", error.message);
  }

  try {
    // Fallback to Google Books
    const googleBooksData = await fetchFromGoogleBooks(cleanedISBN);
    if (googleBooksData) {
      return {
        found: true,
        source: "Google Books",
        data: googleBooksData,
      };
    }
  } catch (error) {
    console.warn("Google Books failed:", error.message);
  }

  // No data found from any source
  return {
    found: false,
    source: null,
    data: null,
  };
}

/**
 * Validate ISBN format
 */
export function isValidISBN(isbn) {
  const cleaned = isbn.replace(/[-\s]/g, "");
  return /^(97[89])?\d{9}[\dX]$/i.test(cleaned);
}
