/**
 * ISBN API Service
 * Uses Open Library API to fetch book metadata
 * Falls back to Google Books API if Open Library fails
 */

// Environment-aware logging (only logs in development)
const isDev = import.meta.env.DEV;
const log = isDev ? console.log : () => {};
const warn = isDev ? console.warn : () => {};

// Open Library API - Two-step process to get description
async function fetchFromOpenLibrary(isbn) {
  // Step 1: Get basic book info
  const booksResponse = await fetch(
    `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
  );

  if (!booksResponse.ok) {
    throw new Error("Open Library API request failed");
  }

  const booksData = await booksResponse.json();
  const bookData = booksData[`ISBN:${isbn}`];

  if (!bookData) {
    return null;
  }

  log("📚 Open Library Book Data:", bookData);

  // Step 2: Get description from Works API if available
  let description = "";
  let sourceUrl = "";

  if (bookData.works && bookData.works.length > 0) {
    try {
      const workKey = bookData.works[0].key; // e.g., "/works/OL45804W"
      sourceUrl = `https://openlibrary.org${workKey}`; // Build source URL
      log("📖 Fetching work description from:", workKey);

      const workResponse = await fetch(
        `https://openlibrary.org${workKey}.json`,
      );

      if (workResponse.ok) {
        const workData = await workResponse.json();
        log("📝 Work Data description field:", workData.description);

        // Description can be a string or an object with 'value'
        if (typeof workData.description === "string") {
          description = workData.description.trim();
        } else if (workData.description && workData.description.value) {
          description = workData.description.value.trim();
        }

        if (description) {
          log(
            "✅ Description found:",
            description.substring(0, 100) + (description.length > 100 ? "..." : ""),
          );
        } else {
          log("⚠️ Works API returned no description");
        }
      } else {
        warn("⚠️ Works API request failed with status:", workResponse.status);
      }
    } catch (error) {
      warn("❌ Failed to fetch work description:", error);
    }
  } else {
    log("ℹ️ No works data available for this book");
  }

  // Step 3: Fallback to excerpts or notes if description is still empty
  if (!description) {
    log("🔍 Trying fallback sources for description...");

    // Try excerpts first
    if (bookData.excerpts && bookData.excerpts.length > 0) {
      description = bookData.excerpts[0].text?.trim() || "";
      if (description) {
        log("✅ Found description in excerpts");
      }
    }

    // Try notes as last resort
    if (!description && bookData.notes) {
      description = (typeof bookData.notes === "string"
        ? bookData.notes
        : bookData.notes.value || ""
      ).trim();
      if (description) {
        log("✅ Found description in notes");
      }
    }

    if (!description) {
      log("❌ No description found from any source");
    }
  }

  // Step 4: Fallback source URL if no works data
  if (!sourceUrl && bookData.key) {
    sourceUrl = `https://openlibrary.org${bookData.key}`;
  } else if (!sourceUrl) {
    // Last resort: use ISBN link
    sourceUrl = `https://openlibrary.org/isbn/${isbn}`;
  }

  // Extract year from publish_date
  const extractYear = (dateString) => {
    if (!dateString) return null;
    const match = dateString.match(/\d{4}/);
    return match ? parseInt(match[0], 10) : null;
  };

  return {
    title: bookData.title || "",
    summary: description || "",
    sourceUrl: sourceUrl || "",
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
  const volumeId = data.items[0].id;

  // Build Google Books source URL
  const sourceUrl = data.items[0].selfLink
    ? data.items[0].selfLink.replace('www.googleapis.com/books/v1/volumes', 'books.google.com/books?id')
    : `https://books.google.com/books?id=${volumeId}`;

  // Extract year from publishedDate
  const extractYear = (dateString) => {
    if (!dateString) return null;
    const match = dateString.match(/\d{4}/);
    return match ? parseInt(match[0], 10) : null;
  };

  return {
    title: book.title || "",
    summary: book.description || "",
    sourceUrl: sourceUrl || "",
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
    warn("Open Library failed, trying Google Books:", error.message);
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
    warn("Google Books failed:", error.message);
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
