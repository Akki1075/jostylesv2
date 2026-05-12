// ── JO'STYLE — Main Script ─────────────────────────────────
'use strict';

let galleryData = [];
let activeLightboxData = [];
let lightboxIndex = 0;
let businessData = null;

// ── FETCH DATA ────────────────────────────────────────────
async function loadData() {
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('data.json not found');
    const data = await res.json();
    initSite(data);
  } catch (err) {
    console.error('JO\'STYLE: Could not load data.json —', err);
  }
}

// ── INIT ─────────────────────────────────────────────────
function initSite(data) {
  const { business, founder, services, gallery, testimonials } = data;
  businessData = business;

  applyBusiness(business);
  applyFounder(founder);
  buildServices(services, business);
  buildGallery(gallery);
  buildTestimonials(testimonials);
  buildBookingForm(services, business);
  applyContact(business);

  initNavbar();
  initHamburger();
  initLightbox();
  initServiceDetails();
  initScrollReveal();

  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

// ── BUSINESS ─────────────────────────────────────────────
function applyBusiness(b) {
  document.title = `${b.name} — ${b.tagline}`;
  setText('hero-title', b.name);
  setText('hero-tagline', b.tagline);
  setText('nav-logo', b.name);
  setText('footer-logo', b.name);
  setText('footer-tagline', b.tagline);

  // WhatsApp float
  const wa = document.getElementById('whatsapp-float');
  if (wa) wa.href = `https://wa.me/${b.whatsapp}`;
}

// ── FOUNDER ───────────────────────────────────────────────
function applyFounder(f) {
  setText('founder-name', f.name);
  setText('founder-designation', f.title);
  setText('founder-bio', f.bio);
  const img = document.getElementById('founder-img');
  if (img) { img.src = f.image; img.alt = f.name; }
}

// ── SERVICES ──────────────────────────────────────────────
function buildServices(services, business) {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  grid.innerHTML = services.map((s, i) => `
    <div class="service-card reveal" style="--i:${i}" data-service-index="${i}">
      <img class="service-img" src="${s.image}" alt="${s.name}" onerror="this.style.display='none'" />
      <span class="service-icon">${s.icon}</span>
      <h3 class="service-name">${s.name}</h3>
      <p class="service-desc">${s.description}</p>
      <span class="service-cta">${s.gallery?.length ? 'View examples' : 'Details'}</span>
    </div>
  `).join('');

  grid.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const service = services[parseInt(card.dataset.serviceIndex)];
      if (service.gallerySections?.length) {
        openServiceDetails(service);
        return;
      }

      openLightbox(0, getServiceGalleryItems(service));
    });
  });
}

function getServiceGalleryItems(service) {
  if (service.gallerySections?.length) {
    return service.gallerySections.flatMap(section => section.items);
  }

  return service.gallery?.length
    ? service.gallery
    : [{ src: service.image, caption: service.name }];
}

function initServiceDetails() {
  if (document.getElementById('service-details')) return;

  document.body.insertAdjacentHTML('beforeend', `
    <div id="service-details" class="service-details" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="service-details-panel">
        <button id="service-details-close" class="service-details-close" aria-label="Close service details">Close</button>
        <p class="section-eyebrow">Service Examples</p>
        <h2 id="service-details-title" class="service-details-title"></h2>
        <p id="service-details-desc" class="service-details-desc"></p>
        <div id="service-details-sections" class="service-details-sections"></div>
      </div>
    </div>
  `);

  const modal = document.getElementById('service-details');
  document.getElementById('service-details-close').addEventListener('click', closeServiceDetails);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeServiceDetails();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeServiceDetails();
  });
}

