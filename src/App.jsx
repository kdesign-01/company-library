import React, { useState } from "react";
import Header from "./components/layout/Header";
import BooksView from "./components/books/BooksView";
import PersonsView from "./components/persons/PersonsView";
import AddBookModal from "./components/books/AddBookModal";
import EditBookModal from "./components/books/EditBookModal";
import BorrowBookModal from "./components/books/BorrowBookModal";
import AddPersonModal from "./components/persons/AddPersonModal";
import EditPersonModal from "./components/persons/EditPersonModal";
import Toast from "./components/common/Toast";
import { INITIAL_BOOKS, INITIAL_PERSONS } from "./data/mockData";

export default function App() {
  // State
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [persons, setPersons] = useState(INITIAL_PERSONS);
  const [activeTab, setActiveTab] = useState("books");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal states
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [personToEdit, setPersonToEdit] = useState(null);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isEditPersonModalOpen, setIsEditPersonModalOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

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
    setBookToEdit(null);
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
    setPersonToEdit(null);
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
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        booksCount={books.length}
        personsCount={persons.length}
      />

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
