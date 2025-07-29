"use client";

import Image from 'next/image';
import { Download, Clapperboard, Music } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Format = {
  quality: string;
  ext: string;
  url: string;
  has_audio: boolean;
  has_video: boolean;
  filesize: number | null;
};

type DownloadOptionsProps = {
  info: {
    success: boolean;
    title: string;
    thumbnail: string;
    formats: Format[];
  };
};

// Función para formatear el tamaño del archivo
const formatFileSize = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined || bytes === 0) {
    return 'N/A';
  }
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
};

export function DownloadOptions({ info }: DownloadOptionsProps) {
  
  const videoFormats = info.formats.filter(f => f.has_video).sort((a,b) => (b.filesize || 0) - (a.filesize || 0));
  const audioFormats = info.formats.filter(f => f.has_audio && !f.has_video).sort((a,b) => (b.filesize || 0) - (a.filesize || 0));

  const handleDownload = (format: Format) => {
    // Crear un enlace oculto para iniciar la descarga
    const link = document.createElement('a');
    link.href = format.url;
    // Sugerir un nombre de archivo al navegador
    link.setAttribute('download', `${info.title} - ${format.quality}.${format.ext}`);
    // Ocultar el enlace
    link.style.display = 'none';
    // Añadir el enlace al DOM
    document.body.appendChild(link);
    // Simular un clic para iniciar la descarga
    link.click();
    // Limpiar eliminando el enlace del DOM
    document.body.removeChild(link);
  };

  const renderFormatTable = (formats: Format[], type: 'video' | 'audio') => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Calidad</TableHead>
            <TableHead>Formato</TableHead>
            <TableHead>Tamaño</TableHead>
            <TableHead className="text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formats.map((format, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {format.quality}
                {type === 'video' && !format.has_audio && <Badge variant="destructive" className="ml-2">Sin Audio</Badge>}
              </TableCell>
              <TableCell>{format.ext}</TableCell>
              <TableCell>{formatFileSize(format.filesize)}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" onClick={() => handleDownload(format)}>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="w-full bg-white dark:bg-black/50 border-primary/20 shadow-xl animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 lg:w-1/4">
            <Image
              src={info.thumbnail}
              alt={`Miniatura de ${info.title}`}
              width={320}
              height={180}
              className="rounded-lg object-cover w-full aspect-video"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-bold line-clamp-2" title={info.title}>
              {info.title}
            </h2>

            <Tabs defaultValue="video" className="mt-4">
              <TabsList>
                <TabsTrigger value="video">
                  <Clapperboard className="mr-2 h-4 w-4" /> Video
                </TabsTrigger>
                <TabsTrigger value="audio">
                  <Music className="mr-2 h-4 w-4" /> Audio
                </TabsTrigger>
              </TabsList>
              <TabsContent value="video" className="mt-4">
                {videoFormats.length > 0 ? (
                  renderFormatTable(videoFormats, 'video')
                ) : (
                  <p className="text-muted-foreground text-center p-8">No hay formatos de video disponibles.</p>
                )}
              </TabsContent>
              <TabsContent value="audio" className="mt-4">
                {audioFormats.length > 0 ? (
                  renderFormatTable(audioFormats, 'audio')
                ) : (
                  <p className="text-muted-foreground text-center p-8">No hay formatos de solo audio disponibles.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
