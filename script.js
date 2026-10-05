// ===================================================
// CONTADOR DE TIEMPO TRANSCURRIDO CON AMOR
// Fecha objetivo: 6 de mayo de 2025 a las 20:00:00 (hora local)
// Nota: En JavaScript los meses van de 0 a 11, por lo que Mayo es el mes 4.
// ===================================================
const TARGET_DATE = new Date(2025, 4, 6, 20, 0, 0);

// Elementos del DOM del Contador
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const secondsBarEl = document.getElementById('seconds-bar');

const totalWeeksEl = document.getElementById('total-weeks');
const totalHoursEl = document.getElementById('total-hours');
const totalMinutesEl = document.getElementById('total-minutes');
const totalSecondsEl = document.getElementById('total-seconds');

const statusBadgeEl = document.getElementById('status-badge');
const statusTextEl = document.getElementById('status-text');
const copyBtn = document.getElementById('copy-btn');
const toastEl = document.getElementById('toast');
const currentClockEl = document.getElementById('current-clock');

// Formateador con separadores de miles para números grandes
const numberFormatter = new Intl.NumberFormat('es-ES');

// Variables para detectar cambios y animar números
let prevValues = {
  days: null,
  hours: null,
  minutes: null,
  seconds: null
};

function padZero(num) {
  return String(num).padStart(2, '0');
}

function updateCounter() {
  const now = new Date();
  const diffMs = now - TARGET_DATE;

  // Actualizar reloj de hora actual en vivo
  if (currentClockEl) {
    currentClockEl.textContent = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  if (diffMs >= 0) {
    // La fecha ya pasó: calcular tiempo transcurrido
    if (statusTextEl && statusTextEl.textContent !== 'Tiempo en curso') {
      statusTextEl.textContent = 'Tiempo en curso';
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const seconds = totalSeconds % 60;

    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;

    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;

    const days = Math.floor(totalHours / 24);
    const weeks = Math.floor(days / 7);

    // Actualizar valores en pantalla con animación suave al cambiar
    setCounterValue(daysEl, numberFormatter.format(days), 'days', days);
    setCounterValue(hoursEl, padZero(hours), 'hours', hours);
    setCounterValue(minutesEl, padZero(minutes), 'minutes', minutes);
    setCounterValue(secondsEl, padZero(seconds), 'seconds', seconds);

    // Barra de progreso del minuto actual (0 a 100%)
    if (secondsBarEl) {
      const progressPercent = ((seconds + 1) / 60) * 100;
      secondsBarEl.style.width = `${progressPercent}%`;
    }

    // Totales acumulados
    if (totalWeeksEl) totalWeeksEl.textContent = numberFormatter.format(weeks);
    if (totalHoursEl) totalHoursEl.textContent = numberFormatter.format(totalHours);
    if (totalMinutesEl) totalMinutesEl.textContent = numberFormatter.format(totalMinutes);
    if (totalSecondsEl) totalSecondsEl.textContent = numberFormatter.format(totalSeconds);

  } else {
    // En caso de que la fecha objetivo esté en el futuro respecto al reloj local
    const absDiffMs = Math.abs(diffMs);
    const totalSeconds = Math.floor(absDiffMs / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);

    if (statusTextEl) {
      statusTextEl.textContent = 'Inicia el 6 de Mayo de 2025';
    }

    setCounterValue(daysEl, numberFormatter.format(days), 'days', days);
    setCounterValue(hoursEl, padZero(hours), 'hours', hours);
    setCounterValue(minutesEl, padZero(minutes), 'minutes', minutes);
    setCounterValue(secondsEl, padZero(seconds), 'seconds', seconds);

    if (totalWeeksEl) totalWeeksEl.textContent = numberFormatter.format(Math.floor(days / 7));
    if (totalHoursEl) totalHoursEl.textContent = numberFormatter.format(totalHours);
    if (totalMinutesEl) totalMinutesEl.textContent = numberFormatter.format(totalMinutes);
    if (totalSecondsEl) totalSecondsEl.textContent = numberFormatter.format(totalSeconds);
  }
}

function setCounterValue(element, formattedText, key, rawValue) {
  if (!element) return;
  if (prevValues[key] !== rawValue) {
    element.textContent = formattedText;
    prevValues[key] = rawValue;
    
    // Micro-animación de escala al cambiar el número
    element.style.transform = 'scale(1.08)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 150);
  }
}

// Función para copiar el resumen de amor al portapapeles
function copySummary() {
  const now = new Date();
  const diffMs = now - TARGET_DATE;

  let textToCopy = '';

  if (diffMs >= 0) {
    const totalSeconds = Math.floor(diffMs / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);

    textToCopy = `💖 Han transcurrido ${numberFormatter.format(days)} días, ${hours} horas, ${minutes} minutos y ${seconds} segundos desde el 6 de mayo de 2025 a las 20:00 hs. ¡Cada segundo cuenta en esta hermosa historia! 💕`;
  } else {
    textToCopy = `💖 Contando los días para el 6 de mayo de 2025 a las 20:00 hs. 💕`;
  }

  // Generar pequeña lluvia de corazones festiva en el botón
  if (copyBtn) {
    const rect = copyBtn.getBoundingClientRect();
    spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('¡Resumen de amor copiado con éxito! 💖');
    }).catch(() => {
      fallbackCopy(textToCopy);
    });
  } else {
    fallbackCopy(textToCopy);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('¡Resumen de amor copiado con éxito! 💖');
  } catch (err) {
    showToast('No se pudo copiar automáticamente');
  }
  document.body.removeChild(textarea);
}

