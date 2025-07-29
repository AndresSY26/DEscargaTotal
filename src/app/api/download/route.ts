import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import { PassThrough } from 'stream';
import https from 'https';
import http from 'http';

// Función para obtener un stream desde una URL (soporta http y https)
function getStream(url: string): Promise<http.IncomingMessage> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Manejar redirecciones
        return getStream(response.headers.location).then(resolve).catch(reject);
      }
      resolve(response);
    }).on('error', reject);
  });
}

export async function POST(req: NextRequest) {
  try {
    const { videoUrl, audioUrl, title, quality, ext } = await req.json();

    if (!videoUrl || !audioUrl) {
      return new Response(JSON.stringify({ success: false, error: 'Faltan las URLs de video o audio.' }), { status: 400 });
    }

    const videoStream = await getStream(videoUrl);
    const audioStream = await getStream(audioUrl);

    // Creamos un stream de paso para enviar el resultado al cliente
    const passThrough = new PassThrough();

    const ffmpeg = spawn('ffmpeg', [
      '-i', 'pipe:3', // Entrada de video desde el pipe 3
      '-i', 'pipe:4', // Entrada de audio desde el pipe 4
      '-c', 'copy',   // Copiar los códecs sin recodificar (muy rápido)
      '-f', 'matroska', // Usar contenedor mkv por compatibilidad
      'pipe:1'        // Salida al pipe 1 (stdout)
    ], {
      stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'pipe'] // stdin, stdout, stderr, pipe3, pipe4
    });

    // Redirigir los streams de video y audio a los pipes de FFmpeg
    videoStream.pipe(ffmpeg.stdio[3] as NodeJS.WritableStream);
    audioStream.pipe(ffmpeg.stdio[4] as NodeJS.WritableStream);

    // Redirigir la salida de FFmpeg (el video unido) al stream de respuesta
    ffmpeg.stdio[1].pipe(passThrough);
    
    // Opcional: Escuchar por errores de FFmpeg
    ffmpeg.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
      console.log(`FFmpeg se cerró con código ${code}`);
      passThrough.end();
    });

    // Configurar los encabezados para la descarga
    const headers = new Headers();
    const safeTitle = (title || 'video').replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_');
    const finalFilename = `${safeTitle}_${quality}.mkv`;
    
    headers.set('Content-Disposition', `attachment; filename="${finalFilename}"`);
    headers.set('Content-Type', 'video/x-matroska');

    // @ts-ignore - Necesario para usar el stream en la respuesta
    return new Response(passThrough, { headers });

  } catch (error) {
    console.error('Error en el endpoint de descarga por streaming:', error);
    return new Response(JSON.stringify({
        success: false,
        error: 'No se pudo procesar la descarga en el servidor.',
        debug_error: (error instanceof Error) ? error.message : String(error),
    }), { status: 500 });
  }
}
