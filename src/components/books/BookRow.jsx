import React from "react";
import { Edit2, Trash2, User, Calendar, ExternalLink } from "lucide-react";
import Button from "../common/Button";
import Badge from "../common/Badge";
import CoverImage from "../common/CoverImage";

export default function BookRow({
  book,
  persons,
  onEdit,
  onDelete,
  onBorrow,
  onReturn,
}) {
  const borrower = book.borrowedBy
    ? persons.find((p) => p.id === book.borrowedBy)
    : null;

  return (
    <tr className="group hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <CoverImage
            src={book.coverUrl}
            alt={book.title}
            containerClassName="w-12 h-16 flex-shrink-0"
            imgClassName="w-full h-full object-cover rounded shadow-sm"
            showFallback={true}
            fallbackIconSize={20}
          />
          <div>
            {book.sourceUrl ? (
              <a
                href={book.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#2C2C2B] group-hover:text-[#3355FF] hover:underline flex items-center gap-1 group/link transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {book.title}
                <ExternalLink
                  size={14}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
            ) : (
              <div className="font-semibold text-gray-900">{book.title}</div>
            )}
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
