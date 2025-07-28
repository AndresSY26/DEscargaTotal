import { NextRequest, NextResponse } from 'next/server';
import YouTube from 'youtubei.js';

/**
 * Parses a Netscape cookie file string into a format suitable for an HTTP Cookie header.
 * @param cookieText The raw text from the cookies.txt file.
 * @returns A formatted cookie string (e.g., "key=value; key2=value2").
 */
function parseNetscapeCookies(cookieText: string | undefined): string {
  if (!cookieText) return '';

  return cookieText
    .split('\n')
    .map(line => line.trim())
    // Ignore comments and empty lines
    .filter(line => line.length > 0 && !line.startsWith('#'))
    .map(line => {
      const parts = line.split('\t');
      // A valid Netscape line has 7 parts. The name is at index 5 and value at index 6.
      if (parts.length === 7) {
        return `${parts[5]}=${parts[6]}`;
      }
      return null;
    })
    .filter(cookie => cookie !== null)
    .join('; ');
}

export async function POST(req: NextRequest) {
  if (!process.env.YOUTUBE_COOKIES) {
    console.error('Error: Las cookies de YouTube no están configuradas en el servidor.');
    return NextResponse.json({ success: false, error: 'La configuración del servidor está incompleta.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL no proporcionada.' }, { status: 400 });
    }
    
    // 1. Parse the cookies from the environment variable
    const formattedCookies = parseNetscapeCookies(process.env.YOUTUBE_COOKIES);

    // 2. Create the YouTube instance with the formatted cookies
    const youtube = await YouTube.create({ cookie: formattedCookies });

    // 3. Get video info
    const info = await youtube.getBasicInfo(url);

    const title = info.basic_info.title ?? 'Título no disponible';
    const thumbnail = info.basic_info.thumbnail?.url ?? '';
    
    // 4. Process and return formats (example structure)
    const formats = info.streaming_data?.formats.map(format => ({
      quality: format.quality_label,
      ext: format.mime_type?.split(';')[0].split('/')[1] ?? 'N/A',
      url: format.url,
    })) ?? [];

    return NextResponse.json({
      success: true,
      title,
      thumbnail,
      formats,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching video info:', error);
    return NextResponse.json({
      success: false,
      error: 'No se pudo obtener la información del video.',
      debug_error: (error instanceof Error) ? error.message : String(error),
    }, { status: 500 });
  }
}

// Handle other methods by returning 405 Method Not Allowed
export async function GET() {
  return new NextResponse(null, { status: 405, statusText: 'Method Not Allowed' });
}
export async function PUT() {
  return new NextResponse(null, { status: 405, statusText: 'Method Not Allowed' });
}
export async function DELETE() {
  return new NextResponse(null, { status: 405, statusText: 'Method Not Allowed' });
}
export async function PATCH() {
    return new NextResponse(null, { status: 405, statusText: 'Method Not Allowed' });
}
