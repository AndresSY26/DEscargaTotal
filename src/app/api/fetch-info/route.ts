import { NextRequest, NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js';

function validateYouTubeUrl(url: string): boolean {
  if (!url) return false;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL no proporcionada.' }, { status: 400 });
    }

    if (!validateYouTubeUrl(url)) {
      return NextResponse.json({ success: false, error: 'La URL proporcionada no es válida o no es de YouTube.' }, { status: 400 });
    }

    const yt = await Innertube.create();
    const info = await yt.getBasicInfo(url);
    
    const title = info.basic_info.title ?? 'Título no disponible';
    const thumbnail = info.basic_info.thumbnail?.[0]?.url ?? '';
    const streamingData = info.streaming_data;

    if (!streamingData) {
      throw new Error('No se encontraron datos de streaming.');
    }

    const formats = (streamingData.formats || []).map(format => ({
      format_id: format.itag,
      quality: format.quality_label ?? 'N/A',
      ext: format.mime_type?.split(';')[0].split('/')[1] ?? 'unknown',
      vcodec: format.mime_type?.includes('video') ? format.video_codec ?? 'N/A' : 'none',
      acodec: format.mime_type?.includes('audio') ? format.audio_codec ?? 'N/A' : 'none',
      url: format.decipher(yt.session.player),
    })).sort((a,b) => (b.quality > a.quality) ? 1 : -1);

    const adaptiveFormats = (streamingData.adaptive_formats || []).map(format => {
      const isVideo = format.mime_type?.includes('video');
      const isAudio = format.mime_type?.includes('audio');
      return {
        format_id: format.itag,
        quality: isVideo ? format.quality_label ?? 'N/A' : `Audio Only (${format.audio_sample_rate}Hz)`,
        ext: format.mime_type?.split(';')[0].split('/')[1] ?? 'unknown',
        vcodec: isVideo ? format.video_codec ?? 'N/A' : 'none',
        acodec: isAudio ? format.audio_codec ?? 'N/A' : 'none',
        bitrate: format.bitrate,
        url: format.decipher(yt.session.player),
      }
    });

    const audioFormats = adaptiveFormats.filter(f => f.acodec !== 'none' && f.vcodec === 'none');
    const videoFormats = adaptiveFormats.filter(f => f.vcodec !== 'none' && f.acodec === 'none');

    const allFormats = [...formats, ...videoFormats, ...audioFormats];

    return NextResponse.json({
      success: true,
      title,
      thumbnail,
      formats: allFormats,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching video info:', error);
    
    let errorMessage = 'No se pudo obtener la información del video. Puede que la URL sea incorrecta o el video no esté disponible.';
    if (error instanceof Error) {
        if (error.message.includes('private')) {
            errorMessage = 'Este video es privado y no se puede acceder a él.';
        } else if (error.message.includes('unavailable')) {
            errorMessage = 'Este video no está disponible.';
        } else if (error.message.includes('This video is unavailable')) {
             errorMessage = 'Este video no está disponible.';
        }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
    }, { status: 500 });
  }
}

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
