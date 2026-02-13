import React, { useState } from "react";
import { BookOpen, Edit2, Trash2, User, Calendar } from "lucide-react";
import Button from "../common/Button";
import Badge from "../common/Badge";

export default function BookRow({
  book,
  persons,
  onEdit,
  onDelete,
  onBorrow,
  onReturn,
}) {
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
