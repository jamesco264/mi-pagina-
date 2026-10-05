// ===================================================
// JAVASCRIPT DE LA GALERÍA DE AMOR (VIOLETA & AZUL)
// ===================================================

// Datos de las 8 fotos de amor
const PHOTOS_DATA = [
  {
    src: 'img/foto1.jpg',
    title: 'Reflejo de Nosotros',
    caption: 'Un momento espontáneo frente al espejo, miradas cómplices y la certeza de que a tu lado todo es más divertido y lindo. 💜',
    tag: '#Complicidad'
  },
  {
    src: 'img/foto2.jpg',
    title: 'Miradas que Enamoran',
    caption: 'En blanco y negro o en mil colores, no hay lugar más lindo en el mundo que estar así de cerca tuyo. 💙',
    tag: '#AmorPuro'
  },
  {
    src: 'img/foto3.jpg',
    title: 'Tardes Dulces',
    caption: 'Nuestras salidas por algo rico: compartiendo risas, antojos y esos momentos que dejan el mejor sabor en el corazón. 🥤🍫',
    tag: '#NuestrasCitas'
  },
  {
    src: 'img/foto4.jpg',
    title: 'Nuestra Chispa',
    caption: 'Tu compañía y tu forma de ser hacen que cualquier día común se transforme en un día hermoso y feliz. 💜✨',
    tag: '#SiempreJuntos'
  },
  {
    src: 'img/foto5.jpg',
    title: 'Paz a tu Lado',
    caption: 'El refugio más cálido, suave y seguro de todos: descansar en tus brazos y sentir que el mundo entero se detiene. 🌙💙',
    tag: '#MiLugarSeguro'
  },
  {
    src: 'img/foto6.jpg',
    title: 'Un Beso Nuestro',
    caption: 'Ese beso tierno donde el tiempo se detiene, nuestras miradas se encuentran y nada más importa en el mundo. 💍💜',
    tag: '#BesoEterno'
  },
  {
    src: 'img/foto7.jpg',
    title: 'Detalles que Endulzan',
    caption: 'Nuestros antojos compartidos, esas meriendas ricas donde el mejor ingrediente siempre es tu hermosa compañía. 🍓🍨',
    tag: '#MomentosDulces'
  },
  {
    src: 'img/foto8.jpg',
    title: 'Cerca de Ti',
    caption: 'Apoyar mi cabeza junto a la tuya, mirarnos y sentir esa calma y felicidad infinita que solo vos me das. 💙✨',
    tag: '#MiradasQueHablan'
  }
];

// Elementos del DOM del Lightbox
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxDesc = document.getElementById('lightbox-desc');

// Toast y botones
const toastEl = document.getElementById('gallery-toast');
const toastTextEl = document.getElementById('toast-text');
const shareBtn = document.getElementById('share-gallery-btn');

let currentPhotoIndex = 0;

// ===================================================
// FUNCIONALIDAD DEL LIGHTBOX
// ===================================================

function openLightbox(index) {
  currentPhotoIndex = (index + PHOTOS_DATA.length) % PHOTOS_DATA.length;
  updateLightboxContent();
  lightboxModal.classList.add('active');
  lightboxModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
}

function closeLightbox() {
  lightboxModal.classList.remove('active');
  lightboxModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateLightboxContent() {
  const photo = PHOTOS_DATA[currentPhotoIndex];
  if (!photo) return;

  lightboxImg.src = photo.src;
  lightboxImg.alt = photo.title;
  lightboxTitle.textContent = photo.title;
  lightboxCounter.textContent = `Foto ${currentPhotoIndex + 1} de ${PHOTOS_DATA.length}`;
  lightboxDesc.textContent = photo.caption;
}

function nextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % PHOTOS_DATA.length;
  updateLightboxContent();
}

function prevPhoto() {
  currentPhotoIndex = (currentPhotoIndex - 1 + PHOTOS_DATA.length) % PHOTOS_DATA.length;
  updateLightboxContent();
}

// Configurar clics en cada tarjeta de foto
document.querySelectorAll('.photo-card').forEach((card) => {
  const index = parseInt(card.getAttribute('data-index'), 10);
  const mediaWrapper = card.querySelector('.photo-media-wrapper');

  if (mediaWrapper) {
    mediaWrapper.addEventListener('click', () => {
      openLightbox(index);
    });
  }
});

// Event Listeners del Lightbox
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
if (lightboxNext) lightboxNext.addEventListener('click', nextPhoto);
if (lightboxPrev) lightboxPrev.addEventListener('click', prevPhoto);

// Navegación por teclado (Flechas y Escape)
window.addEventListener('keydown', (e) => {
  if (!lightboxModal || !lightboxModal.classList.contains('active')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextPhoto();
  if (e.key === 'ArrowLeft') prevPhoto();
});

// ===================================================
// SISTEMA DE REACCIONES (LIKES CON PERSISTENCIA LOCALSTORAGE)
// Guarda el contador y el estado de like para cada foto
// para que se mantengan la próxima vez que el usuario entre.
// ===================================================

const STORAGE_KEY_LIKES = 'galeria_fotos_likes_v1';

// Obtener los datos guardados en localStorage de manera segura
function getStoredLikes() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_LIKES);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.warn('No se pudo acceder a localStorage para leer los likes:', err);
    return {};
  }
}

