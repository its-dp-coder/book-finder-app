import React, { useState } from "react";
import BookCard from "../components/BookCard";

export default function BookFinder() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    if (!query.trim()) {
      setBooks([]);
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data.docs && data.docs.length > 0) {
        setBooks(data.docs.slice(0, 20));
      } else {
        setBooks([]);
        setError("No results found.");
      }
    } catch (err) {
      setBooks([]);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = (book) => {
    if (favorites.some((fav) => fav.key === book.key)) return;
    const updated = [...favorites, book];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const removeFavorite = (book) => {
    const updated = favorites.filter((fav) => fav.key !== book.key);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem("favorites");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">📚 Book Finder</h1>

      {/* Search Input */}
      <div className="flex gap-2 justify-center mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title..."
          className="border rounded-lg p-2 w-1/2"
        />
        <button
          onClick={searchBooks}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500 font-semibold">{error}</p>}

      {/* Search Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.map((book, i) => (
          <BookCard
            key={`${book.key}-${i}`}
            book={book}
            onFavorite={addFavorite}
            isFavorite={favorites.some((fav) => fav.key === book.key)}
          />
        ))}
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="mt-12 bg-yellow-50 p-6 rounded-2xl shadow-lg border border-yellow-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-yellow-700 flex items-center gap-2">
              ⭐ Favorites
            </h2>
            <button
              onClick={clearFavorites}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow"
            >
              🗑 Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {favorites.map((book, i) => (
              <BookCard
                key={`${book.key}-fav-${i}`}
                book={book}
                isFavorite={true}
                onRemove={removeFavorite}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
