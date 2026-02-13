import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";

export default function EditPersonModal({ isOpen, onClose, person, onUpdate }) {
  const [formData, setFormData] = useState({});

  // Initialize form when modal opens
  React.useEffect(() => {
    if (isOpen && person) {
      setFormData({ ...person });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, person?.id]);

  const handleSubmit = () => {
    onUpdate(person.id, formData);
  };

  if (!person) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Person" size="sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <input
            type="text"
            value={formData.department || ""}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
          />
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
