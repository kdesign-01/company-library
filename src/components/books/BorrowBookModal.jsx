import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";

export default function BorrowBookModal({
  isOpen,
  onClose,
  book,
  persons,
  onBorrow,
}) {
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
