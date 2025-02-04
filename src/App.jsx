import { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import './App.css';
import Search from './Components/Search';
import Spinner from './Components/Spinner';
import MovieCard from './Components/MovieCard';
import { updateSearchCount, getTrendingMovies } from './appwrite'; // Corriger l'importation ici

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 700, [searchTerm]);

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
      console.log('Trending movies loaded:', movies); // Log the trending movies
    } catch (error) {
      console.error('Error loading trending movies:', error);
    }
  };

  const fetchMovies = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.results) {
        setMovies(data.results);
        console.table(data.results); // Log the movies data as a table to the console
      } else {
        setError('No movies found');
        setMovies([]);
      }
      updateSearchCount(searchTerm, data.results[0]); // Utiliser la fonction correctement ici

    } catch (error) {
      setError(`Error fetching movies: ${error.message}`);
      console.error("Error fetching movies:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchMovies(debouncedSearchTerm);
    } else {
      fetchMovies();
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main className="w-full h-full">
      <div className='pattern' />
      <div className='wrapper'>
        <header className="mb-8">
          <img src="./hero.png" alt="hero banner" className="mx-auto mb-4" />
          <h1 className="text-center">Find<span className='text-gradient'> Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.searchTerm} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section>
          <h2 className='mt-[40px] text-left text-white'>All Movies</h2>
          {loading ? (
            <Spinner /> // Utiliser le composant Spinner
          ) : error ? (
            <p className='text-white'>{error}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-left">
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;