import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import { PassThrough } from 'stream';
import https from 'https';

// Función para obtener un stream desde una URL (soporta https y http)
function getStream(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
        if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            // Manejar redirecciones de TikTok
            return getStream(response.headers.location).then(resolve).catch(reject);
        }
        resolve(response);
    }).on('error', reject);
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get('url');
    const title = searchParams.get('title') || 'audio';
    
    if (!videoUrl) {
      return new Response(JSON.stringify({ success: false, error: 'Falta la URL del video.' }), { status: 400 });
    }

    const videoStream = await getStream(videoUrl);

    // Creamos un stream de paso para enviar el resultado al cliente
    const passThrough = new PassThrough();

    const ffmpeg = spawn('ffmpeg', [
      '-i', 'pipe:3', // Entrada del video desde el pipe 3
      '-vn',          // Descartar el video
      '-acodec', 'libmp3lame', // Usar el codificador MP3 LAME
      '-b:a', '128k', // Bitrate del audio a 128kbps
      '-f', 'mp3',    // Formato de salida MP3
      'pipe:1'        // Salida al pipe 1 (stdout)
    ], {
      stdio: ['pipe', 'pipe', 'pipe', 'pipe'] // stdin, stdout, stderr, pipe3
    });

    // Redirigir el stream del video al pipe de FFmpeg
    videoStream.pipe(ffmpeg.stdio[3] as NodeJS.WritableStream);

    // Redirigir la salida de FFmpeg (el audio MP3) al stream de respuesta
    ffmpeg.stdio[1].pipe(passThrough);
    
    ffmpeg.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
      console.log(`FFmpeg (MP3) se cerró con código ${code}`);
      passThrough.end();
    });

    // Configurar los encabezados para la descarga
    const headers = new Headers();
    const finalFilename = `${title}.mp3`;
    
    headers.set('Content-Disposition', `attachment; filename="${finalFilename}"`);
    headers.set('Content-Type', 'audio/mpeg');

    // @ts-ignore - Necesario para usar el stream en la respuesta
    return new Response(passThrough, { headers });

  } catch (error) {
    console.error('Error en el endpoint de conversión a MP3:', error);
    return new Response(JSON.stringify({
        success: false,
        error: 'No se pudo procesar la conversión a MP3 en el servidor.',
        debug_error: (error instanceof Error) ? error.message : String(error),
    }), { status: 500 });
  }
}
