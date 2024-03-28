import { useEffect, useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

const API_KEY = import.meta.env.VITE_API_KEY;
const HASH = import.meta.env.VITE_HASH;

function App() {

  const [list, setList] = useState(null);

  useEffect(() => {
    const fetchAllCharacters = async () => {
      try {
        const response = await fetch(
          `https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=${API_KEY}&hash=${HASH}`
        );
        const json = await response.json();
        setList(json);
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };
  
    fetchAllCharacters();
  }, []);

  return (
    <>
    <main className="characters">
      <h1>Marvel Characters</h1>
 
   <ul>
          {list && list.data.results.map((character) => (
            <li key={character.id}>{character.name}</li>
          ))}
        </ul>

    </main>
    </>
  )
}

export default App
