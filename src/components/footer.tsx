import Link from 'next/link';
import { Download, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-white dark:bg-black mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="flex flex-col items-start space-y-4">
            <Link href="/" className="flex items-center space-x-2 mb-2">
              <Download className="h-7 w-7 text-primary" />
              <span className="font-bold text-xl">DescargaTotal</span>
            </Link>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} DescargaTotal. Todos los derechos reservados.</p>
            <div className="flex space-x-4 pt-2">
              <Link href="#" aria-label="YouTube"><Youtube className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
              <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
            </div>
          </div>
          
          {/* Col 2: About */}
          <div>
            <h3 className="font-semibold mb-4 text-base">Sobre Nosotros</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Quiénes Somos</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-base">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Términos de Uso</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>
          
          {/* Col 4: Help */}
          <div>
            <h3 className="font-semibold mb-4 text-base">Ayuda</h3>
            <ul className="space-y-3">
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
