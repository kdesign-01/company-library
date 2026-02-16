import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import BookRow from "./BookRow";

export default function BooksTable({
  books,
  persons,
  onEditBook,
  onDeleteBook,
  onBorrowBook,
  onReturnBook,
}) {
  const [sortBy, setSortBy] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  // Handle column header click
  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New column, default to ascending
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Sort books based on current sort settings
  const sortedBooks = useMemo(() => {
    const sorted = [...books].sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case "title":
          compareA = a.title?.toLowerCase() || "";
          compareB = b.title?.toLowerCase() || "";
          break;

        case "status":
          // Custom order: Available (0) before Borrowed (1)
          compareA = a.status === "Available" ? 0 : 1;
          compareB = b.status === "Available" ? 0 : 1;
          break;

        case "owner":
          compareA = a.owner?.toLowerCase() || "";
          compareB = b.owner?.toLowerCase() || "";
          break;

        default:
          return 0;
      }

      if (compareA < compareB) return sortDirection === "asc" ? -1 : 1;
      if (compareA > compareB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [books, sortBy, sortDirection]);

  // Render sortable column header
  const SortableHeader = ({ column, children, align = "left" }) => {
    const isActive = sortBy === column;
    const textAlign = align === "right" ? "text-right" : "text-left";

    return (
      <th
        className={`px-6 py-3 ${textAlign} text-xs font-medium uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors ${
          isActive ? "text-[#3355FF]" : "text-gray-500"
        }`}
        onClick={() => handleSort(column)}
      >
        <div className={`flex items-center gap-1 ${align === "right" ? "justify-end" : ""}`}>
          {children}
          <div className="flex flex-col">
            <ChevronUp
              size={12}
              className={`${
                isActive && sortDirection === "asc"
                  ? "text-[#3355FF]"
                  : "text-gray-300"
              }`}
            />
            <ChevronDown
              size={12}
              className={`-mt-1 ${
                isActive && sortDirection === "desc"
                  ? "text-[#3355FF]"
                  : "text-gray-300"
              }`}
            />
          </div>
        </div>
      </th>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <SortableHeader column="title">Book</SortableHeader>
              <SortableHeader column="status">Status</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <SortableHeader column="owner">Owner</SortableHeader>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedBooks.map((book) => (
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
  );
}
