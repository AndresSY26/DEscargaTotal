import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get('url');
    const title = searchParams.get('title') || 'audio';
    const ext = searchParams.get('ext') || 'm4a';

    if (!fileUrl) {
      return NextResponse.json({ error: 'URL del archivo no proporcionada.' }, { status: 400 });
    }

    // Hacemos la petición al servidor de origen desde nuestro back-end
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Error al descargar el archivo: ${response.statusText}`);
    }

    // Obtenemos los datos como un ReadableStream
    const stream = response.body;

    // Creamos los encabezados para forzar la descarga en el navegador
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${title}.${ext}"`);
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
    const contentLength = response.headers.get('Content-Length');
    if (contentLength) {
        headers.set('Content-Length', contentLength);
    }


    // Enviamos el stream de datos de vuelta al navegador
    // @ts-ignore
    return new NextResponse(stream, { headers });

  } catch (error) {
    console.error('Error en el proxy de descarga:', error);
    return NextResponse.json({
      error: 'No se pudo procesar la descarga a través del servidor.',
      debug_error: (error instanceof Error) ? error.message : String(error)
    }, { status: 500 });
  }
}
