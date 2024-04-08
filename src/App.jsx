import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import "./App.css";

import BarGraph from "./components/BarGraph";

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [list, setList] = useState(null);
  const [genres, setGenres] = useState([]);
  const [releaseDate, setReleaseDate] = useState(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
        );
        const json = await response.json();
        setList(json);
        console.log(list);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchNowPlaying();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        const json = await response.json();
        setGenres(json.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  function getGenres(genre_ids) {
    if (!genres) return [];
    return genres.filter((genre) => genre_ids.includes(genre.id));
  }

  function formatDate(date) {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("en-US");
  }

  const [filteredResults, setFilteredResults] = useState(list);
  const [searchInput, setSearchInput] = useState("");

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);

    if (searchValue !== "") {
      const filteredData = list.results.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchValue.toLowerCase()) &&
          movie.vote_average >= value &&
          new Date(movie.release_date) >= new Date(releaseDate)
      );

      setFilteredResults(filteredData);
    } else {
      const filteredData = list.results.filter(
        (movie) =>
          movie.vote_average >= value &&
          new Date(movie.release_date) >= new Date(releaseDate)
      );

      setFilteredResults(filteredData);
    }
  };

  const [value, setValue] = useState(1);

  function handleLoadMore() {
    const currentPage = list.page + 1;

    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${currentPage}`
    )
      .then((response) => response.json())
      .then((data) => {
        setList((prev) => {
          return {
            ...prev,
            page: currentPage,
            results: [...prev.results, ...data.results],
          };
        });
      });
  }

  function findAverageRating() {
    if (!list) {
      console.log("No movies found");
      return null;
    } else {
      let total = 0;
      list.results.forEach((movie) => {
        total += movie.vote_average;
      });
      return total / list.results.length;
    }
  }

  function findNumberOfVoters() {
    if (!list) {
      console.log("No movies found");
    } else {
      let total = 0;
      list.results.forEach((movie) => {
        total += movie.vote_count;
      });

      return total;
    }
  }

  function findHighestRatedMovie() {
    if (!list) {
      console.log("No movies found");
      return null;
    } else {
      let highestRating = 0;
      let highestRatedMovie = null;
      let posterPath = null;
      list.results.forEach((movie) => {
        if (movie.vote_average > highestRating) {
          highestRating = movie.vote_average;
          highestRatedMovie = movie.title;
          posterPath = movie.poster_path;
        }
      });

      return (
        <>
          <img
            src={`https://image.tmdb.org/t/p/original/${posterPath}`}
            width="100px"
          />

          <h3 className="text-xl font-bold">{highestRatedMovie}</h3>
          <p className="text-lg">
            <b>Rating:</b> {(Math.round(highestRating) * 10) / 10} Stars ⭐
          </p>
        </>
      );
    }
  }

  const movieNames =
    list?.results?.map((movie) => movie.title).slice(0, 10) || [];

  const movieVoteCounts =
    list?.results?.map((movie) => movie.vote_count).slice(0, 10) || [];

  return (
    <>
      <main className="movies">
        <h1 className="text-center mb-4 text-4xl font-extrabold leading-snug tracking-tight text-neutral-800 md:text-5xl lg:text-6xl ">
          Welcome to{" "}
          <span className="underline underline-offset-3 decoration-8 decoration-red-400 ">
            MovieHub
          </span>
          , your one-stop destination for all things film.
        </h1>
        <div className="stats-container flex gap-2 py-5">
          <div className="bg-white shadow-xl rounded-3xl w-1/2 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold py-2">Highest Rated Movie</h2>
            {findHighestRatedMovie()}
          </div>

          <div className="bg-white shadow-xl rounded-3xl w-1/2 flex flex-col items-center text-center justify-center">
            <p className="text-2xl">
              <h2 className="text-3xl font-bold py-2">Average Rating</h2>
              {Math.round(findAverageRating() * 10) / 10} Stars ⭐
            </p>
            <hr />
            <p className="text-2xl">
              <h3 className="text-3xl font-bold py-2">Number of Voters</h3>
              {findNumberOfVoters()} 🙋
            </p>
          </div>
        </div>

        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Enter a movie title (e.g. 'Dune')"
            onChange={(input) => setSearchInput(input.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg"
        />
        <div className="ratingSliderContainer flex w-full justify-center">
          <label className="text-lg pr-3 font-bold">Minimum Rating:</label>
          <div className="ratingSlider flex">
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value))}
            />
            <span className="pl-3">{value}</span>
          </div>
        </div>

        <div className="buttonContainer w-full flex gap-3 justify-center py-3">
          <button
            onClick={() => searchItems("")}
            className="bg-white hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded active:ring-2"
          >
            Clear
          </button>
          <button
            onClick={() => searchItems(searchInput)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded border border-red-500 active:ring-2 active:ring-red-300"
          >
            Search
          </button>
        </div>

        <div className="main-dashboard-container">
          <div className="table-container">
            <div className="table-container relative overflow-x-auto shadow-md sm:rounded-lg my-6">
              <table className="movie-table table-fixed w-full text-md text-gray-500 text-center">
                <thead className="text-sm text-white uppercase bg-red-600 ">
                  <tr>
                    <th>Poster</th>
                    <th>Title</th>
                    <th>Release Date</th>
                    <th>Vote Average</th>
                    <th>Genres</th>
                  </tr>
                </thead>

                <tbody>
                  {searchInput.length > 0
                    ? filteredResults.map((movie) => (
                        <tr key={movie.id}>
                          <td>
                          <Link
                                key={movie.id}
                                to={`/movieDetails/${movie.id}`}
                              >
                                 <img
                              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                              width="100px"
                            />
                              </Link>
                          </td>
                          <td>{movie.title}</td>
                          <td>{formatDate(movie.release_date)}</td>
                          <td>{Math.round(movie.vote_average * 10) / 10}</td>
                          <td>
                            {getGenres(movie.genre_ids).map((genre, index) => (
                              <span key={genre.id}>
                                {genre.name}
                                {index !== movie.genre_ids.length - 1 && ", "}
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))
                    : list &&
                      list.results.map((movie) => (
                        <tr key={movie.id}>
                          <td>
              
                              <Link
                                key={movie.id}
                                to={`/movieDetails/${movie.id}`}
                              >
                                 <img
                              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                              width="100px"
                            />
                              </Link>
                            
                          </td>
                          <td>{movie.title}</td>
                          <td>{formatDate(movie.release_date)}</td>
                          <td>{Math.round(movie.vote_average * 10) / 10}</td>
                          <td>
                            {getGenres(movie.genre_ids).map((genre, index) => (
                              <span key={genre.id}>
                                {genre.name}
                                {index !== movie.genre_ids.length - 1 && ", "}
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {list && list.page < list.total_pages ? (
              <div className="flex justify-center">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded border border-red-500 active:ring-2 active:ring-red-300"
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              </div>
            ) : null}
          </div>
          <div className="chart-container">
            <BarGraph
              movieNames={movieNames}
              movieVoteCounts={movieVoteCounts}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
