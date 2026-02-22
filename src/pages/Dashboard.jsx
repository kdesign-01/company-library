import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDebounce } from "../hooks/useDebounce";
import Header from "../components/layout/Header";
import BooksView from "../components/books/BooksView";
import PersonsView from "../components/persons/PersonsView";
import AddBookModal from "../components/books/AddBookModal";
import EditBookModal from "../components/books/EditBookModal";
import BorrowBookModal from "../components/books/BorrowBookModal";
import AddPersonModal from "../components/persons/AddPersonModal";
import EditPersonModal from "../components/persons/EditPersonModal";
import Toast from "../components/common/Toast";
import * as booksApi from "../services/booksApi";
import * as personsApi from "../services/personsApi";

export default function Dashboard() {
  // State
  const [books, setBooks] = useState([]);
  const [persons, setPersons] = useState([]);
  const [activeTab, setActiveTab] = useState("books");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [booksData, personsData] = await Promise.all([
        booksApi.getAllBooks(),
        personsApi.getAllPersons(),
      ]);
      setBooks(booksData);
      setPersons(personsData);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("Failed to load data. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Book Management Functions
  const addBook = async (bookData) => {
    try {
      const newBook = await booksApi.addBook(bookData);
      setBooks([newBook, ...books]);
      setIsAddBookModalOpen(false);
      showToast("Book added successfully!", "success");
    } catch (error) {
      console.error("Error adding book:", error);
      showToast("Failed to add book. Please try again.", "error");
    }
  };

  const updateBook = async (bookId, updates) => {
    try {
      const updatedBook = await booksApi.updateBook(bookId, updates);
      setBooks(books.map((book) => (book.id === bookId ? updatedBook : book)));
      setIsEditBookModalOpen(false);
      setBookToEdit(null);
      showToast("Book updated successfully!", "success");
    } catch (error) {
      console.error("Error updating book:", error);
      showToast("Failed to update book. Please try again.", "error");
    }
  };

  const deleteBook = async (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (book.status === "Borrowed") {
      showToast(
        "Cannot delete a borrowed book. Please return it first.",
        "error",
      );
      return;
    }

    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await booksApi.deleteBook(bookId);
        setBooks(books.filter((b) => b.id !== bookId));
        showToast("Book deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting book:", error);
        showToast("Failed to delete book. Please try again.", "error");
      }
    }
  };

  const borrowBook = async (bookId, personId, borrowedDate) => {
    try {
      const updatedBook = await booksApi.borrowBook(
        bookId,
        personId,
        borrowedDate,
      );
      setBooks(books.map((b) => (b.id === bookId ? updatedBook : b)));
      setIsBorrowModalOpen(false);
      setSelectedBook(null);
      showToast("Book borrowed successfully!", "success");
    } catch (error) {
      console.error("Error borrowing book:", error);
      showToast("Failed to borrow book. Please try again.", "error");
    }
  };

  const returnBook = async (bookId) => {
    try {
      const updatedBook = await booksApi.returnBook(bookId);
      setBooks(books.map((b) => (b.id === bookId ? updatedBook : b)));
      showToast("Book returned successfully!", "success");
    } catch (error) {
      console.error("Error returning book:", error);
      showToast("Failed to return book. Please try again.", "error");
    }
  };

  // Person Management Functions
  const addPerson = async (personData) => {
    try {
      const newPerson = await personsApi.addPerson(personData);
      setPersons([...persons, newPerson]);
      setIsAddPersonModalOpen(false);
      showToast("Person added successfully!", "success");
    } catch (error) {
      console.error("Error adding person:", error);
      showToast("Failed to add person. Please try again.", "error");
    }
  };

  const updatePerson = async (personId, updates) => {
    try {
      const updatedPerson = await personsApi.updatePerson(personId, updates);
      setPersons(persons.map((p) => (p.id === personId ? updatedPerson : p)));
      setIsEditPersonModalOpen(false);
      setPersonToEdit(null);
      showToast("Person updated successfully!", "success");
    } catch (error) {
      console.error("Error updating person:", error);
      showToast("Failed to update person. Please try again.", "error");
    }
  };

  const deletePerson = async (personId) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      try {
        await personsApi.deletePerson(personId);
        setPersons(persons.filter((p) => p.id !== personId));
        showToast("Person deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting person:", error);
        showToast("Failed to delete person. Please try again.", "error");
      }
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  // Memoize filtered books for better performance
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (book.borrower &&
          book.borrower.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || book.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [books, debouncedSearchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3355FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading library data...</p>
        </div>
      </div>
    );
  }

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
        persons={persons}
      />

      <EditBookModal
        isOpen={isEditBookModalOpen}
        onClose={() => {
          setIsEditBookModalOpen(false);
          setBookToEdit(null);
        }}
        book={bookToEdit}
        onUpdate={updateBook}
        persons={persons}
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
