import React, { useState } from "react";
import { BookOpen, User, LogOut } from "lucide-react";
import Button from "../common/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header({
  activeTab,
  setActiveTab,
  booksCount,
  personsCount,
}) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setLoggingOut(true);
      await signOut();
      navigate("/login");
    }
  };
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: "#3355FF" }}
              className="p-2 rounded-lg"
            >
              <BookOpen className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Company Library
              </h1>
              <p className="text-sm text-gray-500">Management System</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTab === "books" ? "primary" : "ghost"}
              onClick={() => setActiveTab("books")}
            >
              <BookOpen size={18} />
              Books ({booksCount})
            </Button>
            <Button
              variant={activeTab === "persons" ? "primary" : "ghost"}
              onClick={() => setActiveTab("persons")}
            >
              <User size={18} />
              Persons ({personsCount})
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              {loggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