function showToast(message) {
  if (!toastEl) return;
  const msgEl = toastEl.querySelector('.toast-message');
  if (msgEl) msgEl.textContent = message;
  toastEl.classList.add('show');
  
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3200);
}

// Event Listeners
if (copyBtn) {
  copyBtn.addEventListener('click', copySummary);
}

// Iniciar contador inmediatamente y actualizar cada segundo
updateCounter();
setInterval(updateCounter, 1000);


// ===================================================
// MOTOR DE CORAZONES FLOTANTES EN EL FONDO (CANVAS)
// Los corazones están estrictamente en el fondo con
// pointer-events: none y opacidades sutiles para NUNCA
// tapar ninguna palabra, texto ni botón.
// ===================================================

const canvas = document.getElementById('hearts-canvas');
let ctx = null;
let animationFrameId = null;

const HEART_COLORS = [
  '#ff4d6d',
  '#ff758f',
  '#fb7185',
  '#fda4af',
  '#f43f5e',
  '#e11d48',
  '#be123c',
  '#ffccd5'
];

let hearts = [];
let burstHearts = [];
let width = window.innerWidth;
let height = window.innerHeight;

function initCanvas() {
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  resizeCanvas();

  // Crear corazones de fondo iniciales
  const count = width < 600 ? 25 : 45;
  hearts = [];
  for (let i = 0; i < count; i++) {
    hearts.push(createHeart(true));
  }

  // Iniciar ciclo de animación
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animateHearts();
}

function resizeCanvas() {
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
}

window.addEventListener('resize', () => {
  resizeCanvas();
});

function createHeart(randomY = false) {
  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : height + 25 + Math.random() * 40,
    size: Math.random() * 16 + 10, // Tamaño entre 10px y 26px
    speedY: Math.random() * 0.7 + 0.4, // Velocidad vertical suave
    wobbleSpeed: Math.random() * 0.02 + 0.015,
    wobbleAmplitude: Math.random() * 1.5 + 0.6,
    wobbleOffset: Math.random() * Math.PI * 2,
    color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    opacity: Math.random() * 0.28 + 0.15, // Opacidad translúcida para que no tape nada
    rotation: (Math.random() - 0.5) * 0.35,
    pulseSpeed: Math.random() * 0.03 + 0.02,
    pulseOffset: Math.random() * Math.PI * 2
  };
}