// Guardar los datos actualizados en localStorage
function saveStoredLikes(likesData) {
  try {
    localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(likesData));
  } catch (err) {
    console.warn('No se pudo guardar en localStorage:', err);
  }
}

// Actualizar la interfaz de cada tarjeta con los datos guardados
function syncLikesUI() {
  const storedLikes = getStoredLikes();

  document.querySelectorAll('.photo-card').forEach((card, index) => {
    const photoKey = card.getAttribute('data-index') || String(index);
    const btn = card.querySelector('.like-btn');
    if (!btn) return;
    const counter = btn.querySelector('.like-counter');

    // Valor base del HTML si no hay registro aún
    const baseCount = counter ? (parseInt(counter.textContent.trim(), 10) || 1) : 1;

    if (storedLikes[photoKey]) {
      const item = storedLikes[photoKey];
      if (counter && typeof item.count === 'number') {
        counter.textContent = item.count;
      }
      if (item.liked) {
        btn.classList.add('liked');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('liked');
        btn.setAttribute('aria-pressed', 'false');
      }
    } else {
      // Registrar valor inicial
      storedLikes[photoKey] = {
        count: baseCount,
        liked: false
      };
      btn.setAttribute('aria-pressed', 'false');
    }
  });

  saveStoredLikes(storedLikes);
}

// Configurar los eventos de clic en los botones de like
function setupLikesListeners() {
  document.querySelectorAll('.like-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Evitar abrir el lightbox

      const card = btn.closest('.photo-card');
      const photoKey = card ? (card.getAttribute('data-index') || '0') : '0';
      const counter = btn.querySelector('.like-counter');

      const storedLikes = getStoredLikes();
      const currentItem = storedLikes[photoKey] || {
        count: counter ? (parseInt(counter.textContent.trim(), 10) || 1) : 1,
        liked: btn.classList.contains('liked')
      };

      const willLike = !currentItem.liked;

      if (willLike) {
        currentItem.liked = true;
        currentItem.count = (typeof currentItem.count === 'number' ? currentItem.count : 1) + 1;
        btn.classList.add('liked');
        btn.setAttribute('aria-pressed', 'true');

        showToast('¡Le enviaste amor a este recuerdo! 💖');

        // Si se dio like, agregar algunos corazoncitos al fondo
        if (typeof createHeart === 'function' && Array.isArray(hearts)) {
          for (let i = 0; i < 5; i++) {
            if (hearts.length < 180) hearts.push(createHeart(true));
          }
        }
      } else {
        currentItem.liked = false;
        // Reducir like manteniendo mínimo 1 (el like base inicial)
        currentItem.count = Math.max(1, (typeof currentItem.count === 'number' ? currentItem.count : 2) - 1);
        btn.classList.remove('liked');
        btn.setAttribute('aria-pressed', 'false');

        showToast('Reacción actualizada 🤍');
      }

      // Micro-animación en el contador numérico
      if (counter) {
        counter.textContent = currentItem.count;
        counter.style.display = 'inline-block';
        counter.style.transition = 'transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        counter.style.transform = 'scale(1.35)';
        setTimeout(() => {
          counter.style.transform = 'scale(1)';
        }, 180);
      }

      // Guardar inmediatamente en localStorage
      storedLikes[photoKey] = currentItem;
      saveStoredLikes(storedLikes);
    });
  });

  // Sincronizar en tiempo real si tiene varias pestañas abiertas
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY_LIKES) {
      syncLikesUI();
    }
  });
}

// Inicializar datos al cargar la página
syncLikesUI();
setupLikesListeners();

// ===================================================
// MOTOR DE ABRAZOS VIRTUALES Y CORAZONES FLOTANTES
// Al presionar continuamente el botón, se multiplican los
// corazones en el fondo y se aceleran cada vez más rápido.
// ===================================================

const canvas = document.getElementById('gallery-hearts-canvas');
let ctx = null;
let animationFrameId = null;

// Paleta violeta y azul con toques de rosa amoroso
const GALLERY_HEART_COLORS = [
  '#8b5cf6', // Violeta
  '#a855f7', // Púrpura
  '#3b82f6', // Azul real
  '#60a5fa', // Azul cielo
  '#38bdf8', // Celeste brillante
  '#c084fc', // Lavanda
  '#7c3aed', // Índigo violeta
  '#ff4d6d', // Rosa amor
  '#fda4af'  // Blush
];

let hearts = [];
let baseHeartCount = 35;
let globalSpeedMultiplier = 1.0;
let width = window.innerWidth;
let height = window.innerHeight;
let lastHugClickTime = 0;

