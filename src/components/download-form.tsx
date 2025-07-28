"use client";

import { useState, useMemo, type FormEvent } from 'react';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";

// A more flexible regex that validates most URLs, including query parameters.
const URL_REGEX = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

type FormState = 'idle' | 'loading' | 'error' | 'success';

export function DownloadForm() {
  const [url, setUrl] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const { toast } = useToast();

  const isUrlValid = useMemo(() => URL_REGEX.test(url), [url]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isUrlValid) {
        toast({
            variant: "destructive",
            title: "Enlace no válido",
            description: "Por favor, introduce un enlace válido para continuar.",
        });
      return;
    }

    setFormState('loading');
    
    try {
      const response = await fetch('/api/fetch-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormState('success');
        console.log('Video Info:', data);
        toast({
            title: "¡Listo para descargar!",
            description: data.title,
        });
        // Aquí se mostrarían las opciones de descarga
      } else {
        setFormState('error');
        console.log('RESPUESTA DETALLADA DEL ERROR DEL BACKEND:', data);
        toast({
            variant: "destructive",
            title: "Error al procesar",
            description: data.error || 'Ocurrió un error inesperado.',
        });
      }

    } catch (error) {
      setFormState('error');
      const errorMessage = error instanceof Error ? error.message : "No pudimos conectar con el servidor. Revisa tu conexión.";
      toast({
          variant: "destructive",
          title: "Error de Conexión",
          description: errorMessage,
      });
    }
  };
  
  const getButtonContent = () => {
    switch(formState) {
        case 'loading':
            return <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>;
        case 'error':
             return <><AlertCircle className="mr-2 h-4 w-4" /> Reintentar</>;
        default:
            return <><Download className="mr-2 h-4 w-4" /> Descargar</>;
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if(formState === 'error' || formState === 'success') {
        setFormState('idle');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 md:space-y-0 md:flex md:space-x-2">
      <Input
        type="url"
        placeholder="Pega aquí el enlace del video..."
        value={url}
        onChange={handleInputChange}
        className="flex-grow h-14 text-lg rounded-lg"
        aria-label="Enlace del video"
      />
      <Button 
        type="submit" 
        size="lg" 
        className="h-14 w-full md:w-auto text-lg rounded-lg transition-transform duration-200 hover:scale-105" 
        disabled={!isUrlValid || formState === 'loading'}
      >
        {getButtonContent()}
      </Button>
    </form>
  );
}