// Dibuja la silueta de un corazón mediante curvas de Bézier
function drawHeart(context, x, y, size, color, opacity, rotation = 0) {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  
  // Normalizar tamaño respecto a la figura base
  const scale = size / 30;
  context.scale(scale, scale);

  context.beginPath();
  // Comenzamos en la hendidura superior del corazón
  context.moveTo(0, -6);
  // Lóbulo izquierdo hacia la punta inferior
  context.bezierCurveTo(-18, -24, -30, 4, 0, 26);
  // Lóbulo derecho desde la punta inferior de regreso arriba
  context.bezierCurveTo(30, 4, 18, -24, 0, -6);
  context.closePath();

  context.fillStyle = color;
  context.globalAlpha = opacity;
  context.shadowColor = color;
  context.shadowBlur = 6;
  context.fill();

  context.restore();
}

let tick = 0;

function animateHearts() {
  if (!ctx) return;
  tick++;

  ctx.clearRect(0, 0, width, height);

  // 1. Dibujar corazones flotantes de fondo
  for (let i = 0; i < hearts.length; i++) {
    const h = hearts[i];

    h.y -= h.speedY;
    const currentWobble = Math.sin(tick * h.wobbleSpeed + h.wobbleOffset) * h.wobbleAmplitude;
    h.x += currentWobble;

    // Sutil efecto de latido en el tamaño
    const pulse = 1 + Math.sin(tick * h.pulseSpeed + h.pulseOffset) * 0.08;
    const currentSize = h.size * pulse;

    drawHeart(ctx, h.x, h.y, currentSize, h.color, h.opacity, h.rotation + currentWobble * 0.1);

    // Reiniciar si el corazón sale por la parte superior
    if (h.y < -40) {
      hearts[i] = createHeart(false);
    }
  }

  // 2. Dibujar corazones interactivos de ráfaga (al hacer click)
  for (let i = burstHearts.length - 1; i >= 0; i--) {
    const b = burstHearts[i];
    b.x += b.vx;
    b.y += b.vy;
    b.vy += 0.03; // Sutil gravedad
    b.opacity -= 0.018; // Desvanecimiento rápido
    b.size *= 0.98;

    if (b.opacity <= 0 || b.size <= 2) {
      burstHearts.splice(i, 1);
    } else {
      drawHeart(ctx, b.x, b.y, b.size, b.color, b.opacity, b.rotation);
    }
  }

  animationFrameId = requestAnimationFrame(animateHearts);
}

// Genera una pequeña ráfaga de corazoncitos brillantes al hacer click
function spawnHeartBurst(x, y, count = 6) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = Math.random() * 2.8 + 1.2;
    burstHearts.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      size: Math.random() * 12 + 10,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      opacity: 0.85,
      rotation: (Math.random() - 0.5) * 0.6
    });
  }
}

// Efecto interactivo: hacer clic en cualquier lugar genera sutiles corazoncitos
window.addEventListener('pointerdown', (e) => {
  // Solo si no fue sobre el botón de copiar (que ya tiene su propia ráfaga)
  if (e.target.closest('#copy-btn')) return;
  spawnHeartBurst(e.clientX, e.clientY, 4);
});

// Inicializar el canvas al cargar la página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCanvas);
} else {
  initCanvas();
}

// ===================================================
// DEDICATORIAS ESPECIALES CON IA (GEMINI API) & COLECCIÓN
// ===================================================

const btnAmorIa = document.getElementById('btn-amor-ia');
const textoAmorIa = document.getElementById('texto-amor-ia');

