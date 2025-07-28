export default function TermsOfUsePage() {
  // Nota: La fecha se ha establecido estáticamente como solicitaste, pero se puede volver a hacer dinámica si es necesario.
  const lastUpdated = "28 de julio de 2025";

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Términos de Uso
          </h1>
          <p className="mt-4 text-md text-muted-foreground">
            Última actualización: {lastUpdated}
          </p>
        </header>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Aceptación de los Términos</h2>
            <p className="leading-relaxed text-muted-foreground">
              Al acceder y utilizar DescargaTotal (el "Servicio"), usted acepta y se compromete a cumplir con estos Términos de Uso. Si no está de acuerdo con estos términos, no debe utilizar el Servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Descripción del Servicio</h2>
            <p className="leading-relaxed text-muted-foreground">
              DescargaTotal es una herramienta en línea que permite a los usuarios descargar videos y audios de varias plataformas de redes sociales y video para uso personal. El servicio es gratuito y se proporciona "tal cual".
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Uso Aceptable</h2>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Usted se compromete a utilizar el Servicio únicamente para fines legales y de una manera que no infrinja los derechos de, restrinja o inhiba el uso y disfrute del Servicio por parte de terceros.
              </p>
              <p>
                Es su responsabilidad asegurarse de que tiene los derechos necesarios para descargar y utilizar el contenido. DescargaTotal no aloja ni distribuye contenido protegido por derechos de autor. Usted es el único responsable de cualquier infracción de derechos de autor que pueda ocurrir como resultado del uso de este Servicio.
              </p>
              <p>
                El uso del Servicio para descargar material protegido por derechos de autor sin el permiso del titular de los derechos está estrictamente prohibido.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Limitación de Responsabilidad</h2>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                El Servicio se proporciona sin garantías de ningún tipo. No garantizamos que el Servicio esté siempre disponible, sea ininterrumpido, seguro o libre de errores.
              </p>
              <p>
                En ningún caso DescargaTotal será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la incapacidad de usar el Servicio.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Propiedad Intelectual</h2>
            <p className="leading-relaxed text-muted-foreground">
              El contenido descargado a través de nuestro Servicio es propiedad de sus respectivos dueños. Nuestro Servicio actúa únicamente como un intermediario técnico. El nombre "DescargaTotal", el logotipo y otros gráficos son propiedad nuestra y no pueden ser utilizados sin nuestro permiso explícito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Cambios en los Términos</h2>
            <p className="leading-relaxed text-muted-foreground">
              Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento. La versión más reciente siempre estará disponible en nuestro sitio web. El uso continuado del Servicio después de cualquier cambio constituirá su aceptación de dichos cambios.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Legislación Aplicable</h2>
            <p className="leading-relaxed text-muted-foreground">
              Estos términos se regirán e interpretarán de acuerdo con las leyes de la jurisdicción en la que operamos, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}