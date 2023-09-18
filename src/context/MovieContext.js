import { createContext, useContext } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useState } from "react";
import { useMovies } from "../hooks/useMovies";

const MovieContext = createContext();
function MovieProvider({ children }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  return (
    <MovieContext.Provider
      value={{
        query,
        setQuery,
        setSelectedId,
        selectedId,
        movies,
        isLoading,
        error,
        watched,
        onSelectMovie: handleSelectMovie,
        onCloseMovie: handleCloseMovie,
        onAddWatched: handleAddWatched,
        onDeleteWatched: handleDeleteWatched,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}
function useMovie() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("MovieContext wasn't used");
  }
  return context;
}
export { MovieProvider, useMovie };
