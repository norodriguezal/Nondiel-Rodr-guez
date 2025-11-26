// Colors
const COLOR_VR = '#00ffff'; // Cyan/Blue for VR
const COLOR_AR = '#00ff00'; // Green for AR

export const INFOGRAPHIC_NODES = [
  // --- REALIDAD VIRTUAL (5 Esferas) ---
  {
    id: 'vr-1-definicion',
    title: 'Definición (RV)',
    shortDescription: 'Entornos digitales tridimensionales inmersivos.',
    fullContent: `
      <p>La Realidad Virtual (RV) es una tecnología que crea entornos digitales tridimensionales donde el usuario puede sentirse inmerso e interactuar como si estuviera dentro de ellos.</p>
      <br/>
      <p>Para lograrlo, utiliza dispositivos especializados que bloquean el mundo real y proyectan un entorno completamente generado por computadora.</p>
    `,
    category: 'vr',
    x: 5,
    y: 50,
    z: 10,
    color: COLOR_VR,
  },
  {
    id: 'vr-2-funcionamiento',
    title: 'Funcionamiento (RV)',
    shortDescription: 'Visores, sensores y controladores.',
    fullContent: `
      <p>La RV opera mediante tres elementos principales:</p>
      <ul class="list-disc pl-5 space-y-2 mt-2">
        <li><strong>Un visor o casco:</strong> Muestra imágenes estereoscópicas con sensación de profundidad.</li>
        <li><strong>Sensores de movimiento:</strong> Registran los desplazamientos del usuario para adaptar la vista en tiempo real.</li>
        <li><strong>Controladores o guantes:</strong> Permiten manipular objetos y realizar acciones dentro del entorno virtual.</li>
      </ul>
      <p class="mt-4">Todo esto es gestionado por un software que genera el mundo digital y responde a las interacciones del usuario.</p>
    `,
    category: 'vr',
    x: 15,
    y: 30,
    z: -15,
    color: COLOR_VR,
  },
  {
    id: 'vr-3-componentes',
    title: 'Componentes clave (RV)',
    shortDescription: 'Inmersión, Interactividad y Presencia.',
    fullContent: `
      <ul class="list-disc pl-5 space-y-4">
        <li><strong>Inmersión:</strong> Sensación de estar dentro del entorno virtual, desconectándose del mundo físico.</li>
        <li><strong>Interactividad:</strong> Posibilidad de influir en lo que ocurre dentro del entorno y recibir respuesta inmediata.</li>
        <li><strong>Presencia:</strong> Percepción psicológica profunda de que ese entorno se siente real, engañando a los sentidos.</li>
      </ul>
    `,
    category: 'vr',
    x: 25,
    y: 70,
    z: 20,
    color: COLOR_VR,
  },
  {
    id: 'vr-4-tipos',
    title: 'Tipos de Realidad Virtual',
    shortDescription: 'Desde pantallas hasta inmersión total.',
    fullContent: `
      <ul class="list-disc pl-5 space-y-3">
        <li><strong>No inmersiva:</strong> Se experimenta mediante pantallas convencionales (monitor, TV) donde se controla un avatar.</li>
        <li><strong>Semi-inmersiva:</strong> Utiliza pantallas amplias o simuladores de vuelo/conducción para aumentar la profundidad visual sin aislar totalmente.</li>
        <li><strong>Inmersiva:</strong> Se logra con visores VR que cubren completamente la visión y brindan la experiencia más envolvente posible.</li>
      </ul>
    `,
    category: 'vr',
    x: 35,
    y: 40,
    z: 5,
    color: COLOR_VR,
  },
  {
    id: 'vr-5-ventajas',
    title: 'Ventajas y Desventajas (RV)',
    shortDescription: 'Beneficios y retos de la tecnología.',
    fullContent: `
      <h4 class="text-holo-cyan font-bold text-lg mb-2">VENTAJAS:</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li>Alto nivel de realismo e inmersión.</li>
        <li>Permite prácticas seguras sin riesgos (medicina, aviación).</li>
        <li>Favorece el aprendizaje experiencial.</li>
        <li>Reduce costos en entrenamientos y prototipos.</li>
        <li>Incrementa la motivación y participación del usuario.</li>
      </ul>

      <h4 class="text-red-400 font-bold text-lg mb-2">DESVENTAJAS:</h4>
      <ul class="list-disc pl-5 space-y-1">
        <li>Puede generar mareos o desorientación (ciber-enfermedad).</li>
        <li>El equipamiento puede ser costoso.</li>
        <li>Requiere espacio físico adecuado para moverse.</li>
        <li>Puede causar fatiga visual o dolores de cabeza si se usa prolongadamente.</li>
      </ul>
    `,
    category: 'vr',
    x: 45,
    y: 60,
    z: -10,
    color: COLOR_VR,
  },

  // --- REALIDAD AUMENTADA (5 Esferas) ---
  {
    id: 'ar-6-definicion',
    title: 'Definición (RA)',
    shortDescription: 'Superposición de información digital al mundo real.',
    fullContent: `
      <p>Es una tecnología que superpone información digital (como imágenes, sonidos y datos) sobre el mundo real, enriqueciéndolo en lugar de reemplazarlo.</p>
      <br/>
      <p>A diferencia de la RV, no te aísla de tu entorno, sino que agrega capas de información útil o entretenimiento sobre lo que ya ves.</p>
    `,
    category: 'ar',
    x: 55,
    y: 25,
    z: 15,
    color: COLOR_AR,
  },
  {
    id: 'ar-7-funcionamiento',
    title: 'Funcionamiento (RA)',
    shortDescription: 'Captura y análisis del entorno.',
    fullContent: `
      <h3 class="text-[#00ff88] font-bold text-xl mb-2">Capturar el Mundo Real</h3>
      <p class="mb-4">El dispositivo (como tu teléfono o unas gafas AR) utiliza su cámara para captar el entorno en tiempo real. Es como si fueran sus "ojos".</p>

      <h3 class="text-[#00ff88] font-bold text-xl mb-2">Analizar y Entender el Entorno</h3>
      <p>El software de RA (por ejemplo, ARCore de Google o ARKit de Apple) analiza el vídeo capturado por la cámara para entender lo que está viendo, detectando superficies planas y puntos de referencia.</p>
    `,
    category: 'ar',
    x: 65,
    y: 75,
    z: -5,
    color: COLOR_AR,
  },
  {
    id: 'ar-8-componentes',
    title: 'Componentes clave (RA)',
    shortDescription: 'Hardware y software necesarios.',
    fullContent: `
      <ul class="list-disc pl-5 space-y-3">
        <li><strong>Cámara y Sensores:</strong> Capturan el entorno físico (imágenes, profundidad). Giroscopios y acelerómetros detectan la orientación.</li>
        <li><strong>Procesador (CPU/GPU):</strong> Es el "cerebro" que analiza los datos, ejecuta el software y renderiza los elementos digitales en tiempo real.</li>
        <li><strong>Motor de RA:</strong> Plataformas como ARKit, ARCore o Vuforia que permiten el reconocimiento de superficies y anclaje de objetos.</li>
        <li><strong>Software Específico:</strong> La aplicación final que el usuario utiliza para vivir la experiencia.</li>
      </ul>
    `,
    category: 'ar',
    x: 75,
    y: 45,
    z: 25,
    color: COLOR_AR,
  },
  {
    id: 'ar-9-tipos',
    title: 'Tipos de Realidad Aumentada',
    shortDescription: 'Marcadores y proyección.',
    fullContent: `
      <ul class="list-disc pl-5 space-y-4">
        <li><strong>RA Basada en Marcadores:</strong> Utiliza un "marcador" físico (como un código QR, imagen u objeto) que la cámara escanea. Al reconocerlo, superpone el contenido digital exactamente encima.</li>
        <li><strong>RA por Proyección:</strong> Proyecta luz artificial sobre superficies físicas reales, creando interfaces interactivas. Puede detectar la interacción del usuario mediante la interrupción o distorsión de la luz.</li>
      </ul>
    `,
    category: 'ar',
    x: 85,
    y: 65,
    z: -20,
    color: COLOR_AR,
  },
  {
    id: 'ar-10-ventajas',
    title: 'Ventajas y Desventajas (RA)',
    shortDescription: 'Impacto en productividad y retos.',
    fullContent: `
      <h4 class="text-[#00ff88] font-bold text-lg mb-2">VENTAJAS:</h4>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li><strong>Mejora la Experiencia:</strong> Hace que el aprendizaje y las instrucciones sean más intuitivos al combinar realidad y datos.</li>
        <li><strong>Aumenta la Eficiencia:</strong> En industrias, proporciona datos cruciales en tiempo real, reduciendo errores y tiempos de búsqueda.</li>
      </ul>

      <h4 class="text-red-400 font-bold text-lg mb-2">DESVENTAJAS:</h4>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Alto Coste:</strong> El desarrollo de calidad y hardware como gafas AR (HoloLens, Magic Leap) sigue siendo costoso.</li>
        <li><strong>Privacidad:</strong> Requiere acceso constante a cámaras y ubicación, planteando dudas sobre el uso de datos personales.</li>
      </ul>
    `,
    category: 'ar',
    x: 95,
    y: 35,
    z: 10,
    color: COLOR_AR,
  },
];
