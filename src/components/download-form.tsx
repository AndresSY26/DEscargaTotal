"use client";

import { useState, useMemo, type FormEvent } from 'react';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";

const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

type FormState = 'idle' | 'loading' | 'error' | 'success';

export function DownloadForm() {
  const [url, setUrl] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const { toast } = useToast();

  const isUrlValid = useMemo(() => URL_REGEX.test(url), [url]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
    
    // Simulate API call
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% chance of success
      if (isSuccess) {
        setFormState('success');
        toast({
            title: "¡Listo para descargar!",
            description: "Tu archivo ha sido procesado y está listo.",
        });
        // Here you would typically show download options
      } else {
        setFormState('error');
        toast({
            variant: "destructive",
            title: "Error al procesar",
            description: "No pudimos procesar el enlace. Por favor, inténtalo de nuevo.",
        });
      }
    }, 2000);
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
    if(formState === 'error') {
        setFormState('idle');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 md:space-y-0 md:flex md:space-x-2">
      <Input
        type="text"
        placeholder="Pega aquí el enlace del video..."
        value={url}
        onChange={handleInputChange}
        className="flex-grow h-14 text-lg"
        aria-label="Enlace del video"
      />
      <Button 
        type="submit" 
        size="lg" 
        className="h-14 w-full md:w-auto text-lg" 
        disabled={!isUrlValid || formState === 'loading'}
      >
        {getButtonContent()}
      </Button>
    </form>
  );
}
