import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Preguntas Frecuentes (FAQ)</h1>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
