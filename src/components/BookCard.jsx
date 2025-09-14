import React from "react";

export default function BookCard({ book, onFavorite, onRemove, isFavorite }) {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : book.edition_key
    ? `https://covers.openlibrary.org/b/olid/${book.edition_key[0]}-M.jpg`
    : "https://placehold.co/150x200?text=No+Cover";

  return (
    <div
      className={`shadow-md rounded-2xl p-4 transition transform hover:scale-105 ${
        isFavorite ? "bg-yellow-100 border border-yellow-300" : "bg-white"
      }`}
    >
      <img
        src={coverUrl}
        alt={book.title}
        className="w-full h-48 object-cover rounded-lg mb-2"
      />
      <h2 className="font-semibold text-lg line-clamp-2">{book.title}</h2>
      <p className="text-sm text-gray-600 line-clamp-1">
        {book.author_name?.join(", ")}
      </p>
      <p className="text-xs text-gray-500">
        First Published: {book.first_publish_year || "N/A"}
      </p>

      {/* Buttons */}
      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        {onFavorite && !isFavorite && (
          <button
            className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
            onClick={() => onFavorite(book)}
          >
            ❤️ Add to Favorites
          </button>
        )}

        {isFavorite && onRemove && (
          <button
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            onClick={() => onRemove(book)}
          >
            ❌ Remove from Favorites
          </button>
        )}

        {isFavorite && !onRemove && (
          <p className="flex-1 text-center text-pink-600 font-semibold">
            ⭐ In Favorites
          </p>
        )}

        {/* View Details Button */}
        <a
          href={book.key ? `https://openlibrary.org${book.key}` : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
            📖 View Details
          </button>
        </a>
      </div>
    </div>
  );
}
