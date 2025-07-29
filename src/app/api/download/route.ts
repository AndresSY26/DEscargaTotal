import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import YTDlpWrap from 'yt-dlp-wrap';

const ytDlpWrap = new YTDlpWrap();

async function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'pipe' });

    process.stdout.on('data', (data) => console.log(`stdout: ${data}`));
    process.stderr.on('data', (data) => console.error(`stderr: ${data}`));

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command ${command} failed with code ${code}`));
      }
    });
    
    process.on('error', (err) => {
        reject(new Error(`Failed to start command ${command}: ${err.message}`));
    });
  });
}

export async function POST(req: NextRequest) {
  let tempDir: string | null = null;
  try {
    const body = await req.json();
    const { videoUrl, audioUrl } = body;

    if (!videoUrl || !audioUrl) {
      return NextResponse.json({ success: false, error: 'Faltan las URLs de video o audio.' }, { status: 400 });
    }

    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'descarga-'));
    console.log(`Directorio temporal creado: ${tempDir}`);

    const videoPath = path.join(tempDir, 'video.tmp');
    const audioPath = path.join(tempDir, 'audio.tmp');
    const outputPath = path.join(tempDir, 'output.mp4');

    console.log('Descargando video...');
    await ytDlpWrap.exec([videoUrl, '-o', videoPath]);
    console.log('Descargando audio...');
    await ytDlpWrap.exec([audioUrl, '-o', audioPath]);

    console.log('Uniendo archivos con FFmpeg...');
    await runCommand('ffmpeg', [
      '-i', videoPath,
      '-i', audioPath,
      '-c', 'copy', // Copia los códecs, no recodifica. Es muy rápido.
      '-y', // Sobrescribe el archivo de salida si existe.
      outputPath,
    ]);

    console.log('Enviando archivo final...');
    const finalFileBuffer = await fs.readFile(outputPath);
    
    const headers = new Headers();
    headers.set('Content-Type', 'video/mp4');
    headers.set('Content-Length', finalFileBuffer.length.toString());
    
    return new NextResponse(finalFileBuffer, { status: 200, headers });

  } catch (error) {
    console.error('Error Crítico en /api/download:', error);
    return NextResponse.json({
      success: false,
      error: 'No se pudo procesar la descarga en el servidor.',
      debug_error: (error instanceof Error) ? error.message : String(error),
    }, { status: 500 });
  } finally {
      if(tempDir) {
          try {
            await fs.rm(tempDir, { recursive: true, force: true });
            console.log(`Directorio temporal eliminado: ${tempDir}`);
          } catch(cleanupError) {
              console.error('Error al limpiar el directorio temporal:', cleanupError);
          }
      }
  }
}
