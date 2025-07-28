import { NextRequest, NextResponse } from 'next/server';
import { Innertube, UniversalCache } from 'youtubei.js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL no proporcionada.' }, { status: 400 });
    }
    
    // SOLUCIÓN: Crear una instancia de Innertube generando una sesión localmente
    const youtube = await Innertube.create({ 
      cache: new UniversalCache(false), 
      generate_session_locally: true 
    });

    const info = await youtube.getBasicInfo(url);

    const title = info.basic_info.title ?? 'Título no disponible';
    const thumbnail = info.basic_info.thumbnail?.url ?? '';
    
    const formats = info.streaming_data?.formats.map(format => ({
      quality: format.quality_label,
      ext: format.mime_type?.split(';')[0].split('/')[1] ?? 'N/A',
      url: format.url,
      has_audio: format.has_audio,
      has_video: format.has_video
    })) ?? [];

    // Separar solo audio y solo video si es necesario o unirlos
    const videoAndAudioFormats = formats.filter(f => f.has_video && f.has_audio);
    const audioOnlyFormats = formats.filter(f => f.has_audio && !f.has_video);
    const videoOnlyFormats = formats.filter(f => f.has_video && !f.has_audio);

    return NextResponse.json({
      success: true,
      title,
      thumbnail,
      // Devuelve los formatos de una manera que el front-end pueda entender
      formats: {
          videoAndAudio: videoAndAudioFormats,
          audioOnly: audioOnlyFormats,
          videoOnly: videoOnlyFormats
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching video info:', error);
    return NextResponse.json({
      success: false,
      error: 'No se pudo obtener la información del video. Puede que el video no esté disponible o la URL sea incorrecta.',
      debug_error: (error instanceof Error) ? error.message : String(error),
    }, { status: 500 });
  }
}

// Manejar otros métodos
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
