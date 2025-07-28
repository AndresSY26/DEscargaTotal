import { Download, ClipboardPaste, ListVideo } from 'lucide-react';
import { DownloadForm } from '@/components/download-form';
import { PlatformCard } from '@/components/platform-card';

const platforms = [
  {
    name: 'YouTube',
    description: 'Descarga videos y audios en múltiples formatos.',
    icon: 'youtube',
  },
  {
    name: 'TikTok',
    description: 'Baja tus TikToks favoritos sin marca de agua.',
    icon: 'tiktok',
  },
  {
    name: 'Instagram',
    description: 'Guarda videos y reels de Instagram fácilmente.',
    icon: 'instagram',
  },
];

const instructions = [
  {
    icon: <ClipboardPaste className="h-12 w-12 mb-4 text-primary" />,
    title: '1. Pega el enlace',
    description: 'Copia la URL del video o audio que deseas y pégala en el campo de arriba.',
  },
  {
    icon: <ListVideo className="h-12 w-12 mb-4 text-primary" />,
    title: '2. Elige el formato',
    description: 'Selecciona el formato de archivo y la calidad que mejor se adapte a tus necesidades.',
  },
  {
    icon: <Download className="h-12 w-12 mb-4 text-primary" />,
    title: '3. Descarga',
    description: 'Haz clic en descargar y guarda el archivo directamente en tu dispositivo. ¡Gratis y rápido!',
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <section className="text-center mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-flow bg-clip-text text-transparent">
          Descarga Videos y Audios de tus Plataformas Favoritas
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Un servicio gratuito, rápido y fácil de usar para obtener tu contenido preferido sin complicaciones. Pega un enlace y comienza.
        </p>
      </section>

      <section className="mb-16 md:mb-24 max-w-3xl mx-auto">
        <DownloadForm />
      </section>

      <section className="mb-16 md:mb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Plataformas Compatibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {platforms.map((platform) => (
            <PlatformCard key={platform.name} {...platform} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">¿Cómo Funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {instructions.map((step) => (
            <div key={step.title} className="flex flex-col items-center">
              <div className="p-4 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-full mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