// Colección extensa de más de 50 dedicatorias íntimas, tiernas y variadas para Ayli
const MENSAJES_ROMANTICOS_AYLI = [
  'Desde que te conocí en el colegio supe que tu mirada tenía algo diferente, pero nunca imaginé que ibas a ser el amor más grande y lindo de mi vida. 💖',
  'Tus ojos tienen una luz tan propia y especial que, incluso en los días más grises, iluminan todo mi mundo con solo mirarme. ✨',
  'Escuchar tu voz después de un día largo es mi refugio favorito; me transmite una paz que no encuentro en ningún otro lugar. 🌹',
  'Amo con locura tu risa, y amo todavía más cuando te querés hacer la seria o la mala conmigo pero terminás sonriendo. 💜',
  'Sos una chica tan inteligente y admirable; me llena de orgullo ver cómo le ponés el pecho a todo y nunca te rendís. 🌟',
  'Tenés un corazón bondadoso que siempre busca ayudar a los demás, y esa ternura te hace infinitamente hermosa por dentro y por fuera. 🌸',
  'Amo nuestras peleitas tontas, tus caras, tus bromas y esa complicidad que solo nosotros dos entendemos. 🥤🍫',
  'Estar abrazado a vos y llenarte de besos es el único lugar donde siento que el tiempo se detiene por completo. 🌙',
  'Gracias por no soltarme la mano en los momentos difíciles y por demostrarme todos los días que el amor sincero todo lo puede. 💍',
  'No hay merienda rica, ni paseo, ni tarde de malteadas que valga la pena si no es compartida con tu hermosa sonrisa. 🍓',
  'Si el universo me diera la oportunidad de elegir mi destino otra vez, te volvería a buscar en ese mismo colegio sin dudarlo un segundo. 💫',
  'Sos mi refugio seguro, mi paz cuando hay tormenta y la persona que hace latir mi corazón con más fuerza. 💖',
  'Amo cada detalle tuyo: tus manías, tus abrazos apretados y hasta cuando me discutís cualquier cosita con ternura. 💌',
  'Mirarte a los ojos y ver ese brillo tan dulce me hace sentir el pibe más afortunado de toda la tierra. 👑',
  'Sos la mujer que me inspira a ser mejor, la compañera más dulce y la novia más maravillosa que alguien podría soñar. 🌷',
  'Cada segundo que pasa desde aquel 6 de mayo es una bendición que atesoro con todo el corazón. ⏳❤️',
  'No te das una idea de lo linda que te ves cuando te concentrás, cuando te esforzás por salir adelante y superás cada obstáculo. 🌺',
  'Me encanta cuando nos quedamos en silencio, apoyando mi cabeza junto a la tuya, sintiendo que no hace falta nada más. 🕊️',
  'Sos arte en todos tus colores, incluso en blanco y negro, tu esencia ilumina cada rincón de mi vida. 🎨',
  'Te amo con tus mañas, tus risas inesperadas y esa dulzura infinita que solo sabés darme vos. 🍬',
  'Prometo cuidarte, valorar cada esfuerzo tuyo y recordarte siempre lo increíble y valiosa que sos, mi amor. 🛡️',
  'Tu abrazo tiene el poder mágico de borrar cualquier cansancio o tristeza en cuestión de segundos. 🧸',
  'Gracias por elegirme cada día, por confiar en nosotros y por construir este amor tan lindo que crece más y más. 🏡',
  'Pase lo que pase y aunque el camino tenga curvas difíciles, siempre voy a estar acá para tomarte de la mano. 🤝',
  'Amo tu risa cuando te hago cosquillas o cuando decimos la misma palabra al mismo tiempo como dos cómplices. 🎭',
  'Sos mi casualidad más hermosa, el mejor regalo que me dio la vida y mi razón diaria para sonreír. 🎁',
  'Cada vez que te veo venir hacia mí, siento los mismos nervios dulces y el mismo orgullo que sentí los primeros días. 🦋',
  'Tus ojos son mi paisaje favorito y tu sonrisa, la melodía más bonita que jamás escuché. 🎶',
  'Admiro tu fuerza, tu madurez para mejorar por el bien de los dos y esa ternura con la que me cuidás. 🤍',
  'No necesito nada lujoso ni extravagante; una tarde cualquiera con vos y una charla sincera ya es un paraíso para mí. ☕',
  'Sos mi pequeña gigante: dulce por fuera, invencible por dentro y completamente dueña de mi corazón. 💎',
  'Gracias por hacerme reír hasta que me duela la panza con tus ocurrencias tan tuyas. 😂',
  'Si me pidieran definir la felicidad en una sola palabra, simplemente diría tu nombre: Aylen. 🌹',
  'Me encanta mirarte de reojo mientras hacés tus cosas y pensar en la suerte inmensa de tenerte a mi lado. 🍀',
  'Sos el sueño del que nunca quiero despertar y la realidad que supera cualquier fantasía. 🌙',
  'No hay distancia ni problema que pueda apagar lo que siento por vos; mi amor por vos es incondicional. 🚀',
  'Gracias por tus caricias en el pelo, por tus besos imprevistos y por hacerme sentir tan profundamente querido. 💆‍♂️',
  'Amo cuando te hacés la desentendida pero sé que por dentro te estás muriendo de risa conmigo. 😏',
  'Sos la persona con la que quiero compartir cada logro, cada festejo y cada merienda rica por el resto de mis días. 🍰',
  'Tu ternura tiene la fuerza de cambiar mi peor día en el mejor con solo un mensajito tuyo. 📱',
  'Sos la estrella más brillante de mi cielo, la que guía mis pasos y la que ilumina mis noches. 🌠',
  'Poder decirte «mi novia» es el título más lindo y el honor más grande que tengo en la vida. 💍',
  'Amo nuestras miradas cómplices frente al espejo, sabiendo que somos un equipo invencible. 🪞',
  'Gracias por tener la paciencia, el amor y la madurez de apostar siempre por nosotros dos. 🌱',
  'Sos mi hogar. En cualquier lugar del mundo, si estoy con vos, siento que estoy en casa. 🏡',
  'Me encanta cuando me mirás fijo con esos ojos brillantes y me decís que me querés; me desarmás por completo. 🫠',
  'Sos una luchadora incansable, y todo lo que te propongas en la vida lo vas a lograr porque tenés una fuerza admirable. 🧗‍♀️',
  'Quiero coleccionar miles de instantes más a tu lado, hasta que seamos viejitos y sigamos riéndonos de las mismas cosas. 👵👴',
  'Nunca dudes de lo maravillosa que sos ni de lo mucho que te amo. Sos perfecta para mí, con todo lo que sos. 🤍',
  'Te amo con cada latido de mi corazón, hoy, mañana y por toda la eternidad, mi querida Ayli. ❤️'
];

