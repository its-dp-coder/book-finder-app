import React from "react";

export default function BookCard({ book, onFavorite, onRemove, isFavorite, darkMode, onViewDetails }) {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : book.edition_key
    ? `https://covers.openlibrary.org/b/olid/${book.edition_key[0]}-M.jpg`
    : "https://placehold.co/150x200?text=No+Cover";

  return (
    <div
      className={`shadow-md rounded-2xl p-4 transition transform hover:scale-105 hover:shadow-xl ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
      } ${isFavorite ? "bg-yellow-100 border border-yellow-300" : ""}`}
    >
      <img
        src={coverUrl}
        alt={book.title}
        className="w-full h-48 object-cover rounded-lg mb-3"
      />
      <h2 className="font-semibold text-lg line-clamp-2 break-words">{book.title}</h2>
      <p className="text-sm line-clamp-1 break-words">
        {book.author_name?.join(", ") || "Unknown Author"}
      </p>
      <p className="text-xs mb-3">
        First Published: {book.first_publish_year || "N/A"}
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Favorite / Remove Favorite */}
        {isFavorite ? (
          onRemove ? (
            <button
              className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition text-center"
              onClick={() => onRemove(book)}
            >
              ❌ Remove from Favorites
            </button>
          ) : (
            <p className="flex-1 text-center text-pink-600 font-semibold py-3 bg-gray-200 rounded-lg dark:bg-gray-700">
              ⭐ In Favorites
            </p>
          )
        ) : (
          onFavorite && (
            <button
              className="flex-1 bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition text-center"
              onClick={() => onFavorite(book)}
            >
              ❤️ Add to Favorites
            </button>
          )
        )}

        {/* View Details */}
        <button
          onClick={() => onViewDetails(book)}
          className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
        >
          📖 View Details
        </button>
      </div>
    </div>
  );
}
