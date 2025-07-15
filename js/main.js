const slides = document.querySelectorAll('.slide');
let currentIndex = 0;
let isScrolling = false;

function resetAnimations(elements) {
  elements.forEach(el => {
    el.style.animation = 'none';
    el.classList.remove(
      'fade-in-up', 'fade-in-down',
      'fade-out-up', 'fade-out-down',
      'delay-1', 'delay-2', 'delay-3', 'delay-4'
    );
    void el.offsetWidth; // Fuerza el reflow
    el.style.animation = '';
  });
}

function animateElements(elements, direction, type = 'in') {
  elements.forEach((el, i) => {
    const delay = `delay-${i + 1}`;
    const animationClass = type === 'in'
      ? (direction === 'down' ? 'fade-in-up' : 'fade-in-down')
      : (direction === 'down' ? 'fade-out-up' : 'fade-out-down');

    el.classList.add(delay, animationClass);
    console.log(`➡️ ${type.toUpperCase()} | ${el.className} ← ${animationClass}`);
  });
}

function updateScrollIndicator(index) {
  const dots = document.querySelectorAll('.scroll-indicator .dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function showSlide(index, direction) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  document.body.className = slides[index].dataset.bg;

  const newEls = slides[index].querySelectorAll('.animated-element');
  resetAnimations(newEls);
  
  // Pequeño delay para forzar reflow antes de animar
  setTimeout(() => {
    animateElements(newEls, direction, 'in');
  }, 10);

  // 🟢 Actualizamos los puntitos
  updateScrollIndicator(index);
}

function scrollSlides(e) {
  if (isScrolling) return;
  isScrolling = true;

  const direction = e.deltaY > 0 ? 'down' : 'up';

  const currentSlide = slides[currentIndex];
  const currentEls = currentSlide.querySelectorAll('.animated-element');

  animateElements(currentEls, direction, 'out');

  setTimeout(() => {
    resetAnimations(currentEls);

    currentIndex = direction === 'down'
      ? Math.min(currentIndex + 1, slides.length - 1)
      : Math.max(currentIndex - 1, 0);

    showSlide(currentIndex, direction);
    isScrolling = false;
  }, 600);
}

window.addEventListener('wheel', scrollSlides, { passive: false });

window.addEventListener('DOMContentLoaded', () => {
  const firstSlideEls = slides[0].querySelectorAll('.animated-element');
  animateElements(firstSlideEls, 'down', 'in');
  updateScrollIndicator(0); // Aseguramos que el primer punto esté activo al inicio
});
