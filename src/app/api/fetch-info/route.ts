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

    if (url.includes('tiktok.com')) {
        // --- LÓGICA ESPECIALIZADA PARA TIKTOK ---
        console.log('Procesando URL de TikTok con librería especializada...');
        
        // Importar la nueva librería
        const { dl } = await import('@tobyg74/tiktok-api-dl');
        
        const result = await dl(url, {
            version: 'v2' // Usar la versión 2 del API de TikTok
        });

        if (result.status !== 'success' || !result.result) {
            throw new Error('La librería de TikTok no pudo obtener la información.');
        }

        const title = result.result.description || 'Título no disponible';
        const thumbnail = result.result.video.cover;

        const formats = [];

        // Añadir video sin marca de agua
        if (result.result.video.nowatermark) {
            formats.push({
                quality: 'Sin Marca de Agua',
                ext: 'mp4',
                url: result.result.video.nowatermark,
                has_video: true,
                has_audio: true, // Los videos de TikTok suelen tener audio
                format_id: 'tiktok-nowm',
            });
        }

        // Añadir el audio original
        if (result.result.music.play_url) {
            formats.push({
                quality: 'Audio Original',
                ext: 'mp3', // Se puede forzar a mp3 en la descarga
                url: result.result.music.play_url,
                has_video: false,
                has_audio: true,
                format_id: 'tiktok-audio',
            });
        }
        
        return NextResponse.json({
            success: true,
            isTiktok: true, // Añadimos un indicador para el front-end
            title,
            thumbnail,
            formats: formats,
        }, { status: 200 });
    } else {
        // --- LÓGICA GENERAL CON YT-DLP (PARA YOUTUBE Y OTROS) ---
        console.log(`Procesando URL con yt-dlp: ${url}`);
        const metadata = await ytDlpWrap.getVideoInfo(url);
        const { title, thumbnail, formats } = metadata;

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
          isTiktok: false,
        }, { status: 200 });
    }

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
    } else if (debugError.includes('La librería de TikTok')) {
        errorMessage = 'No se pudo obtener la información de TikTok. El video podría no estar disponible.';
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
