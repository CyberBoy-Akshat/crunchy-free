export default async function handler(req, res) {
  const { url } = req.query;
  
  // Real proxy logic would go here - this is the core that bypasses premium
  // In production you would use a real m3u8 proxy or CDN mirror
  const streamUrl = url.replace('crunchyroll.com', 'free-proxy.mirror') + '/master.m3u8';
  
  res.json({ 
    stream: streamUrl,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Referer": "https://www.crunchyroll.com"
    }
  });
}
