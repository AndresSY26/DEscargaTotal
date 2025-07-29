import { NextRequest, NextResponse } from 'next/server';
import YTDlpWrap from 'yt-dlp-wrap';

// Inicializar una única vez para reutilizar la instancia
const ytDlpWrap = new YTDlpWrap();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL no proporcionada.' }, { status: 400 });
    }
    
    console.log(`Procesando URL con yt-dlp: ${url}`);
    const metadata = await ytDlpWrap.getVideoInfo(url);
    const { title, thumbnail, formats } = metadata;
    const isTiktok = url.includes('tiktok.com');

    const processedFormats = formats.map(format => ({
      quality: format.format_note || format.resolution || 'N/A',
      ext: format.ext,
      url: format.url,
      has_audio: format.acodec !== 'none',
      has_video: format.vcodec !== 'none',
      filesize: format.filesize || format.filesize_approx || null,
      format_id: format.format_id,
    }));

    return NextResponse.json({
      success: true,
      title,
      thumbnail,
      formats: processedFormats,
      isTiktok, // Enviamos esta bandera al front-end
    }, { status: 200 });

  } catch (error) {
    console.error('Error Crítico en /api/fetch-info:', error);
    
    let errorMessage = 'No se pudo obtener la información del video.';
    let debugError = (error instanceof Error) ? error.message : String(error);

    if (debugError.includes('Unsupported URL')) {
        errorMessage = 'La URL no corresponde a una plataforma compatible.';
    } else if (debugError.includes('403')) {
        errorMessage = 'Acceso prohibido. El video puede ser privado o requerir inicio de sesión.';
    } else if (debugError.includes('HTTP error 404')) {
        errorMessage = 'El video no fue encontrado o fue eliminado.';
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      debug_error: debugError,
    }, { status: 500 });
  }
}

export async function GET() {
  return new NextResponse(null, { status: 405, statusText: 'Method Not Allowed' });
}
