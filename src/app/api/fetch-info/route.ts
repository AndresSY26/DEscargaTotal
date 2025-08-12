import { NextRequest, NextResponse } from 'next/server';
import YTDlpWrap from 'yt-dlp-wrap';
import * as Tiktok from '@tobyg74/tiktok-api-dl';

// Se mantiene yt-dlp-wrap para YouTube y otras plataformas
const ytDlpWrap = new YTDlpWrap();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL no proporcionada.' }, { status: 400 });
    }

    // --- LÓGICA DIFERENCIADA ---
    if (url.includes('tiktok.com')) {
        // --- NUEVA LÓGICA EXCLUSIVA PARA TIKTOK ---
        console.log(`Procesando URL de TikTok con @tobyg74/tiktok-api-dl: ${url}`);
        
        const result = await Tiktok.Downloader(url, { version: "v1" });
        
        if (result.status !== 'success' || !result.result) {
            throw new Error(result.message || 'La librería de TikTok no pudo obtener datos.');
        }

        const videoInfo = result.result;
        const formats = [];

        // Añadir video sin marca de agua (si está disponible)
        if (videoInfo.video?.download_addr) {
            formats.push({
                quality: 'Sin Marca de Agua',
                ext: 'mp4',
                url: videoInfo.video.download_addr,
                has_video: true,
                has_audio: true,
                filesize: videoInfo.video.size,
                format_id: 'tiktok-nowm',
            });
        }
        
        // Añadir audio (si está disponible)
        if (videoInfo.music?.play_url) {
            formats.push({
                quality: 'Audio Original',
                ext: 'mp3',
                url: videoInfo.music.play_url,
                has_video: false,
                has_audio: true,
                filesize: videoInfo.music.size,
                format_id: 'tiktok-audio',
            });
        }
        
        if (formats.length === 0) {
          throw new Error("No se encontraron formatos descargables para este TikTok.");
        }

        return NextResponse.json({
            success: true,
            isTiktok: true,
            title: videoInfo.description || 'Video de TikTok',
            thumbnail: videoInfo.video?.cover,
            formats: formats,
            originalUrl: url,
        }, { status: 200 });

    } else {
        // --- LÓGICA ORIGINAL PARA YOUTUBE (SIN NINGÚN CAMBIO) ---
        console.log(`Procesando URL con yt-dlp: ${url}`);
        const metadata = await ytDlpWrap.getVideoInfo(url);
        const { title, thumbnail, formats } = metadata;

        const processedFormats = formats.map((format: any) => ({
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
          isTiktok: false,
          title,
          thumbnail,
          formats: processedFormats,
          originalUrl: url,
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
