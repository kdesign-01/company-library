import React, { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";

export default function AddPersonModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  const resetForm = () => {
    setFormData({ name: "", email: "", department: "" });
  };

  const handleSubmit = () => {
    if (!formData.name) {
      alert("Name is required");
      return;
    }
    onAdd(formData);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Person" size="sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
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
            value={formData.email}
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
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3355FF]"
          />
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Plus size={18} />
            Add Person
          </Button>
        </div>
      </div>
    </Modal>
  );
}
