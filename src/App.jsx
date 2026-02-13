import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  User,
  Calendar,
  AlertCircle,
  Check,
} from "lucide-react";

// Mock ISBN Database
const ISBN_DATABASE = {
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

// Initial mock data
const INITIAL_BOOKS = [
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

const INITIAL_PERSONS = [
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

// Utility Components
function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  size = "md",
  className = "",
}) {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "text-white hover:opacity-90 active:opacity-80",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const style = variant === "primary" ? { backgroundColor: "#3355FF" } : {};

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

function Badge({ children, variant = "success", className = "" }) {
  const variants = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-orange-100 text-orange-800 border-orange-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const types = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`fixed bottom-4 right-4 ${types[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up z-50`}
    >
      {type === "success" && <Check size={20} />}
      {type === "error" && <AlertCircle size={20} />}
      <span className="font-medium">{message}</span>
    </div>
  );
}

// Main App Component
export default function LibraryManagementSystem() {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [persons, setPersons] = useState(INITIAL_PERSONS);
  const [activeTab, setActiveTab] = useState("books");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isEditPersonModalOpen, setIsEditPersonModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [personToEdit, setPersonToEdit] = useState(null);

  // Book Management Functions
  const addBook = (bookData) => {
    const newBook = {
      ...bookData,
      id: Math.max(...books.map((b) => b.id), 0) + 1,
      status: "Available",
      borrowedDate: null,
      borrowedBy: null,
    };
    setBooks([...books, newBook]);
    setIsAddBookModalOpen(false);
    showToast("Book added successfully!", "success");
  };

  const updateBook = (bookId, updates) => {
    setBooks(
      books.map((book) =>
        book.id === bookId ? { ...book, ...updates } : book,
      ),
    );
    setIsEditBookModalOpen(false);
    showToast("Book updated successfully!", "success");
  };

  const deleteBook = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (book.status === "Borrowed") {
      showToast(
        "Cannot delete a borrowed book. Please return it first.",
        "error",
      );
      return;
    }
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((b) => b.id !== bookId));
      showToast("Book deleted successfully!", "success");
    }
  };

  const borrowBook = (bookId, personId, borrowedDate) => {
    const book = books.find((b) => b.id === bookId);
    if (book.status === "Borrowed") {
      showToast("This book is already borrowed!", "error");
      return;
    }

    setBooks(
      books.map((b) =>
        b.id === bookId
          ? { ...b, status: "Borrowed", borrowedDate, borrowedBy: personId }
          : b,
      ),
    );
    setIsBorrowModalOpen(false);
    setSelectedBook(null);
    showToast("Book borrowed successfully!", "success");
  };

  const returnBook = (bookId) => {
    setBooks(
      books.map((b) =>
        b.id === bookId
          ? { ...b, status: "Available", borrowedDate: null, borrowedBy: null }
          : b,
      ),
    );
    showToast("Book returned successfully!", "success");
  };

  // Person Management Functions
  const addPerson = (personData) => {
    const newPerson = {
      ...personData,
      id: Math.max(...persons.map((p) => p.id), 0) + 1,
    };
    setPersons([...persons, newPerson]);
    setIsAddPersonModalOpen(false);
    showToast("Person added successfully!", "success");
  };

  const updatePerson = (personId, updates) => {
    setPersons(
      persons.map((p) => (p.id === personId ? { ...p, ...updates } : p)),
    );
    setIsEditPersonModalOpen(false);
    showToast("Person updated successfully!", "success");
  };

  const deletePerson = (personId) => {
    const hasBorrowedBooks = books.some(
      (b) => b.borrowedBy === personId && b.status === "Borrowed",
    );
    if (hasBorrowedBooks) {
      showToast("Cannot delete person with borrowed books!", "error");
      return;
    }
    if (window.confirm("Are you sure you want to delete this person?")) {
      setPersons(persons.filter((p) => p.id !== personId));
      showToast("Person deleted successfully!", "success");
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.borrowedBy &&
        persons
          .find((p) => p.id === book.borrowedBy)
          ?.name.toLowerCase()
          .includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                style={{ backgroundColor: "#3355FF" }}
                className="p-2 rounded-lg"
              >
                <BookOpen className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Company Library
                </h1>
                <p className="text-sm text-gray-500">Management System</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === "books" ? "primary" : "ghost"}
                onClick={() => setActiveTab("books")}
              >
                <BookOpen size={18} />
                Books ({books.length})
              </Button>
              <Button
                variant={activeTab === "persons" ? "primary" : "ghost"}
                onClick={() => setActiveTab("persons")}
              >
                <User size={18} />
                Persons ({persons.length})
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "books" ? (
          <BooksView
            books={filteredBooks}
            persons={persons}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onAddBook={() => setIsAddBookModalOpen(true)}
            onEditBook={(book) => {
              setBookToEdit(book);
              setIsEditBookModalOpen(true);
            }}
            onDeleteBook={deleteBook}
            onBorrowBook={(book) => {
              setSelectedBook(book);
              setIsBorrowModalOpen(true);
            }}
            onReturnBook={returnBook}
          />
        ) : (
          <PersonsView
            persons={persons}
            books={books}
            onAddPerson={() => setIsAddPersonModalOpen(true)}
            onEditPerson={(person) => {
              setPersonToEdit(person);
              setIsEditPersonModalOpen(true);
            }}
            onDeletePerson={deletePerson}
          />
        )}
      </main>

      {/* Modals */}
      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        onAdd={addBook}
      />

      <EditBookModal
        isOpen={isEditBookModalOpen}
        onClose={() => {
          setIsEditBookModalOpen(false);
          setBookToEdit(null);
        }}
        book={bookToEdit}
        onUpdate={updateBook}
      />

      <BorrowBookModal
        isOpen={isBorrowModalOpen}
        onClose={() => {
          setIsBorrowModalOpen(false);
          setSelectedBook(null);
        }}
        book={selectedBook}
        persons={persons}
        onBorrow={borrowBook}
      />

      <AddPersonModal
        isOpen={isAddPersonModalOpen}
        onClose={() => setIsAddPersonModalOpen(false)}
        onAdd={addPerson}
      />

      <EditPersonModal
        isOpen={isEditPersonModalOpen}
        onClose={() => {
          setIsEditPersonModalOpen(false);
          setPersonToEdit(null);
        }}
        person={personToEdit}
        onUpdate={updatePerson}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// Books View Component
