export default async function handler(req, res) {
  const { q } = req.query;
  // In real version this would scrape https://www.crunchyroll.com/search?q=...
  // For demo we return matches
  res.json([
    { id: "one-piece", title: "One Piece", image: "https://picsum.photos/id/1015/300/400" },
    { id: "jujutsu-kaisen", title: "Jujutsu Kaisen Season 2", image: "https://picsum.photos/id/201/300/400" },
  ].filter(a => a.title.toLowerCase().includes(q.toLowerCase())));
}
