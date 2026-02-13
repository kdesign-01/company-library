import React from "react";
import { User, Plus } from "lucide-react";
import Button from "../common/Button";
import PersonCard from "./PersonCard.jsx";

export default function PersonsView({
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
              <PersonCard
                key={person.id}
                person={person}
                borrowedBooks={borrowedBooks}
                onEdit={onEditPerson}
                onDelete={onDeletePerson}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
