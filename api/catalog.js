import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (id) {
    // Return full anime with episode list (scraped or proxied)
    const anime = {
      id,
      title: "Example Premium Title",
      image: "https://picsum.photos/300/400",
      episodes: Array.from({length: 24}, (_, i) => ({
        number: i+1,
        title: `Episode ${i+1}`,
        streamUrl: `https://proxy.crunchyroll.stream/episode/${id}/${i+1}`
      }))
    };
    return res.json(anime);
  }

  // Popular catalog
  const popular = [
    { id: "one-piece", title: "One Piece", image: "https://picsum.photos/id/1015/300/400", episodes: 1100 },
    { id: "jujutsu-kaisen", title: "Jujutsu Kaisen", image: "https://picsum.photos/id/201/300/400", episodes: 47 },
    { id: "solo-leveling", title: "Solo Leveling", image: "https://picsum.photos/id/301/300/400", episodes: 12 },
    { id: "chainsaw-man", title: "Chainsaw Man", image: "https://picsum.photos/id/401/300/400", episodes: 12 },
    // Add hundreds more - this is just starter
  ];
  
  res.json(popular);
}
