import React, { useState } from "react";
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { fetchBookByISBN, isValidISBN } from "../../services/isbnApi";
import CoverImage from "../common/CoverImage";

const CURRENT_YEAR = new Date().getFullYear();

export default function EditBookModal({ isOpen, onClose, book, onUpdate, persons = [] }) {
  // Use the book prop directly, create a local copy only when needed
  const [formData, setFormData] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [fetchSuccess, setFetchSuccess] = useState(null);

  // When modal opens, initialize form with book data
  const handleOpen = () => {
    if (book) {
      setFormData({ ...book });
    }
    // Reset fetch status
    setIsFetching(false);
    setFetchError(null);
    setFetchSuccess(null);
  };

  // Fetch book data from ISBN API
  const fetchISBN = async () => {
    const currentIsbn = formData.isbn;

    // Validate ISBN first
    if (!currentIsbn || !isValidISBN(currentIsbn)) {
      setFetchError(
        "Invalid ISBN format. Please enter a valid 10 or 13 digit ISBN."
      );
      return;
    }

    setIsFetching(true);
    setFetchError(null);
    setFetchSuccess(null);

    try {
      const result = await fetchBookByISBN(currentIsbn);

      if (result.found) {
        // Merge fetched data with current form data, preserving owner
        setFormData({
          ...formData,
          title: result.data.title,
          summary: result.data.summary,
          sourceUrl: result.data.sourceUrl,
          coverUrl: result.data.coverUrl,
          publicationYear: result.data.publicationYear || "",
          language: result.data.language,
          isbn: currentIsbn,
          // Keep the existing owner
        });
        setFetchSuccess(`Data refetched from ${result.source}!`);
      } else {
        setFetchError(
          "Book not found in any database. Cannot refetch data for this ISBN."
        );
      }
    } catch (error) {
      console.error("Refetch ISBN error:", error);
      setFetchError("Failed to fetch book data. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  // Call handleOpen when modal opens
  React.useEffect(() => {
    if (isOpen && book) {
      handleOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, book?.id]);

  const handleSubmit = () => {
    onUpdate(book.id, formData);
  };

  if (!book) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Book" size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title || ""}
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
              value={formData.summary || ""}
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
              value={formData.coverUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, coverUrl: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
            />
            {formData.coverUrl && (
              <div className="mt-2">
                <CoverImage
                  src={formData.coverUrl}
                  alt="Book cover preview"
                  containerClassName="h-32 w-20"
                  imgClassName="h-32 object-cover rounded shadow-sm"
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
              value={formData.publicationYear || ""}
              onChange={(e) =>
                setFormData({ ...formData, publicationYear: e.target.value })
              }
              min={1000}
              max={CURRENT_YEAR}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <input
              type="text"
              value={formData.language || ""}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={formData.isbn || ""}
                onChange={(e) => {
                  setFormData({ ...formData, isbn: e.target.value });
                  // Clear fetch messages when ISBN changes
                  setFetchError(null);
                  setFetchSuccess(null);
                }}
                disabled={isFetching}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <Button
                onClick={fetchISBN}
                disabled={!formData.isbn || isFetching || !isValidISBN(formData.isbn || "")}
                variant="secondary"
                style={{ minWidth: "140px" }}
              >
                {isFetching ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Refetch Data
                  </>
                )}
              </Button>
            </div>

            {/* Success Message */}
            {fetchSuccess && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2">
                <CheckCircle size={16} />
                <span>{fetchSuccess}</span>
              </div>
            )}

            {/* Error Message */}
            {fetchError && (
              <div className="mt-2 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-2">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{fetchError}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner
            </label>
            <select
              value={formData.owner || "Company Library"}
              onChange={(e) =>
                setFormData({ ...formData, owner: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF] bg-white"
            >
              <option value="Company Library">Company Library</option>
              {persons.map((person) => (
                <option key={person.id} value={person.name}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source URL (optional)
            </label>
            <input
              type="url"
              value={formData.sourceUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, sourceUrl: e.target.value })
              }
              placeholder="https://openlibrary.org/works/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
            />
            <p className="mt-1 text-xs text-gray-500">
              Auto-updated when refetching from ISBN. Link to book's source page.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}
