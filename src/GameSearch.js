import React, { useState } from'react';
import { Search } from 'lucide-react';

const apiKey = 'YOUR_API_KEY';

const storeNames = {
  1: 'Steam',
  2: 'Microsoft Store',
  3: 'PlayStation Store',
  4: 'App Store',
  5: 'GOG',
  6: 'Nintendo Store',
  7: 'Xbox Store',
  8: 'Google Play',
};

export default function GameSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [game, setGame] = useState(null);
  const [stores, setStores] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchGame = async () => {
    setLoading(true);
    setError('');
    setGame(null);
    setStores([]);
    setTrailers([]);
    try {
      const response = await fetch(`https://api.rawg.io/api/games?search=${searchTerm}&key=${apiKey}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const gameId = data.results[0].id;
        await fetchGameDetails(gameId);
        await fetchGameStores(gameId);
        await fetchGameTrailers(gameId);
      } else {
        setError('No se encontraron juegos');
      }
    } catch (error) {
      setError('Error al buscar el juego');
    }
    setLoading(false);
  };

  const fetchGameDetails = async (gameId) => {
    const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`);
    const data = await response.json();
    setGame(data);
  };

  const fetchGameStores = async (gameId) => {
    const response = await fetch(`https://api.rawg.io/api/games/${gameId}/stores?key=${apiKey}`);
    const data = await response.json();
    setStores(data.results || []);
  };

  const fetchGameTrailers = async (gameId) => {
    const response = await fetch(`https://api.rawg.io/api/games/${gameId}/movies?key=${apiKey}`);
    const data = await response.json();
    console.log('Trailers data:', data);
    setTrailers(data.results || []);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Video Game Search</h1>
      <div className="flex mb-4 justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar juego..."
          className="flex-grow p-2 border rounded-l-md max-w-md shadow-md"
        />
        <button
          onClick={searchGame}
          className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 flex items-center"
          disabled={loading}
        >
          {loading? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12H4zm2 5.291A7.962 7.962 0 014 19.708a7.962 7.962 0 01-2-5.291zm12 0a5.709 5.709 0 013 3.5h.008zm.008 2.5A5.71 5.71 0 0121 15.5h-.008z"></path>
            </svg>
          ) : (
            <Search />
          )}
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {game && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">{game.name}</h2>
          {game.background_image && (
            <img src={game.background_image} alt={game.name} className="w-full h-64 object-cover rounded-md mb-4 mx-auto max-w-lg" />
          )}
          <div className="flex flex-wrap justify-center">
            <div className="w-full md:w-1/2 xl:w-1/3 p-4">
              <p className="mb-2">{game.description_raw}</p>
            </div>
            <div className="w-full md:w-1/2 xl:w-1/3 p-4">
              <p className="font-semibold">Release date: {game.released || 'Not available'}</p>
              <p className="font-semibold">Metacritic: {game.metacritic || 'Not available'}</p>
              <p className="font-semibold">Achievements: {game.achievements_count || 'Not available'}</p>
            </div>
          </div>
        </div>
      )}
      {stores.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-4 animate-fade-in">
          <h3 className="text-xl font-bold mb-2">Available stores:</h3>
          <ul className="list-disc pl-5">
            {stores.map((store) => (
              <li key={store.id}>
                {store.store_id && storeNames[store.store_id] && (
                  <a href={store.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {storeNames[store.store_id]}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {trailers.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-4 animate-fade-in mt-4">
          <h3 className="text-xl font-bold mb-2">Trailers:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trailers.map((trailer) => (
              <div key={trailer.id} className="rounded-lg overflow-hidden">
                <video controls className="w-full h-auto">
                  <source src={trailer.data.max} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <h4 className="text-lg font-semibold mt-2">{trailer.name}</h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}