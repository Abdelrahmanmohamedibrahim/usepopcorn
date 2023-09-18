import { useMovie } from "../context/MovieContext";

function ErrorMessage({ message }) {
  const { error } = useMovie();
  return (
    <p className="error">
      <span>⛔️</span> {error}
    </p>
  );
}

export default ErrorMessage;
