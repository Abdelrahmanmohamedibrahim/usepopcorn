import { useMovie } from "../context/MovieContext";
import WatchedMovie from "./WatchedMovie";
function WatchedMoviesList() {
  const { watched, onDeleteWatched } = useMovie();
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

export default WatchedMoviesList;
