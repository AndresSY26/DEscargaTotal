import { NextRequest, NextResponse } from 'next/server';
import YTDlpWrap from 'yt-dlp-wrap';

// Inicializar yt-dlp-wrap para YouTube
const ytDlpWrap = new YTDlpWrap();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL no proporcionada.' }, { status: 400 });
    }

    if (url.includes('tiktok.com')) {
        // --- LÓGICA FINAL Y ROBUSTA PARA TIKTOK ---
        console.log('Procesando URL de TikTok con @faouzkk/tiktok-dl...');
        
        const tiktokdl = require('@faouzkk/tiktok-dl');
        
        const result = await tiktokdl(url);

        // --- INICIO DE LA CORRECCIÓN ---
        // Verificación robusta para asegurar que la respuesta es válida
        if (!result || !result.video || !result.video.no_watermark) {
            throw new Error("La respuesta de la librería de TikTok no contiene un video válido sin marca de agua.");
        }
        // --- FIN DE LA CORRECCIÓN ---

        const title = result.description || 'Título no disponible';
        const thumbnail = result.video.cover;

        const formats = [];

        // Añadir video sin marca de agua
        formats.push({
            quality: 'Sin Marca de Agua',
            ext: 'mp4',
            url: result.video.no_watermark,
            has_video: true,
            has_audio: true,
            format_id: 'tiktok-nowm',
        });

        // Añadir el audio original (con verificación de seguridad)
        if (result.music && result.music.play_url) {
            formats.push({
                quality: 'Audio Original',
                ext: 'mp3',
                url: result.music.play_url,
                has_video: false,
                has_audio: true,
                format_id: 'tiktok-audio',
            });
        }
        
        return NextResponse.json({
            success: true,
            isTiktok: true,
            title,
            thumbnail,
            formats: formats,
        }, { status: 200 });

    } else {
        // --- LÓGICA GENERAL CON YT-DLP (PARA YOUTUBE) ---
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
    const debugError = (error instanceof Error) ? error.message : String(error);
    return NextResponse.json({
      success: false,
      error: 'No se pudo obtener la información del video.',
      debug_error: debugError,
    }, { status: 500 });
  }
}

export async function GET() {
  return new NextResponse(null, { status: 405, statusText: 'Method Not Allowed' });
}
