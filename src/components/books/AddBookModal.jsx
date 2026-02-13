import React, { useState } from "react";
import { Plus, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { fetchBookByISBN, isValidISBN } from "../../services/isbnApi";

export default function AddBookModal({ isOpen, onClose, onAdd }) {
  const [isbn, setIsbn] = useState("");
  const [isbnFetched, setIsbnFetched] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [fetchSuccess, setFetchSuccess] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    coverUrl: "",
    publicationYear: "",
    language: "",
    isbn: "",
    owner: "Company Library",
  });

  const fetchISBN = async () => {
    // Validate ISBN first
    if (!isValidISBN(isbn)) {
      setFetchError(
        "Invalid ISBN format. Please enter a valid 10 or 13 digit ISBN.",
      );
      return;
    }

    setIsFetching(true);
    setFetchError(null);
    setFetchSuccess(null);

    try {
      const result = await fetchBookByISBN(isbn);

      if (result.found) {
        // Merge fetched data with current form data
        setFormData({
          ...formData,
          title: result.data.title,
          summary: result.data.summary,
          coverUrl: result.data.coverUrl,
          publicationYear: result.data.publicationYear || "",
          language: result.data.language,
          isbn: isbn,
        });
        setFetchSuccess(`Book data found via ${result.source}!`);
        setIsbnFetched(true);
      } else {
        setFetchError(
          "Book not found in any database. Please enter details manually.",
        );
        setFormData({ ...formData, isbn });
        setIsbnFetched(true);
      }
    } catch (error) {
      setFetchError(
        error.message ||
          "Failed to fetch book data. Please try again or enter manually.",
      );
      setFormData({ ...formData, isbn });
      setIsbnFetched(true);
    } finally {
      setIsFetching(false);
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
    setIsFetching(false);
    setFetchError(null);
    setFetchSuccess(null);
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

  const handleISBNKeyPress = (e) => {
    if (e.key === "Enter" && isbn && !isFetching) {
      fetchISBN();
    }
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
                Enter an ISBN to automatically fetch book information from Open
                Library or Google Books
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter ISBN (e.g., 9780596517748 or 0596517742)"
                  value={isbn}
                  onChange={(e) => {
                    setIsbn(e.target.value);
                    setFetchError(null);
                  }}
                  onKeyPress={handleISBNKeyPress}
                  disabled={isFetching}
                  className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <Button
                  onClick={fetchISBN}
                  disabled={!isbn || isFetching}
                  style={{ minWidth: "120px" }}
                >
                  {isFetching ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    "Fetch Data"
                  )}
                </Button>
              </div>

              {/* Success Message */}
              {fetchSuccess && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                  <CheckCircle size={16} />
                  <span>{fetchSuccess}</span>
                </div>
              )}

              {/* Error Message */}
              {fetchError && (
                <div className="mt-3 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{fetchError}</span>
                </div>
              )}

              <div className="mt-3 text-xs text-blue-600">
                <strong>Try these ISBNs:</strong> 9780134685991 (Effective
                Java), 9780132350884 (Clean Code), 9781617294136 (Spring in
                Action)
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => setIsbnFetched(true)}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
                disabled={isFetching}
              >
                Skip and enter manually
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Show source if data was fetched */}
            {fetchSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                ✓ Data fetched successfully! You can edit any field before
                saving.
              </div>
            )}

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
                {formData.coverUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.coverUrl}
                      alt="Book cover preview"
                      className="h-32 object-cover rounded shadow-sm"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}
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
