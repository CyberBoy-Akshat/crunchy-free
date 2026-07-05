let currentAnime = null;

async function searchAnime(query) {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  renderCatalog(data);
}

async function loadCatalog() {
  const res = await fetch('/api/catalog');
  const data = await res.json();
  renderCatalog(data);
}

function renderCatalog(animeList) {
  const container = document.getElementById('catalog');
  container.innerHTML = animeList.map(anime => `
    <div class="card" onclick="playAnime('${anime.id}')">
      <img src="${anime.image}" alt="${anime.title}">
      <div class="info">
        <h3>${anime.title}</h3>
        <p>${anime.season || ''} • ${anime.episodes || '?'} eps</p>
      </div>
    </div>
  `).join('');
}

async function playAnime(id) {
  const res = await fetch(`/api/catalog?id=${id}`);
  currentAnime = await res.json();
  
  document.getElementById('player').classList.remove('hidden');
  document.getElementById('episodes').innerHTML = currentAnime.episodes.map((ep, i) => `
    <button onclick="loadEpisode(${i})" style="margin:5px;padding:10px 16px;background:#ff6600;color:white;border:none;border-radius:6px;cursor:pointer">
      Episode ${ep.number}: ${ep.title}
    </button>
  `).join('');
  
  if (currentAnime.episodes.length > 0) {
    loadEpisode(0);
  }
}

async function loadEpisode(index) {
  const ep = currentAnime.episodes[index];
  const res = await fetch(`/api/stream?url=${encodeURIComponent(ep.streamUrl)}`);
  const data = await res.json();
  
  const video = document.getElementById('video');
  
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(data.stream);
    hls.attachMedia(video);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = data.stream;
  }
}

function closePlayer() {
  document.getElementById('player').classList.add('hidden');
  const video = document.getElementById('video');
  video.pause();
  video.src = '';
}

// Search functionality
document.getElementById('search').addEventListener('input', (e) => {
  if (e.target.value.length > 2) {
    searchAnime(e.target.value);
  } else if (e.target.value.length === 0) {
    loadCatalog();
  }
});

// Initial load
loadCatalog();
