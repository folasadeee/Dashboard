import React, { Component, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const API_KEY = import.meta.env.VITE_API_KEY;

const MovieDetail = () => {

    let params = useParams();

    const [fullDetails, setFullDetails] = useState(null);
  
    useEffect(() => {
      const getMovieDetails = async () => {
        try {
          const details = await fetch(
            `https://api.themoviedb.org/3/movie/${params.id}?api_key=${API_KEY}`
          );
          const detailsJson = await details.json();
          setFullDetails(detailsJson);
        } catch (error) {
          console.error(error);
        }
      };
  
      getMovieDetails();
    }, [params.id]);
  
    if (!fullDetails) {
      return <p>Loading...</p>;
}
  
    return (
      <>
      <div className="details-container">
      <div className="details-img">
      <img src={`https://image.tmdb.org/t/p/original/${fullDetails.poster_path}`}/>
      <span className="italic text-center">{fullDetails.tagline}</span>
      </div>
        <div className="details-body">
        <h1 className="text-3xl font-bold">{fullDetails.original_title}</h1>
        <p className="py-5">{fullDetails.overview}</p>
        <p><span className="font-bold">Released:</span> {fullDetails.release_date}</p>
        <p><span className="font-bold">Rating:</span>  {fullDetails.vote_average}</p>
<p className="py-5">
{fullDetails.imdb_id ? 
    <a href={`https://www.imdb.com/title/${fullDetails.imdb_id}`} target="_blank"><button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">IMDB Page</button></a>
 : null}
</p>

            </div></div>
      </>
    );
  };
  
  export default MovieDetail;
  