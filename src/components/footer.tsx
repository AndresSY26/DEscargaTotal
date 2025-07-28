import Link from 'next/link';
import { Download, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start space-y-2">
            <Link href="/" className="flex items-center space-x-2 mb-2">
              <Download className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">DescargaTotal</span>
            </Link>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} DescargaTotal. Todos los derechos reservados.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Sobre Nosotros</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">Quiénes Somos</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Términos de Uso</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Política de Privacidad</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Ayuda</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">Preguntas Frecuentes</Link></li>
              <li className="flex space-x-4 pt-2">
                <Link href="#" aria-label="YouTube"><Youtube className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
                <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
                <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
