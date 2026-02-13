import React from "react";
import BookRow from "./BookRow";

export default function BooksTable({
  books,
  persons,
  onEditBook,
  onDeleteBook,
  onBorrowBook,
  onReturnBook,
}) {
  return (
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
  );
}
