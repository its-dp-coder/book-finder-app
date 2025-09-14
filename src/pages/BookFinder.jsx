import React, { useState } from "react";
import BookCard from "../components/BookCard";

export default function BookFinder() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState(""); 
  const [selectedBook, setSelectedBook] = useState(null);

  const searchBooks = async () => {
    if (!title.trim() && !author.trim() && !subject.trim()) {
      setBooks([]);
      setError("Please enter at least one search term.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const queryParams = [];
      if (title) queryParams.push(`title=${encodeURIComponent(title)}`);
      if (author) queryParams.push(`author=${encodeURIComponent(author)}`);
      if (subject) queryParams.push(`subject=${encodeURIComponent(subject)}`);

      const queryString = queryParams.join("&");
      const res = await fetch(`https://openlibrary.org/search.json?${queryString}`);
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

  const clearSearch = () => {
    setTitle("");
    setAuthor("");
    setSubject("");
    setBooks([]);
    setError("");
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

  const getSortedBooks = () => {
    let sorted = [...books];
    if (sortBy === "title") {
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "author") {
      sorted.sort((a, b) =>
        (a.author_name?.[0] || "").localeCompare(b.author_name?.[0] || "")
      );
    } else if (sortBy === "yearAsc") {
      sorted.sort((a, b) => (a.first_publish_year || 0) - (b.first_publish_year || 0));
    } else if (sortBy === "yearDesc") {
      sorted.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
    }
    return sorted;
  };

  return (
    <div
      className={`${
        darkMode
          ? "bg-gray-900 text-gray-200"
          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900"
      } min-h-screen p-6 transition-colors duration-500`}
    >
      {/* Dark Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-6 text-center">📚 Book Finder</h1>

      {/* Search Inputs */}
      <div className="flex flex-col md:flex-row gap-3 justify-center mb-6 bg-white dark:bg-gray-800 rounded-full shadow-lg p-4">
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setAuthor(""); setSubject(""); }}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
          placeholder="Search by title..."
          className="border-none rounded-full p-3 w-full md:w-1/3 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
        />
        <input
          type="text"
          value={author}
          onChange={(e) => { setAuthor(e.target.value); setTitle(""); setSubject(""); }}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
          placeholder="Search by author..."
          className="border-none rounded-full p-3 w-full md:w-1/3 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
        />
        <input
          type="text"
          value={subject}
          onChange={(e) => { setSubject(e.target.value); setTitle(""); setAuthor(""); }}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
          placeholder="Search by subject..."
          className="border-none rounded-full p-3 w-full md:w-1/3 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
        />
        <button
          onClick={searchBooks}
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition shadow-md w-full md:w-auto"
        >
          🔍 Search
        </button>
        <button
          onClick={clearSearch}
          className="bg-gray-400 text-white px-6 py-3 rounded-full hover:bg-gray-500 transition shadow-md w-full md:w-auto"
        >
          ❌ Clear
        </button>
      </div>

      {/* Sorting Dropdown */}
      {books.length > 0 && (
        <div className="flex justify-center mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="">Sort By...</option>
            <option value="title">📖 Title (A–Z)</option>
            <option value="author">✍️ Author (A–Z)</option>
            <option value="yearAsc">📅 Year (Oldest First)</option>
            <option value="yearDesc">📅 Year (Newest First)</option>
          </select>
        </div>
      )}

      {/* Loading / Error */}
      {loading && <p className="text-center text-gray-400 animate-pulse">Loading...</p>}
      {error && <p className="text-center text-red-500 font-semibold">{error}</p>}

      {/* Search Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {getSortedBooks().map((book, i) => (
          <BookCard
            key={`${book.key}-${i}`}
            book={book}
            onFavorite={addFavorite}
            isFavorite={favorites.some((fav) => fav.key === book.key)}
            darkMode={darkMode}
            onViewDetails={setSelectedBook}
          />
        ))}
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-yellow-50 border-yellow-200"} mt-12 p-6 rounded-2xl shadow-lg border`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`${darkMode ? "text-yellow-400" : "text-yellow-700"} text-2xl font-bold flex items-center gap-2`}>
              ⭐ Favorites <span className="text-sm">({favorites.length})</span>
            </h2>
            <button
              onClick={clearFavorites}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 shadow transition w-full sm:w-auto"
            >
              🗑 Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((book, i) => (
              <BookCard
                key={`${book.key}-fav-${i}`}
                book={book}
                isFavorite={true}
                onRemove={removeFavorite}
                darkMode={darkMode}
                onViewDetails={setSelectedBook}
              />
            ))}
          </div>
        </div>
      )}

      {/* ✅ Modal for Details */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div
            className={`p-6 rounded-2xl shadow-lg max-w-lg w-full relative ${
              darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
            }`}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setSelectedBook(null)}
            >
              ✖
            </button>

            <img
              src={
                selectedBook.cover_i
                  ? `https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-L.jpg`
                  : "https://placehold.co/200x300?text=No+Cover"
              }
              alt={selectedBook.title}
              className="w-40 h-56 object-cover rounded-lg mx-auto mb-4"
            />

            <h2 className="text-2xl font-bold mb-2 text-center">{selectedBook.title}</h2>
            <p className="mb-2">👩‍💻 Author: {selectedBook.author_name?.join(", ") || "Unknown"}</p>
            <p className="mb-2">📅 First Published: {selectedBook.first_publish_year || "N/A"}</p>
            <p className="mb-2">
              🏷 Subjects: {selectedBook.subject?.slice(0, 5).join(", ") || "N/A"}
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <a
                href={`https://openlibrary.org${selectedBook.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                🌍 View on OpenLibrary
              </a>

              {/* Cancel Button */}
              <button
                onClick={() => setSelectedBook(null)}
                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
