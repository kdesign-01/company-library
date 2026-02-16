import { supabase } from "./supabase";

// API Ninjas Quotes API
const API_NINJAS_URL =
  "https://api.api-ninjas.com/v2/randomquotes?categories=philosophy,leadership";
const API_NINJAS_KEY = import.meta.env.VITE_API_NINJAS_KEY;

if (!API_NINJAS_KEY) {
  console.warn('API Ninjas key not found. Daily quote feature will not work.');
}

/**
 * Fetch a random quote from API Ninjas Quotes API
 * @returns {Promise<Object>} Quote object with quote, book, and author properties
 * @throws {Error} If API request fails or returns non-OK status
 */
export async function fetchRandomQuote() {
  console.log("Fetching from API Ninjas...");

  const response = await fetch(API_NINJAS_URL, {
    headers: {
      "X-Api-Key": API_NINJAS_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`API Ninjas error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("✅ Successfully fetched from API Ninjas!", data);

  // API Ninjas returns an array with quote objects
  const quoteData = data[0];

  return {
    quote: quoteData.quote,
    book: quoteData.work,
    author: quoteData.author,
  };
}

/**
 * Get today's quote from the database
 * @returns {Promise<Object|null>} Quote object if found, null if no quote for today
 * @throws {Error} If database query fails
 */
export async function getTodayQuote() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_quotes")
    .select("*")
    .eq("date", today)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * Save a new daily quote to the database
 * @param {Object} quoteData - Quote data to save
 * @param {string} quoteData.quote - The quote text
 * @param {string} quoteData.book - The book title
 * @param {string} quoteData.author - The author name
 * @returns {Promise<Object>} Saved quote object with id and date
 * @throws {Error} If database insert fails
 */
export async function saveDailyQuote(quoteData) {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_quotes")
    .insert([
      {
        quote: quoteData.quote,
        book: quoteData.book,
        author: quoteData.author,
        date: today,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Delete all quotes except today's quote (cleanup operation)
 * @returns {Promise<void>}
 * @note Errors are logged but not thrown to avoid breaking the app
 */
export async function deleteOldQuotes() {
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("daily_quotes")
    .delete()
    .neq("date", today);

  if (error) {
    console.error("Error deleting old quotes:", error);
  }
}

/**
 * Get or fetch the daily quote (main entry point)
 * Checks database first, fetches from API if not cached, then saves to database
 * @returns {Promise<Object>} Quote object with quote, book, author, date, and id
 * @throws {Error} If both database and API fail
 */
export async function getDailyQuote() {
  try {
    // Check if we already have today's quote
    const existingQuote = await getTodayQuote();

    if (existingQuote) {
      console.log("Using cached quote from database");
      return existingQuote;
    }

    // Fetch new quote from API Ninjas
    const newQuote = await fetchRandomQuote();

    // Save to database
    const savedQuote = await saveDailyQuote(newQuote);

    // Clean up old quotes
    deleteOldQuotes();

    return savedQuote;
  } catch (error) {
    console.error("Error getting daily quote:", error);
    throw error;
  }
}