function openServiceDetails(service) {
  const modal = document.getElementById('service-details');
  const title = document.getElementById('service-details-title');
  const desc = document.getElementById('service-details-desc');
  const sections = document.getElementById('service-details-sections');
  const allItems = getServiceGalleryItems(service);

  title.textContent = service.name;
  desc.textContent = service.description;
  sections.innerHTML = service.gallerySections.map(section => `
    <section class="service-example-section">
      <div class="service-example-heading">
        <h3>${section.title}</h3>
        <span>${section.items.length} ${section.items.length === 1 ? 'example' : 'examples'}</span>
      </div>
      <div class="service-example-grid">
        ${section.items.map(item => `
          <button class="service-example-item" type="button" data-src="${item.src}">
            <img src="${item.src}" alt="${item.caption}" loading="lazy" />
            <span>${item.caption}</span>
          </button>
        `).join('')}
      </div>
    </section>
  `).join('');

  sections.querySelectorAll('.service-example-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = allItems.findIndex(photo => photo.src === item.dataset.src);
      openLightbox(Math.max(index, 0), allItems);
    });
  });

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeServiceDetails() {
  const modal = document.getElementById('service-details');
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ── GALLERY ───────────────────────────────────────────────
function buildGallery(gallery) {
  galleryData = gallery;
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = gallery.map((img, i) => `
    <div class="gallery-item reveal" data-index="${i}">
      <img src="${img.src}" alt="${img.caption}" loading="lazy" onerror="this.parentElement.style.display='none'" />
      <div class="gallery-item-overlay">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
        <span>${img.caption}</span>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index), galleryData));
  });
}

// ── LIGHTBOX ──────────────────────────────────────────────
function initLightbox() {
  const lb    = document.getElementById('lightbox');
  const close = document.getElementById('lightbox-close');
  const prev  = document.getElementById('lightbox-prev');
  const next  = document.getElementById('lightbox-next');

  close.addEventListener('click', closeLightbox);
  prev.addEventListener('click',  () => navigateLightbox(-1));
  next.addEventListener('click',  () => navigateLightbox(1));

  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigateLightbox(-1);
    if (e.key === 'ArrowRight')  navigateLightbox(1);
  });
}

function openLightbox(index, items = galleryData) {
  activeLightboxData = items;
  lightboxIndex = index;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  const serviceModal = document.getElementById('service-details');
  document.body.style.overflow = serviceModal?.classList.contains('open') ? 'hidden' : '';
}

function navigateLightbox(dir) {
  lightboxIndex = (lightboxIndex + dir + activeLightboxData.length) % activeLightboxData.length;
  updateLightbox();
}

function updateLightbox() {
  const item = activeLightboxData[lightboxIndex];
  const img  = document.getElementById('lightbox-img');
  const cap  = document.getElementById('lightbox-caption');
  const wa   = document.getElementById('lightbox-whatsapp');
  const imageUrl = new URL(item.src, window.location.href).href;

  img.src = item.src;
  img.alt = item.caption;
  cap.textContent = item.caption;

  if (wa && businessData) {
    const message = [
      `Hello JO'STYLE, I am interested in this design: ${item.caption}`,
      `Image: ${imageUrl}`,
      'Please share details, availability, and price.'
    ].join('\n');

    wa.href = `https://wa.me/${businessData.whatsapp}?text=${encodeURIComponent(message)}`;
  }
}

// ── TESTIMONIALS ──────────────────────────────────────────
function buildTestimonials(testimonials) {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  grid.innerHTML = testimonials.map((t, i) => `
    <div class="testimonial-card reveal" style="--i:${i}">
      <div class="testimonial-stars">
        ${'<span>★</span>'.repeat(t.rating)}
      </div>
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author">
        <strong>${t.name}</strong>
        <span>${t.location}</span>
      </div>
    </div>
  `).join('');
}

// ── BOOKING FORM ──────────────────────────────────────────
function buildBookingForm(services, business) {
  const select = document.getElementById('b-service');
  if (select) {
    services.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.name;
      opt.textContent = s.name;
      select.appendChild(opt);
    });
  }

  // Set min date to today
  const dateInput = document.getElementById('b-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('b-name').value.trim();
    const phone   = document.getElementById('b-phone').value.trim();
    const service = document.getElementById('b-service').value;
    const date    = document.getElementById('b-date').value;
    const note    = document.getElementById('b-note').value.trim();

    if (!name || !service || !date) {
      alert('Please fill in your name, service, and preferred date.');
      return;
    }

    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    let msg = `Hello JO'STYLE! 👋\n\n`;
    msg += `I'd like to book an appointment.\n\n`;
    msg += `📌 *Name:* ${name}\n`;
    if (phone) msg += `📞 *Phone:* ${phone}\n`;
    msg += `✂️ *Service:* ${service}\n`;
    msg += `📅 *Date:* ${formattedDate}\n`;
    if (note) msg += `📝 *Notes:* ${note}\n`;
    msg += `\nPlease confirm my slot. Thank you!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${business.whatsapp}?text=${encoded}`, '_blank');
  });
}

// ── CONTACT ───────────────────────────────────────────────
function applyContact(b) {
  const phoneEl = document.getElementById('contact-phone');
  if (phoneEl) {
    phoneEl.href = `tel:${b.phone}`;
    phoneEl.textContent = b.phone;
  }
  setText('contact-address', b.address);

  const mapsLink = document.getElementById('maps-link');
  if (mapsLink) mapsLink.href = b.mapsUrl;

  const instaLink = document.getElementById('insta-link');
  const instaBtn  = document.getElementById('insta-btn');
  if (instaLink) {
    instaLink.href = b.instagram;
    const handle = b.instagram.split('/').filter(Boolean).pop();
    instaLink.textContent = `@${handle}`;
  }
  if (instaBtn) instaBtn.href = b.instagram;
}

// ── NAVBAR ────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('nav-links').classList.remove('open');
      document.getElementById('hamburger').classList.remove('open');
    });
  });
}

function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });
}

// ── SCROLL REVEAL ─────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  const revealAll = () => {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  };

  // Re-observe after DOM is built by JS
  revealAll();
  // Observe again after slight delay for dynamically added cards
  setTimeout(revealAll, 200);
}

// ── HELPER ────────────────────────────────────────────────
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ── KICK OFF ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadData);
