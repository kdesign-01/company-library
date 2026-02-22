/**
 * Application Constants
 * Centralized configuration values used throughout the application
 */

// Colors
export const PRIMARY_COLOR = '#3355FF';

// UI Timing
export const TOAST_DURATION = 3000; // milliseconds
export const DEBOUNCE_DELAY = 300; // milliseconds

// API Endpoints
export const API_ENDPOINTS = {
  OPEN_LIBRARY: 'https://openlibrary.org/api/books',
  GOOGLE_BOOKS: 'https://www.googleapis.com/books/v1/volumes',
};

// Book Status
export const BOOK_STATUS = {
  AVAILABLE: 'Available',
  BORROWED: 'Borrowed',
};

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
};

// Button Variants
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DANGER: 'danger',
  GHOST: 'ghost',
};

// Button Sizes
export const BUTTON_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
};

// Modal Sizes
export const MODAL_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
};
