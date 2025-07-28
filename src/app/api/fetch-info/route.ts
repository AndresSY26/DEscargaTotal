
import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL no proporcionada.' }, { status: 400 });
    }

    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ success: false, error: 'La URL proporcionada no es válida o no es compatible.' }, { status: 400 });
    }

    const info = await ytdl.getInfo(url);
    
    const title = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url; // Get the highest quality thumbnail

    // Filter and map formats to a cleaner structure
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio').map(format => ({
      format_id: format.itag,
      quality: format.qualityLabel || 'N/A',
      ext: format.container,
      vcodec: format.videoCodec || 'none',
      acodec: format.audioCodec || 'none',
      url: format.url,
    }));

    // Add audio-only formats
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly').map(format => ({
      format_id: format.itag,
      quality: 'Audio Only',
      ext: format.container,
      vcodec: 'none',
      acodec: format.audioCodec || 'none',
      bitrate: format.audioBitrate,
      url: format.url,
    }));
    
    const allFormats = [...formats, ...audioFormats].sort((a, b) => (b.quality > a.quality) ? 1 : -1);

    return NextResponse.json({
      success: true,
      title,
      thumbnail,
      formats: allFormats,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching video info:', error);
    let errorMessage = 'No se pudo obtener la información del video. Puede que la URL sea incorrecta o el video no esté disponible.';
    
    // Check for specific error messages to provide better feedback
    if (error instanceof Error) {
        if (error.message.includes('No video id found')) {
            errorMessage = 'La URL no parece ser un video válido.';
        } else if (error.message.includes('Private video')) {
            errorMessage = 'Este video es privado y no se puede acceder a él.';
        } else if (error.message.includes('Video unavailable')) {
            errorMessage = 'Este video no está disponible.';
        }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
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
