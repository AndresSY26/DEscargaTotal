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
    icon: <ClipboardPaste className="h-12 w-12" />,
    title: '1. Pega el enlace',
    description: 'Copia la URL del video o audio que deseas y pégala en el campo de arriba.',
  },
  {
    icon: <ListVideo className="h-12 w-12" />,
    title: '2. Elige el formato',
    description: 'Selecciona el formato de archivo y la calidad que mejor se adapte a tus necesidades.',
  },
  {
    icon: <Download className="h-12 w-12" />,
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
          {instructions.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center">
              {index < instructions.length - 1 && (
                <div className="absolute top-12 left-1/2 w-full h-px -translate-x-1/2 hidden md:block">
                  <svg width="100%" height="2">
                    <line x1="55%" y1="0" x2="145%" y2="0" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 4" />
                  </svg>
                </div>
              )}
               <div className="p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/10 dark:border-white/5 rounded-full mb-6 text-primary">
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
