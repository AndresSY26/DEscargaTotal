import { Rocket, BookOpen, ShieldCheck } from 'lucide-react';

const sections = [
  {
    icon: <Rocket className="h-10 w-10 text-primary" />,
    title: 'Nuestra Misión',
    content: [
      'Nuestra misión es proporcionar una herramienta accesible y eficiente que permita a los usuarios guardar su contenido preferido sin complicaciones, sin necesidad de registros y sin software adicional.',
      'Creemos en un internet abierto donde el acceso a la información y al entretenimiento sea lo más simple posible.',
    ],
  },
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: 'Nuestra Historia',
    content: [
      'DescargaTotal nació de una necesidad simple: queríamos una forma fácil de guardar videos educativos, tutoriales, y clips divertidos para verlos sin conexión. Al darnos cuenta de que muchas soluciones existentes eran complicadas, lentas o estaban llenas de publicidad intrusiva, decidimos crear la nuestra.',
      'Con un equipo de desarrolladores y diseñadores apasionados, nos propusimos construir una plataforma que fuera no solo funcional, sino también agradable de usar. Nos enfocamos en un diseño limpio, una experiencia de usuario intuitiva y un rendimiento de alta velocidad.',
    ],
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Nuestro Compromiso',
    content: [
      'Estamos comprometidos con la mejora continua de DescargaTotal. Escuchamos activamente los comentarios de nuestra comunidad para añadir nuevas funcionalidades, soportar más plataformas y asegurar que nuestro servicio siga siendo el mejor en su clase.',
      'Gracias por elegirnos. ¡Esperamos que disfrutes de la experiencia!',
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Quiénes Somos
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Bienvenido a DescargaTotal, tu solución definitiva para descargar videos y audios de tus plataformas favoritas.
          </p>
        </header>

        <div className="space-y-16">
          {sections.map((section) => (
            <section key={section.title} className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 flex items-center justify-center rounded-full bg-white dark:bg-black shadow-lg">
                  {section.icon}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{section.title}</h2>
                <div className="space-y-4 text-muted-foreground">
                  {section.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}