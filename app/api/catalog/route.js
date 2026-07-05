import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const anime = {
      id,
      title: id === "one-piece" ? "One Piece" : id === "jujutsu-kaisen" ? "Jujutsu Kaisen" : "Solo Leveling",
      image: "https://picsum.photos/id/1015/300/400",
      episodes: Array.from({ length: 24 }, (_, i) => ({
        number: i + 1,
        title: `Episode ${i + 1}`,
        streamUrl: `https://proxy.crunchyroll.stream/${id}/${i + 1}`
      }))
    };
    return NextResponse.json(anime);
  }

  const catalog = [
    { id: "one-piece", title: "One Piece", image: "https://picsum.photos/id/1015/300/400", episodes: 1120 },
    { id: "jujutsu-kaisen", title: "Jujutsu Kaisen", image: "https://picsum.photos/id/201/300/400", episodes: 47 },
    { id: "solo-leveling", title: "Solo Leveling", image: "https://picsum.photos/id/301/300/400", episodes: 25 },
    { id: "chainsaw-man", title: "Chainsaw Man", image: "https://picsum.photos/id/401/300/400", episodes: 12 },
    { id: "demon-slayer", title: "Demon Slayer", image: "https://picsum.photos/id/501/300/400", episodes: 55 },
    { id: "attack-on-titan", title: "Attack on Titan", image: "https://picsum.photos/id/601/300/400", episodes: 89 },
  ];

  return NextResponse.json(catalog);
}
