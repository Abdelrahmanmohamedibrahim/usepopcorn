import { useMovie } from "../context/MovieContext";
import Movie from "./Movie";
function MovieList() {
  const { onSelectMovie, movies } = useMovie();
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

export default MovieList;
