import React from "react";
import { User, Edit2, Trash2 } from "lucide-react";
import Button from "../common/Button";

export default function PersonCard({
  person,
  borrowedBooks,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: "rgba(51, 85, 255, 0.1)" }}
            className="p-3 rounded-full"
          >
            <User style={{ color: "#3355FF" }} size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{person.name}</h3>
            {person.department && (
              <p className="text-sm text-gray-500">{person.department}</p>
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
          onClick={() => onEdit(person)}
          className="flex-1"
        >
          <Edit2 size={16} />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(person.id)}
          disabled={borrowedBooks.length > 0}
          className="flex-1"
        >
          <Trash2 size={16} className="text-red-500" />
          Delete
        </Button>
      </div>
    </div>
  );
}
