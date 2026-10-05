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
