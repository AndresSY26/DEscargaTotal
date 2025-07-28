import { NextRequest, NextResponse } from 'next/server';
import { Innertube, UniversalCache } from 'youtubei.js';

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

    const yt = await Innertube.create({ cache: new UniversalCache() });
    const info = await yt.getBasicInfo(url);
    
    const title = info.basic_info.title ?? 'Título no disponible';
    const thumbnail = info.basic_info.thumbnail?.at(0)?.url ?? '';
    const streamingData = info.streaming_data;

    if (!streamingData) {
      throw new Error('No se encontraron datos de streaming.');
    }
    
    const formats = (streamingData.formats || []).map(format => ({
      format_id: format.itag,
      quality: format.quality_label ?? 'N/A',
      ext: format.mime_type?.split(';')[0].split('/')[1] ?? 'unknown',
      vcodec: format.video_codec ?? 'none',
      acodec: format.audio_codec ?? 'none',
      url: format.url,
    })).sort((a,b) => (b.quality > a.quality) ? 1 : -1);

    const adaptiveFormats = (streamingData.adaptive_formats || []).map(format => {
      const isVideo = !!format.video_codec;
      const isAudio = !!format.audio_codec;
      return {
        format_id: format.itag,
        quality: isVideo ? format.quality_label ?? 'N/A' : `Audio Only (${format.audio_sample_rate}Hz)`,
        ext: format.mime_type?.split(';')[0].split('/')[1] ?? 'unknown',
        vcodec: format.video_codec ?? 'none',
        acodec: format.audio_codec ?? 'none',
        bitrate: format.bitrate,
        url: format.url,
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
        } else if (error.message.toLowerCase().includes('unsupported url')) {
            errorMessage = 'La plataforma de esta URL no es compatible actualmente.';
        }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      debug_error: (error instanceof Error) ? error.message : String(error)
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
