export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="prose dark:prose-invert max-w-4xl mx-auto">
        <h1>Política de Privacidad</h1>
        <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2>1. Introducción</h2>
        <p>
          Bienvenido a DescargaTotal. Respetamos su privacidad y estamos comprometidos a proteger sus datos personales. Esta política de privacidad le informará sobre cómo cuidamos sus datos personales cuando visita nuestro sitio web y le informará sobre sus derechos de privacidad y cómo la ley lo protege.
        </p>

        <h2>2. Datos que recopilamos</h2>
        <p>
          No recopilamos ninguna información de identificación personal (PII) de nuestros usuarios. El único dato que procesamos es la URL que usted proporciona en el campo de descarga. Esta URL se utiliza únicamente para el propósito de obtener el archivo de video o audio solicitado y no se almacena en nuestros servidores.
        </p>
        <p>
          Utilizamos herramientas de análisis web (como Google Analytics) para recopilar datos anónimos sobre el tráfico del sitio, como el número de visitantes, las páginas visitadas y la duración de la visita. Esta información se utiliza para mejorar nuestro servicio y no está vinculada a usuarios individuales.
        </p>

        <h2>3. Cómo usamos sus datos</h2>
        <p>
          Las URL proporcionadas se utilizan exclusivamente para procesar su solicitud de descarga. Los datos de análisis anónimos se utilizan para comprender cómo se utiliza nuestro sitio web y para realizar mejoras en el servicio y la experiencia del usuario.
        </p>

        <h2>4. Cookies</h2>
        <p>
          Nuestro sitio web utiliza cookies para mejorar su experiencia. Una cookie es un pequeño archivo de texto que un sitio web guarda en su computadora o dispositivo móvil cuando visita el sitio. Utilizamos cookies para:
          <ul>
            <li>Guardar su preferencia de tema (claro/oscuro/sistema).</li>
            <li>Analizar el tráfico del sitio de forma anónima.</li>
          </ul>
          Puede controlar y/o eliminar las cookies como lo desee.
        </p>

        <h2>5. Seguridad de los datos</h2>
        <p>
          Hemos implementado medidas de seguridad apropiadas para evitar que sus datos personales se pierdan, usen o accedan de forma no autorizada, se alteren o se divulguen accidentalmente.
        </p>

        <h2>6. Sus derechos legales</h2>
        <p>
          Dado que no recopilamos datos personales, la mayoría de los derechos de protección de datos (como el derecho de acceso, rectificación, etc.) no son aplicables. Sin embargo, respetamos su derecho a la privacidad y a comprender cómo funciona nuestro servicio.
        </p>

        <h2>7. Contacto</h2>
        <p>
          Si tiene alguna pregunta sobre esta política de privacidad, puede contactarnos a través de la información proporcionada en nuestra página de contacto o preguntas frecuentes.
        </p>
      </div>
    </div>
  );
}
