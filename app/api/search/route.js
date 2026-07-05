import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  const allAnime = [
    { id: "one-piece", title: "One Piece", image: "https://picsum.photos/id/1015/300/400" },
    { id: "jujutsu-kaisen", title: "Jujutsu Kaisen", image: "https://picsum.photos/id/201/300/400" },
    { id: "solo-leveling", title: "Solo Leveling", image: "https://picsum.photos/id/301/300/400" },
    { id: "chainsaw-man", title: "Chainsaw Man", image: "https://picsum.photos/id/401/300/400" },
    { id: "demon-slayer", title: "Demon Slayer: Kimetsu no Yaiba", image: "https://picsum.photos/id/501/300/400" },
  ];

  const filtered = allAnime.filter(a => a.title.toLowerCase().includes(q));
  return NextResponse.json(filtered.length > 0 ? filtered : allAnime);
}
