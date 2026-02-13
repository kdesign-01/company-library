import React, { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { ISBN_DATABASE } from "../../data/mockData";

export default function AddBookModal({ isOpen, onClose, onAdd }) {
  const [isbn, setIsbn] = useState("");
  const [isbnFetched, setIsbnFetched] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    coverUrl: "",
    publicationYear: "",
    language: "",
    isbn: "",
    owner: "Company Library",
  });

  const fetchISBN = () => {
    const data = ISBN_DATABASE[isbn];
    if (data) {
      setFormData({ ...formData, ...data, isbn });
      setIsbnFetched(true);
    } else {
      alert("ISBN not found in database. Please enter details manually.");
      setFormData({ ...formData, isbn });
      setIsbnFetched(true);
    }
  };

  const handleSubmit = () => {
    if (!formData.title) {
      alert("Title is required");
      return;
    }
    onAdd(formData);
    resetForm();
  };

  const resetForm = () => {
    setIsbn("");
    setIsbnFetched(false);
    setFormData({
      title: "",
      summary: "",
      coverUrl: "",
      publicationYear: "",
      language: "",
      isbn: "",
      owner: "Company Library",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={resetForm} title="Add New Book" size="lg">
      <div className="space-y-6">
        {!isbnFetched ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Fetch Book Data by ISBN
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Enter an ISBN to automatically fetch book information
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter ISBN (e.g., 9780596517748)"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
                <Button onClick={fetchISBN} disabled={!isbn}>
                  Fetch Data
                </Button>
              </div>
              <div className="mt-3 text-xs text-blue-600">
                Try: 9780596517748, 9780132350884, or 9780201633610
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => setIsbnFetched(true)}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Skip and enter manually
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Summary
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.coverUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, coverUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publication Year
                </label>
                <input
                  type="number"
                  value={formData.publicationYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publicationYear: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) =>
                    setFormData({ ...formData, isbn: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner
                </label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) =>
                    setFormData({ ...formData, owner: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                <Plus size={18} />
                Add Book
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