// Cola de baraja sin repeticiones (muestra todos antes de repetir alguno)
let barajaDedicatorias = [];

function obtenerSiguienteDedicatoria() {
  if (barajaDedicatorias.length === 0) {
    // Clonar y mezclar con algoritmo Fisher-Yates
    barajaDedicatorias = [...MENSAJES_ROMANTICOS_AYLI];
    for (let i = barajaDedicatorias.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [barajaDedicatorias[i], barajaDedicatorias[j]] = [barajaDedicatorias[j], barajaDedicatorias[i]];
    }
  }
  return barajaDedicatorias.pop();
}

if (btnAmorIa && textoAmorIa) {
  btnAmorIa.addEventListener('click', async () => {
    textoAmorIa.textContent = 'Consultando a las estrellas para vos... 💖✨';
    textoAmorIa.style.opacity = '0.7';
    btnAmorIa.disabled = true;

    // Lluvia de corazoncitos festiva en el botón
    const rect = btnAmorIa.getBoundingClientRect();
    if (typeof spawnHeartBurst === 'function') {
      spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
    }

    try {
      const res = await fetch('/api/amor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'carta' })
      });

      if (!res.ok) {
        throw new Error('Servidor IA no disponible');
      }

      const data = await res.json();
      if (data && data.mensaje && data.mensaje.trim().length > 0) {
        textoAmorIa.textContent = `"${data.mensaje.trim()}"`;
      } else {
        throw new Error('Respuesta vacía');
      }
    } catch (err) {
      // Si la API en la nube aún no está conectada o se ejecuta en local/estático,
      // entrega una dedicatoria única de la baraja de 50 mensajes sin repetición
      const dedicatoriaUnica = obtenerSiguienteDedicatoria();
      textoAmorIa.textContent = `"${dedicatoriaUnica}"`;
    } finally {
      textoAmorIa.style.opacity = '1';
      btnAmorIa.disabled = false;
    }
  });
}

