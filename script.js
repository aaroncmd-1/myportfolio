// ============ MOBILE MENU ============
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============ NAVBAR GOES SOLID ON SCROLL ============
const navbar = document.getElementById('navbar');

function updateNavbar() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNavbar);
updateNavbar(); // run once in case the page loads already scrolled

// ============ ACTIVE NAV LINK ON SCROLL ============
// Highlights whichever section is currently in view
const sections = document.querySelectorAll('main [id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeLinkObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' }); // triggers when a section crosses the middle of the screen

sections.forEach(section => activeLinkObserver.observe(section));

// ============ PROJECT IMAGE CAROUSEL ============
const projectCarousels = document.querySelectorAll('.project-carousel');

projectCarousels.forEach((carousel) => {
  const imageEl = carousel.querySelector('img');
  const prevBtn = carousel.parentElement?.querySelector('.project-carousel-prev');
  const nextBtn = carousel.parentElement?.querySelector('.project-carousel-next');
  const imageSources = carousel.dataset.images?.split(',').map(src => src.trim()).filter(Boolean) || [];

  if (!imageEl || (!prevBtn && !nextBtn) || imageSources.length <= 1) return;

  let currentIndex = 0;
  let autoplayId;

  function showImage(index) {
    currentIndex = (index + imageSources.length) % imageSources.length;
    imageEl.src = imageSources[currentIndex];
    imageEl.alt = `${carousel.dataset.title || 'Project'} preview ${currentIndex + 1}`;
  }

  function startAutoplay() {
    clearInterval(autoplayId);
    autoplayId = setInterval(() => {
      showImage(currentIndex + 1);
    }, 4000);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showImage(currentIndex - 1);
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showImage(currentIndex + 1);
      startAutoplay();
    });
  }

  carousel.addEventListener('mouseenter', () => clearInterval(autoplayId));
  carousel.addEventListener('mouseleave', startAutoplay);
  startAutoplay();
});

// ============ CERTIFICATES CAROUSEL ============
const track = document.getElementById('certsTrack');
const prevBtn = document.getElementById('certPrev');
const nextBtn = document.getElementById('certNext');
const dotsWrap = document.getElementById('certDots');

if (track && prevBtn && nextBtn && dotsWrap) {
  const slides = Array.from(track.children);

  // Build one dot per slide
  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => {
      slide.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  // Scroll one slide's width at a time
  function scrollByOneSlide(direction) {
    const slideWidth = slides[0].getBoundingClientRect().width + 20; // 20 = gap
    track.scrollBy({ left: direction * slideWidth, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => scrollByOneSlide(-1));
  nextBtn.addEventListener('click', () => scrollByOneSlide(1));

  // Highlight the dot for whichever slide is currently in view
  const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = slides.indexOf(entry.target);
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
      }
    });
  }, { root: track, threshold: 0.6 });

  slides.forEach(slide => dotObserver.observe(slide));
}

// ============ ROTATING ROLE TEXT (typewriter) ============
const roleText = document.getElementById('roleText');
const roles = ['UI/UX Designer', 'Frontend Developer', 'Problem Solver'];

if (roleText) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      if (charIndex > current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400); // pause before deleting
        return;
      }
    } else {
      charIndex--;
      if (charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
      }
    }

    roleText.textContent = current.slice(0, charIndex);
    setTimeout(typeLoop, deleting ? 40 : 80);
  }

  setTimeout(typeLoop, 1400); // start after the first role has been shown a moment
}

// ============ LIGHT / DARK THEME TOGGLE ============
const themeBtn = document.getElementById('themeBtn');
const htmlEl = document.documentElement;

// Remember the user's choice between visits
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  htmlEl.setAttribute('data-theme', 'dark');
  themeBtn.textContent = '☀️';
}

themeBtn.addEventListener('click', () => {
  const isDark = htmlEl.getAttribute('data-theme') === 'dark';

  if (isDark) {
    htmlEl.removeAttribute('data-theme');
    themeBtn.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  } else {
    htmlEl.setAttribute('data-theme', 'dark');
    themeBtn.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  }
});
