import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    question: "¿Es DescargaTotal realmente gratuito?",
    answer: "Sí, nuestro servicio es completamente gratuito. No solicitamos ninguna información de pago ni requerimos suscripciones."
  },
  {
    question: "¿Es seguro usar este servicio?",
    answer: "Absolutamente. Priorizamos la seguridad de nuestros usuarios. No almacenamos los videos que descargas ni guardamos un historial de tus descargas. La conexión es segura y protegida."
  },
  {
    question: "¿Necesito instalar algún software?",
    answer: "No, no necesitas instalar nada. DescargaTotal es una herramienta completamente en línea que funciona directamente en tu navegador web."
  },
  {
    question: "¿En qué formatos puedo descargar los videos?",
    answer: "Ofrecemos una variedad de formatos de video y audio, incluyendo MP4, WEBM y MP3. Podrás elegir la calidad y el formato que prefieras antes de iniciar la descarga."
  },
  {
    question: "¿Hay algún límite en la cantidad de videos que puedo descargar?",
    answer: "No, no hay límites. Puedes descargar tantos videos como desees, cuando lo desees."
  },
]

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Preguntas Frecuentes</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Encuentra respuestas a las dudas más comunes sobre nuestro servicio.
          </p>
        </header>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              value={`item-${index}`} 
              key={index}
              className="bg-white dark:bg-black rounded-lg shadow-sm border-none"
            >
              <AccordionTrigger className="group text-left font-semibold text-lg hover:no-underline px-6 py-4 data-[state=open]:text-primary">
                <span className="flex-1">{faq.question}</span>
                <Plus className="h-6 w-6 shrink-0 transition-transform duration-300 ease-in-out group-data-[state=open]:hidden" />
                <Minus className="h-6 w-6 shrink-0 transition-transform duration-300 ease-in-out hidden group-data-[state=open]:block" />
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
