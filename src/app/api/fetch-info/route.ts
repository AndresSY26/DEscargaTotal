import { NextRequest, NextResponse } from 'next/server';
import YTDlpWrap from 'yt-dlp-wrap';
import path from 'path';

// Nota para la IA: En un entorno de servidor real (VPS), descargarías el binario de yt-dlp.
// En un entorno serverless como este, intentaremos referenciarlo, aunque es probable que falle.
const ytDlpWrap = new YTDlpWrap();

// Configura la ruta al binario si fuera necesario (esto es un ejemplo)
// YTDlpWrap.setBinaryPath(path.resolve('./bin/yt-dlp'));


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL no proporcionada.' }, { status: 400 });
    }

    // yt-dlp puede manejar múltiples plataformas directamente
    console.log(`Procesando URL con yt-dlp: ${url}`);
    
    // Obtener toda la metadata del video en formato JSON
    const metadata = await ytDlpWrap.getVideoInfo(url);
    
    const { title, thumbnail, formats } = metadata;

    // Mapear los formatos a la estructura que el front-end espera
    const processedFormats = formats.map(format => ({
      quality: format.format_note || format.resolution || 'N/A',
      ext: format.ext,
      url: format.url,
      has_audio: format.acodec !== 'none',
      has_video: format.vcodec !== 'none',
      filesize: format.filesize || format.filesize_approx || null
    }));

    return NextResponse.json({
      success: true,
      title,
      thumbnail,
      formats: processedFormats,
    }, { status: 200 });

  } catch (error) {
    console.error('Error Crítico en /api/fetch-info con yt-dlp:', error);
    
    let errorMessage = 'No se pudo obtener la información del video. La herramienta yt-dlp falló en el servidor.';
    let debugError = (error instanceof Error) ? error.message : String(error);

    // yt-dlp suele incluir mensajes de error muy claros
    if (debugError.includes('Unsupported URL')) {
        errorMessage = 'La URL no corresponde a una plataforma compatible.';
    } else if (debugError.includes('403')) {
        errorMessage = 'Acceso prohibido. El video puede ser privado o requerir inicio de sesión.';
    } else if (debugError.includes('hidden')) {
        errorMessage = 'El video de TikTok está oculto o no se pudo encontrar.';
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      debug_error: debugError,
    }, { status: 500 });
  }
}

// Manejar otros métodos HTTP
export async function GET() {
  return new NextResponse(null, { status: 405, statusText: 'Method Not Allowed' });
}