// Función principal al pulsar "Enviar un Abrazo Virtual"
function sendVirtualHug() {
  lastHugClickTime = Date.now();

  // 1. Aumentar la velocidad en 1.0 por cada pulsación continua
  globalSpeedMultiplier = Math.min(15.0, globalSpeedMultiplier + 1.0);

  // 2. Hacer aparecer muchos más corazones directamente en el fondo
  const heartsToAdd = 18;
  for (let i = 0; i < heartsToAdd; i++) {
    if (hearts.length < 180) {
      hearts.push(createHeart(true));
    }
  }

  // 3. Notificación cariñosa (sin números ni velocidades)
  showToast('¡Abrazo virtual enviado con todo mi amor! 💜✨');
}

// Cada 20 milisegundos: si pasaron 2 segundos sin apretar el botón,
// baja drásticamente la velocidad reduciendo 1.0 hasta llegar a 1.0
setInterval(() => {
  if (globalSpeedMultiplier > 1.0) {
    const timeSinceLastClick = Date.now() - lastHugClickTime;
    if (timeSinceLastClick >= 2000) {
      globalSpeedMultiplier = Math.max(1.0, globalSpeedMultiplier - 1.0);
    }
  }
}, 20);

// Conectar el botón de abrazo virtual de abajo
document.querySelectorAll('.btn-hug-trigger').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    sendVirtualHug();

    // Pequeño rebote táctil en el botón
    btn.style.transform = 'scale(0.94)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 120);
  });
});

function showToast(message) {
  if (!toastEl) return;
  if (toastTextEl) toastTextEl.textContent = message;
  toastEl.classList.add('show');

  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2500);
}

function initCanvas() {
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  resizeCanvas();

  baseHeartCount = width < 600 ? 25 : 40;
  hearts = [];
  for (let i = 0; i < baseHeartCount; i++) {
    hearts.push(createHeart(true));
  }

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

window.addEventListener('resize', resizeCanvas);

function createHeart(randomY = false) {
  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : height + 25 + Math.random() * 40,
    size: Math.random() * 16 + 10,
    speedY: Math.random() * 0.75 + 0.45,
    wobbleSpeed: Math.random() * 0.025 + 0.015,
    wobbleAmplitude: Math.random() * 1.6 + 0.6,
    wobbleOffset: Math.random() * Math.PI * 2,
    color: GALLERY_HEART_COLORS[Math.floor(Math.random() * GALLERY_HEART_COLORS.length)],
    opacity: Math.random() * 0.28 + 0.16, // Transparente para nunca tapar nada
    rotation: (Math.random() - 0.5) * 0.35,
    pulseSpeed: Math.random() * 0.035 + 0.02,
    pulseOffset: Math.random() * Math.PI * 2
  };
}

function drawHeart(context, x, y, size, color, opacity, rotation = 0) {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);

  const scale = size / 30;
  context.scale(scale, scale);

  context.beginPath();
  context.moveTo(0, -6);
  context.bezierCurveTo(-18, -24, -30, 4, 0, 26);
  context.bezierCurveTo(30, 4, 18, -24, 0, -6);
  context.closePath();

  context.fillStyle = color;
  context.globalAlpha = opacity;
  context.shadowColor = color;
  context.shadowBlur = 8;
  context.fill();

  context.restore();
}

let tick = 0;

function animateHearts() {
  if (!ctx) return;
  tick++;

  ctx.clearRect(0, 0, width, height);

  // Dibujar y mover cada corazón en el fondo
  for (let i = 0; i < hearts.length; i++) {
    const h = hearts[i];

    // Mover hacia arriba multiplicado por la velocidad acelerada
    h.y -= h.speedY * globalSpeedMultiplier;

    // Oscilación lateral
    const currentWobble = Math.sin(tick * h.wobbleSpeed + h.wobbleOffset) * h.wobbleAmplitude;
    h.x += currentWobble * (1 + (globalSpeedMultiplier - 1) * 0.25);

    // Latido sutil
    const pulse = 1 + Math.sin(tick * h.pulseSpeed + h.pulseOffset) * 0.08;
    const currentSize = h.size * pulse;

    drawHeart(ctx, h.x, h.y, currentSize, h.color, h.opacity, h.rotation + currentWobble * 0.1);

    // Cuando el corazón supera la parte superior de la pantalla
    if (h.y < -40) {
      // Si hay exceso de corazones y la velocidad ya bajó a 1.0 tras 2 segundos, reducirlos gradualmente
      if (hearts.length > baseHeartCount && globalSpeedMultiplier <= 1.0 && (Date.now() - lastHugClickTime >= 2000) && Math.random() < 0.3) {
        hearts.splice(i, 1);
        i--;
      } else {
        hearts[i] = createHeart(false);
      }
    }
  }

  animationFrameId = requestAnimationFrame(animateHearts);
}

// Iniciar al cargar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCanvas);
} else {
  initCanvas();
}
