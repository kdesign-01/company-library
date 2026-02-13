// Mock ISBN Database
export const ISBN_DATABASE = {
  9780596517748: {
    title: "JavaScript: The Good Parts",
    summary:
      "Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad, having been developed and released in a hurry before it could be refined.",
    coverUrl:
      "https://images-na.ssl-images-amazon.com/images/I/5131OWtQRaL._SX381_BO1,204,203,200_.jpg",
    publicationYear: 2008,
    language: "English",
  },
  9780132350884: {
    title: "Clean Code",
    summary:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
    coverUrl:
      "https://images-na.ssl-images-amazon.com/images/I/51E2055ZGUL._SX387_BO1,204,203,200_.jpg",
    publicationYear: 2008,
    language: "English",
  },
  9780201633610: {
    title: "Design Patterns",
    summary:
      "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.",
    coverUrl:
      "https://images-na.ssl-images-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg",
    publicationYear: 1994,
    language: "English",
  },
};

// Initial Books
export const INITIAL_BOOKS = [
  {
    id: 1,
    title: "JavaScript: The Good Parts",
    summary: "Most programming languages contain good and bad parts...",
    coverUrl:
      "https://images-na.ssl-images-amazon.com/images/I/5131OWtQRaL._SX381_BO1,204,203,200_.jpg",
    publicationYear: 2008,
    language: "English",
    isbn: "9780596517748",
    owner: "Company Library",
    status: "Available",
    borrowedDate: null,
    borrowedBy: null,
  },
  {
    id: 2,
    title: "Clean Code",
    summary: "Even bad code can function...",
    coverUrl:
      "https://images-na.ssl-images-amazon.com/images/I/51E2055ZGUL._SX387_BO1,204,203,200_.jpg",
    publicationYear: 2008,
    language: "English",
    isbn: "9780132350884",
    owner: "Engineering Dept",
    status: "Borrowed",
    borrowedDate: "2025-01-20",
    borrowedBy: 1,
  },
];

// Initial Persons
export const INITIAL_PERSONS = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@company.com",
    department: "Engineering",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@company.com",
    department: "Design",
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol.davis@company.com",
    department: "Marketing",
  },
];
