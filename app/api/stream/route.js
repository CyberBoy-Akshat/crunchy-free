import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let url = searchParams.get('url');

  // This is where real proxy logic would live.
  // For now we return a public test HLS stream so it actually plays something.
  // Replace with real Crunchyroll m3u8 proxy in production.
  const testStream = "https://test-streams.mux.dev/x264_720p_1500kbps_30fps.mp4";

  return NextResponse.json({ 
    stream: testStream,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Referer": "https://www.crunchyroll.com"
    }
  });
}
