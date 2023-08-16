import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "956358bc";
const tempQuery = "Inception";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(function () {
    const SavedMovies = localStorage.getItem("watched");
    return JSON.parse(SavedMovies);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(watch) {
    setWatched((watched) => [...watched, watch]);
    // localStorage.setItem("watched", JSON.stringify([...watched, watch]));
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("something went wrong with fetching the movie ");
          const data = await res.json();
          if (data.Response === "false") {
            throw new Error("movie not found");
          }

          setMovies(data.Search);
          setIsLoading(true);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        {" "}
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />{" "}
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectId={handleSelectMovie} />
          )}
          {error && <ErrorMessage error={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <>
              {" "}
              <MovieDetail
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onWatchedMovie={handleAddWatched}
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          ) : (
            <>
              {" "}
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />{" "}
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function ErrorMessage({ error }) {
  return (
    <p className="error">
      <span>⛔</span>
      {error}
      {"xjxjxj"}
    </p>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>x</strong> results
    </p>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  useEffect(function () {
    inputEl.current.focus();
  }, []);
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
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectId, onDeleteWatched }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movies movie={movie} onSelectId={onSelectId} />
      ))}
    </ul>
  );
}
function Movies({ movie, onSelectId }) {
  return (
    <li onClick={() => onSelectId(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function MovieDetail({
  selectedId,
  onCloseMovie,
  onWatchedMovie,
  watched,
  onDeleteWatched,
}) {
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  console.log(isWatched);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetails;

  function setNewMovie() {
    const newMovie = {
      title: title,
      year: year,
      poster: poster,
      genre: genre,
      imdbID: selectedId,
      imdbRating: Number(imdbRating).toFixed(1),
      userRating: Number(userRating),
      runtime: Number(runtime.replace(" min", "")),
    };
    onWatchedMovie(newMovie);
    onCloseMovie();
    console.log(runtime);
  }

  useEffect(
    function () {
      async function showDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        const data = await res.json();

        setMovieDetails(data);
        setIsLoading(false);
      }
      showDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
        // console.log(`Clean up effect for movie ${title}`);
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movieDetails} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          {/* <p>{avgRating}</p> */}

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={setNewMovie}>
                      Add to list ++
                    </button>
                  )}
                </>
              ) : (
                <p>{watchedUserRating} ⭐⭐⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const totalRuntime = watched
    .map((movie) => movie.runtime)
    .reduce((sum, runtime) => sum + runtime, 0);

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{totalRuntime}</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} onDeleteWatched={onDeleteWatched} />
      ))}
    </ul>
  );
}
function Loader() {
  return <div className="loader"> is loading...</div>;
}
function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} </span>
        </p>
      </div>
      <button
        onClick={() => onDeleteWatched(movie.imdbID)}
        className="btn-delete"
      >
        X
      </button>
    </li>
  );
}
