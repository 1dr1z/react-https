import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import AddMovie from './components/AddMovie';
import MoviesList from './components/MoviesList';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://react-http-3b8fe-default-rtdb.firebaseio.com/movies.json'
      );
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  const addMovieHandler = async (movie) => {
    const response = await fetch(
      'https://react-http-3b8fe-default-rtdb.firebaseio.com/movies.json',
      {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    setMovies((prevMovies) => [...prevMovies, { ...movie, id: data.name }]);
    console.log(movies);
    console.log(data);
  };

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  let content = <p>Found no movies.</p>;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (!isLoading && movies.length > 0) {
    content = <MoviesList movies={movies} />;
  } else if (!isLoading && movies.length === 0 && !error) {
    content = <p>Found no movies.</p>;
  } else if (!isLoading && error) {
    content = <p>{error}</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}></AddMovie>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
