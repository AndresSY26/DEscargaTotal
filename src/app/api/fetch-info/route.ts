import { NextRequest, NextResponse } from 'next/server';
import { Innertube, UniversalCache } from 'youtubei.js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL no proporcionada.' }, { status: 400 });
    }

    // --- IDENTIFICACIÓN DE PLATAFORMA ---

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // --- LÓGICA PARA YOUTUBE ---
      
      console.log('Procesando URL de YouTube...');
      
      // SOLUCIÓN: Usar 'generate_session_locally' para crear una sesión de visitante válida.
      // Esto simula ser un nuevo cliente y es el método recomendado en los ejemplos oficiales.
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

      return NextResponse.json({
        success: true,
        title,
        thumbnail,
        formats: formats,
      }, { status: 200 });

    } else if (url.includes('tiktok.com')) {
      // --- LÓGICA PARA TIKTOK (A IMPLEMENTAR) ---
      console.log('URL de TikTok detectada. Funcionalidad no implementada.');
      // TODO: Aquí se implementaría la lógica con una librería para TikTok.
      return NextResponse.json({ success: false, error: 'Las descargas de TikTok aún no son compatibles.' }, { status: 501 });

    } else if (url.includes('instagram.com')) {
      // --- LÓGICA PARA INSTAGRAM (A IMPLEMENTAR) ---
      console.log('URL de Instagram detectada. Funcionalidad no implementada.');
      // TODO: Aquí se implementaría la lógica con una librería para Instagram.
      return NextResponse.json({ success: false, error: 'Las descargas de Instagram aún no son compatibles.' }, { status: 501 });

    } else {
      return NextResponse.json({ success: false, error: 'La URL no corresponde a una plataforma compatible.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error Crítico en /api/fetch-info:', error);
    return NextResponse.json({
      success: false,
      error: 'No se pudo obtener la información del video. La URL puede ser incorrecta o el video no está disponible para el servidor.',
      debug_error: (error instanceof Error) ? error.message : String(error),
    }, { status: 500 });
  }
}

// Manejar otros métodos HTTP para que no queden desatendidos
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
