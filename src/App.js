import Wrapper from "./components/Wrapper";
import { MovieProvider } from "./context/MovieContext";
export default function App() {
  return (
    <>
      <MovieProvider>
        <Wrapper></Wrapper>
      </MovieProvider>
    </>
  );
}
