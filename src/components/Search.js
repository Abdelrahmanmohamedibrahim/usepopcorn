import { useMovie } from "../context/MovieContext";
import { useKey } from "../hooks/useKey";
import { useRef } from "react";
function Search() {
  const inputEl = useRef(null);
  const { query, setQuery } = useMovie();

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

export default Search;
