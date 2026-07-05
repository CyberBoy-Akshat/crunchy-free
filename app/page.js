'use client';
import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentAnime, setCurrentAnime] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    const res = await fetch('/api/catalog');
    const data = await res.json();
    setAnimeList(data);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setAnimeList(data);
    } else if (query.length === 0) {
      loadCatalog();
    }
  };

  const playAnime = async (id) => {
    const res = await fetch(`/api/catalog?id=${id}`);
    const anime = await res.json();
    setCurrentAnime(anime);
    setCurrentEpisode(0);
    loadEpisode(anime, 0);
  };

  const loadEpisode = async (anime, index) => {
    setCurrentEpisode(index);
    const ep = anime.episodes[index];
    const res = await fetch(`/api/stream?url=${encodeURIComponent(ep.streamUrl)}`);
    const data = await res.json();

    const video = videoRef.current;
    if (hlsRef.current) hlsRef.current.destroy();

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(data.stream);
      hls.attachMedia(video);
      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = data.stream;
    }
  };

  const closePlayer = () => {
    setCurrentAnime(null);
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.src = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <header className="text-center py-8 border-b border-orange-900">
        <h1 className="text-5xl font-bold text-[#ff6600]">🍣 CrunchyFree</h1>
        <p className="mt-2 text-xl text-gray-400">Premium anime. Zero login. Zero paywall.</p>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search anime... (One Piece, Solo Leveling, Jujutsu Kaisen...)"
          className="mt-8 w-full max-w-2xl mx-auto block px-6 py-4 bg-[#1f1f1f] rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {animeList.map((anime) => (
            <div
              key={anime.id}
              onClick={() => playAnime(anime.id)}
              className="group cursor-pointer bg-[#1a1a1a] rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-200"
            >
              <div className="relative">
                <img 
                  src={anime.image} 
                  alt={anime.title}
                  className="w-full aspect-[9/13] object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-xs px-2 py-1 rounded">
                  {anime.episodes?.length || '?'} eps
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg leading-tight group-hover:text-orange-400 transition-colors">
                  {anime.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Player Modal */}
      {currentAnime && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <div>
              <h2 className="text-2xl font-bold">{currentAnime.title}</h2>
              <p className="text-orange-400">Episode {currentAnime.episodes[currentEpisode].number}</p>
            </div>
            <button 
              onClick={closePlayer}
              className="text-4xl leading-none hover:text-orange-400 transition-colors"
            >
              ×
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-black">
            <video 
              ref={videoRef}
              controls 
              autoPlay
              className="max-w-[1100px] w-full rounded-2xl shadow-2xl"
            />
          </div>

          <div className="p-6 border-t border-gray-800 overflow-x-auto">
            <div className="flex gap-3 pb-4">
              {currentAnime.episodes.map((ep, i) => (
                <button
                  key={i}
                  onClick={() => loadEpisode(currentAnime, i)}
                  className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
                    i === currentEpisode 
                      ? 'bg-orange-600 text-white font-bold' 
                      : 'bg-[#252525] hover:bg-[#333] text-gray-300'
                  }`}
                >
                  Ep {ep.number}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
