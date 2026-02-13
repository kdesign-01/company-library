import React from "react";
import { Search, Plus, BookOpen } from "lucide-react";
import Button from "../common/Button";
import BooksTable from "./BooksTable";

export default function BooksView({
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

      {/* Books Table or Empty State */}
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
        <BooksTable
          books={books}
          persons={persons}
          onEditBook={onEditBook}
          onDeleteBook={onDeleteBook}
          onBorrowBook={onBorrowBook}
          onReturnBook={onReturnBook}
        />
      )}
    </div>
  );
}