function BooksView({
  books,
  persons,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onAddBook,
  onEditBook,
  onDeleteBook,
  onBorrowBook,
  onReturnBook,
}) {
  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm p-4 border">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div>
            <Button onClick={onAddBook}>
              <Plus size={18} />
              Add Book
            </Button>
          </div>
          <div className="flex-1 w-full">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by title, ISBN, or borrower..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF] focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Available">Available</option>
              <option value="Borrowed">Borrowed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books Table */}
      {books.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No books found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by adding your first book"}
          </p>
          <Button onClick={onAddBook}>
            <Plus size={18} />
            Add Book
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {books.map((book) => (
                  <BookRow
                    key={book.id}
                    book={book}
                    persons={persons}
                    onEdit={() => onEditBook(book)}
                    onDelete={() => onDeleteBook(book.id)}
                    onBorrow={() => onBorrowBook(book)}
                    onReturn={() => onReturnBook(book.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Book Row Component
function BookRow({ book, persons, onEdit, onDelete, onBorrow, onReturn }) {
  const [imageError, setImageError] = useState(false);
  const borrower = book.borrowedBy
    ? persons.find((p) => p.id === book.borrowedBy)
    : null;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          {book.coverUrl && !imageError ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-12 h-16 object-cover rounded shadow-sm"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-12 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center shadow-sm">
              <BookOpen size={20} className="text-blue-600" />
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-900">{book.title}</div>
            <div className="text-sm text-gray-500">
              ISBN: {book.isbn || "N/A"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <Badge variant={book.status === "Available" ? "success" : "warning"}>
            {book.status}
          </Badge>
          {book.status === "Borrowed" && borrower && (
            <div className="text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User size={12} />
                {borrower.name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                Since {book.borrowedDate}
              </div>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {book.publicationYear || "N/A"}
        </div>
        <div className="text-sm text-gray-500">{book.language || "N/A"}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{book.owner}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 size={16} />
          </Button>
          {book.status === "Available" ? (
            <Button variant="primary" size="sm" onClick={onBorrow}>
              Borrow
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={onReturn}>
              Return
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 size={16} className="text-red-500" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

// Add Book Modal
function AddBookModal({ isOpen, onClose, onAdd }) {
  const [isbn, setIsbn] = useState("");
  const [isbnFetched, setIsbnFetched] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    coverUrl: "",
    publicationYear: "",
    language: "",
    isbn: "",
    owner: "Company Library",
  });

  const fetchISBN = () => {
    const data = ISBN_DATABASE[isbn];
    if (data) {
      setFormData({ ...formData, ...data, isbn });
      setIsbnFetched(true);
    } else {
      alert("ISBN not found in database. Please enter details manually.");
      setFormData({ ...formData, isbn });
      setIsbnFetched(true);
    }
  };

  const handleSubmit = () => {
    if (!formData.title) {
      alert("Title is required");
      return;
    }
    onAdd(formData);
    resetForm();
  };

  const resetForm = () => {
    setIsbn("");
    setIsbnFetched(false);
    setFormData({
      title: "",
      summary: "",
      coverUrl: "",
      publicationYear: "",
      language: "",
      isbn: "",
      owner: "Company Library",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={resetForm} title="Add New Book" size="lg">
      <div className="space-y-6">
        {!isbnFetched ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Fetch Book Data by ISBN
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Enter an ISBN to automatically fetch book information
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter ISBN (e.g., 9780596517748)"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
                <Button onClick={fetchISBN} disabled={!isbn}>
                  Fetch Data
                </Button>
              </div>
              <div className="mt-3 text-xs text-blue-600">
                Try: 9780596517748, 9780132350884, or 9780201633610
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => setIsbnFetched(true)}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Skip and enter manually
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Summary
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.coverUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, coverUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publication Year
                </label>
                <input
                  type="number"
                  value={formData.publicationYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publicationYear: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) =>
                    setFormData({ ...formData, isbn: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner
                </label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) =>
                    setFormData({ ...formData, owner: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Add Book</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Edit Book Modal
function EditBookModal({ isOpen, onClose, book, onUpdate }) {
  const [formData, setFormData] = useState(book || {});

  useEffect(() => {
    if (book) {
      setFormData(book);
    }
  }, [book]);

  const handleSubmit = () => {
    onUpdate(book.id, formData);
  };

  if (!book) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Book" size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Summary
            </label>
            <textarea
              value={formData.summary || ""}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.coverUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, coverUrl: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publication Year
            </label>
            <input
              type="number"
              value={formData.publicationYear || ""}
              onChange={(e) =>
                setFormData({ ...formData, publicationYear: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <input
              type="text"
              value={formData.language || ""}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              type="text"
              value={formData.isbn || ""}
              onChange={(e) =>
                setFormData({ ...formData, isbn: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner
            </label>
            <input
              type="text"
              value={formData.owner || ""}
              onChange={(e) =>
                setFormData({ ...formData, owner: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}

// Borrow Book Modal
function BorrowBookModal({ isOpen, onClose, book, persons, onBorrow }) {
  const [selectedPerson, setSelectedPerson] = useState("");
  const [borrowedDate, setBorrowedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [imageError, setImageError] = useState(false);

  const handleSubmit = () => {
    if (!selectedPerson) {
      alert("Please select a person");
      return;
    }
    onBorrow(book.id, parseInt(selectedPerson), borrowedDate);
    setSelectedPerson("");
    setBorrowedDate(new Date().toISOString().split("T")[0]);
  };

  if (!book) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Borrow Book" size="sm">
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex gap-4">
            {book.coverUrl && !imageError ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-20 h-28 object-cover rounded shadow"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-20 h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center shadow">
                <BookOpen size={24} className="text-blue-600" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{book.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                ISBN: {book.isbn || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Person *
          </label>
          <select
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
          >
            <option value="">Choose a person...</option>
            {persons.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} {person.department && `(${person.department})`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Borrowed Date
          </label>
          <input
            type="date"
            value={borrowedDate}
            onChange={(e) => setBorrowedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Confirm Borrow</Button>
        </div>
      </div>
    </Modal>
  );
}

// Persons View Component
function PersonsView({
  persons,
  books,
  onAddPerson,
  onEditPerson,
  onDeletePerson,
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Persons</h2>
        <Button onClick={onAddPerson}>
          <Plus size={18} />
          Add Person
        </Button>
      </div>

      {persons.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border">
          <User className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No persons found
          </h3>
          <p className="text-gray-500 mb-6">
            Add persons to start tracking book borrowing
          </p>
          <Button onClick={onAddPerson}>
            <Plus size={18} />
            Add Person
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {persons.map((person) => {
            const borrowedBooks = books.filter(
              (b) => b.borrowedBy === person.id && b.status === "Borrowed",
            );
            return (
              <div
                key={person.id}
                className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: "#3355FF", opacity: 0.1 }}
                      className="p-3 rounded-full"
                    >
                      <User style={{ color: "#3355FF" }} size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {person.name}
                      </h3>
                      {person.department && (
                        <p className="text-sm text-gray-500">
                          {person.department}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {person.email && (
                  <p className="text-sm text-gray-600 mb-3">{person.email}</p>
                )}

                <div className="bg-gray-50 rounded p-3 mb-4">
                  <div className="text-sm text-gray-700">
                    <strong>Borrowed Books:</strong> {borrowedBooks.length}
                  </div>
                  {borrowedBooks.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {borrowedBooks.map((book) => (
                        <div key={book.id} className="text-xs text-gray-600">
                          • {book.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditPerson(person)}
                    className="flex-1"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeletePerson(person.id)}
                    disabled={borrowedBooks.length > 0}
                    className="flex-1"
                  >
                    <Trash2 size={16} className="text-red-500" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Add Person Modal
function AddPersonModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  const handleSubmit = () => {
    if (!formData.name) {
      alert("Name is required");
      return;
    }
    onAdd(formData);
    setFormData({ name: "", email: "", department: "" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Person" size="sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
          />
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Person</Button>
        </div>
      </div>
    </Modal>
  );
}

// Edit Person Modal
function EditPersonModal({ isOpen, onClose, person, onUpdate }) {
  const [formData, setFormData] = useState(person || {});

  useEffect(() => {
    if (person) {
      setFormData(person);
    }
  }, [person]);

  const handleSubmit = () => {
    onUpdate(person.id, formData);
  };

  if (!person) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Person" size="sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <input
            type="text"
            value={formData.department || ""}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
          />
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}
