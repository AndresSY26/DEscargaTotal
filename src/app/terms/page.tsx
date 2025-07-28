export default function TermsOfUsePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="prose dark:prose-invert max-w-4xl mx-auto">
        <h1>Términos de Uso</h1>
        <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2>1. Aceptación de los Términos</h2>
        <p>
          Al acceder y utilizar DescargaTotal (el "Servicio"), usted acepta y se compromete a cumplir con estos Términos de Uso. Si no está de acuerdo con estos términos, no debe utilizar el Servicio.
        </p>

        <h2>2. Descripción del Servicio</h2>
        <p>
          DescargaTotal es una herramienta en línea que permite a los usuarios descargar videos y audios de varias plataformas de redes sociales y video para uso personal. El servicio es gratuito y se proporciona "tal cual".
        </p>

        <h2>3. Uso Aceptable</h2>
        <p>
          Usted se compromete a utilizar el Servicio únicamente para fines legales y de una manera que no infrinja los derechos de, restrinja o inhiba el uso y disfrute del Servicio por parte de terceros.
        </p>
        <p>
          Es su responsabilidad asegurarse de que tiene los derechos necesarios para descargar y utilizar el contenido. DescargaTotal no aloja ni distribuye contenido protegido por derechos de autor. Usted es el único responsable de cualquier infracción de derechos de autor que pueda ocurrir como resultado del uso de este Servicio.
        </p>
        <p>
          El uso del Servicio para descargar material protegido por derechos de autor sin el permiso del titular de los derechos está estrictamente prohibido.
        </p>

        <h2>4. Limitación de Responsabilidad</h2>
        <p>
          El Servicio se proporciona sin garantías de ningún tipo. No garantizamos que el Servicio esté siempre disponible, sea ininterrumpido, seguro o libre de errores.
        </p>
        <p>
          En ningún caso DescargaTotal será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la incapacidad de usar el Servicio.
        </p>

        <h2>5. Propiedad Intelectual</h2>
        <p>
          El contenido descargado a través de nuestro Servicio es propiedad de sus respectivos dueños. Nuestro Servicio actúa únicamente como un intermediario técnico. El nombre "DescargaTotal", el logotipo y otros gráficos son propiedad nuestra y no pueden ser utilizados sin nuestro permiso explícito.
        </p>

        <h2>6. Cambios en los Términos</h2>
        <p>
          Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento. La versión más reciente siempre estará disponible en nuestro sitio web. El uso continuado del Servicio después de cualquier cambio constituirá su aceptación de dichos cambios.
        </p>
        
        <h2>7. Legislación Aplicable</h2>
        <p>
          Estos términos se regirán e interpretarán de acuerdo con las leyes de la jurisdicción en la que operamos, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
        </p>
      </div>
    </div>
  );
}
