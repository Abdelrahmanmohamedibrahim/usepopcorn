import { useMovie } from "../context/MovieContext";

function NumResults() {
  const { movies } = useMovie();
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

export default NumResults;
