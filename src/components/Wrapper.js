import Box from "./Box";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";

import Main from "./Main";

import MovieDetails from "./MovieDetails";
import MovieList from "./MovieList";
import NavBar from "./NavBar";
import NumResults from "./NumResults";
import Search from "./Search";

import WatchedMoviesList from "./WatchedMoviesList";
import WatchedSummary from "./WatchedSummary";
import { useMovie } from "../context/MovieContext";

function Wrapper() {
  const { isLoading, error, selectedId } = useMovie();
  return (
    <>
      <NavBar>
        <Search />
        <NumResults />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList />}
          {error && <ErrorMessage />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails />
          ) : (
            <>
              <WatchedSummary />
              <WatchedMoviesList />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

export default Wrapper;
