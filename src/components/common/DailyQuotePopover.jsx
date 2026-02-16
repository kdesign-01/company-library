import React from "react";
import { BookOpen, User, Sparkles } from "lucide-react";

export default function DailyQuotePopover({ isOpen, onClose, quote, loading, error }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={24} />
            <h2 className="text-xl font-semibold">My Daily Quote</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#3355FF]"></div>
              <p className="mt-4 text-gray-600">Loading your daily quote...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
                <p className="font-semibold mb-2">Oops! Something went wrong</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && quote && (
            <div className="space-y-6 animate-fade-in">
              {/* Quote Text */}
              <div className="relative">
                <div className="absolute -left-2 -top-2 text-6xl text-[#3355FF]/20 font-serif">
                  "
                </div>
                <p className="text-xl md:text-2xl text-gray-800 italic leading-relaxed pl-8 pr-4">
                  {quote.quote}
                </p>
                <div className="absolute -right-2 -bottom-6 text-6xl text-[#3355FF]/20 font-serif">
                  "
                </div>
              </div>

              {/* Book & Author Info */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <BookOpen size={20} className="text-[#3355FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                      From the book
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {quote.book}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User size={20} className="text-[#3355FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                      Author
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {quote.author}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
