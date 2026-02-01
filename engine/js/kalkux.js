// Kalkux Engine v0.1.0-alpha
// Copyright (C) 2025 Kalkux contributors
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.
//
// E-commerce engine powered by JSON config
// Supports local files and remote API
// https://github.com/chuchurex/kalkux

const Kalkux = {
  version: '1.1.0',
  storeId: null,
  config: null,
  theme: null,
  products: null,
  currentProduct: null,
  selectedVariants: {},

  // ---- DATA SOURCE ----
  // Reads from data-kx-api attribute on <script> tag, or defaults to local files.
  // Local:  <script src="js/kalkux.js">
  // API:    <script src="js/kalkux.js" data-kx-api="https://api.kalkux.com/v1" data-kx-store="kilig">

  getDataSource() {
    const script = document.querySelector('script[src*="kalkux"]');
    const apiBase = script?.dataset.kxApi;
    const storeId = script?.dataset.kxStore;

    if (apiBase && storeId) {
      this.storeId = storeId;
      return {
        mode: 'api',
        config: `${apiBase}/stores/${storeId}/config`,
        theme: `${apiBase}/stores/${storeId}/theme`,
        products: `${apiBase}/stores/${storeId}/products`
      };
    }

    this.storeId = 'local';
    return {
      mode: 'local',
      config: 'data/config.json',
      theme: 'data/theme.json',
      products: 'data/products.json'
    };
  },

  // ---- INIT ----

  async init() {
    try {
      const src = this.getDataSource();
      const [config, theme, products] = await Promise.all([
        fetch(src.config).then(r => r.json()),
        fetch(src.theme).then(r => r.json()),
        fetch(src.products).then(r => r.json())
      ]);
      this.config = config;
      this.theme = theme;
      this.products = products;

      this.applyTheme();
      this.renderHead();
      this.renderHeader();
      this.renderHero();
      this.renderAbout();
      this.renderProductSections();
      this.renderGallery();
      this.renderContact();
      this.renderFooter();
      this.configureSnipcart();
      this.initializeNavigation();
      this.initializeSmoothScroll();

      document.body.classList.add('kx-loaded');
      console.log(`Kalkux v${this.version} | store: ${this.storeId} | mode: ${src.mode}`);
    } catch (err) {
      console.error('Kalkux: Error loading store data', err);
    }
  },

  // ---- THEME ----

  applyTheme() {
    const root = document.documentElement;
    const t = this.theme;

    Object.entries(t.colors).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--color-${cssKey}`, value);
    });

    Object.entries(t.spacing).forEach(([k, v]) => root.style.setProperty(`--spacing-${k}`, v));
    Object.entries(t.radius).forEach(([k, v]) => root.style.setProperty(`--radius-${k}`, v));
    Object.entries(t.shadows).forEach(([k, v]) => root.style.setProperty(`--shadow-${k}`, v));

    root.style.setProperty('--font-heading', this.config.fonts.heading.family);
    root.style.setProperty('--font-body', this.config.fonts.body.family);
  },

  // ---- HEAD ----

  renderHead() {
    const c = this.config;
    document.title = `${c.store.name} – ${c.store.tagline}`;
    document.querySelector('meta[name="description"]').setAttribute('content', c.store.description);

    const fontLink = document.getElementById('kx-fonts');
    if (fontLink) fontLink.href = c.fonts.heading.url;

    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/png';
      document.head.appendChild(favicon);
    }
    favicon.href = c.store.favicon;
  },

  // ---- HEADER ----

  renderHeader() {
    const c = this.config;
    document.getElementById('kx-header').innerHTML = `
      <div class="container header-content">
        <a href="/" class="logo">
          <img src="${c.store.logo}" alt="${c.store.name}" width="180" height="auto">
        </a>
        <nav class="nav" id="nav">
          ${c.navigation.map(n => `<a href="${n.href}" class="nav-link">${n.label}</a>`).join('')}
        </nav>
        <button class="cart-btn snipcart-checkout">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span class="snipcart-items-count">0</span>
        </button>
        <button class="menu-toggle" id="menu-toggle" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    `;
  },

  // ---- HERO ----

  renderHero() {
    const h = this.config.hero;
    document.getElementById('inicio').innerHTML = `
      <div class="hero-bg">
        <img src="${h.backgroundImage}" alt="${h.title}" loading="eager">
      </div>
      <div class="hero-content">
        <span class="hero-tag">${h.tag}</span>
        <h1>${h.title}</h1>
        <p>${h.subtitle}</p>
        <a href="${h.cta.href}" class="btn btn-primary">${h.cta.label}</a>
      </div>
    `;
  },

  // ---- ABOUT ----

  renderAbout() {
    const a = this.config.about;
    if (!a || !a.enabled) return;

    const el = document.getElementById('kx-about');
    el.id = a.sectionId;
    el.innerHTML = `
      <div class="container">
        <div class="about-grid">
          <div class="about-images">
            ${a.images.map(img => `<img src="${img.src}" alt="${img.alt}" loading="lazy">`).join('')}
          </div>
          <div class="about-content">
            <span class="section-tag">${a.tag}</span>
            <h2>${a.title}</h2>
            ${a.paragraphs.map(p => `<p>${p}</p>`).join('')}
            ${a.highlight ? `
              <div class="about-highlight">
                <h3>${a.highlight.title}</h3>
                <p>${a.highlight.text}</p>
              </div>
            ` : ''}
            ${a.closingText ? `<p>${a.closingText}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  },

  // ---- PRODUCT SECTIONS ----

  renderProductSections() {
    const container = document.getElementById('kx-product-sections');
    const sections = this.config.productSections;

    container.innerHTML = sections.map(section => {
      const sectionProducts = this.products.products.filter(p => p.category === section.category);
      const gridClass = section.gridStyle === 'compact' ? 'products-grid accessories-grid' : 'products-grid';
      const sectionClass = section.gridStyle === 'compact' ? 'products accessories' : 'products';

      return `
        <section class="${sectionClass}" id="${section.id}">
          <div class="container">
            <div class="section-header">
              <span class="section-tag">${section.tag}</span>
              <h2>${section.title}</h2>
              <p>${section.subtitle}</p>
            </div>
            <div class="${gridClass}">
              ${sectionProducts.map(p => this.renderProductCard(p)).join('')}
            </div>
          </div>
        </section>
      `;
    }).join('');
  },

  // ---- PRODUCT CARD ----

  renderProductCard(product) {
    const isSimple = product.variants.length === 0;

    if (isSimple) {
      const price = product.pricing.price;
      return `
        <article class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-price">${this.formatPrice(price)}</p>
            <button class="btn btn-secondary snipcart-add-item"
              data-item-id="${product.id}"
              data-item-name="${product.name}"
              data-item-price="${price}"
              data-item-url="/"
              data-item-image="${product.image}">
              Agregar al Carro
            </button>
          </div>
        </article>
      `;
    }

    // Product with variants
    const stockClass = product.inStock ? '' : ' out-of-stock';
    const badgeClass = product.inStock ? '' : ' badge-out';
    const badgeText = product.badge || (product.inStock ? 'Disponible' : 'Agotado');
    const prices = product.pricing.prices;
    const minPrice = Math.min(...Object.values(prices).filter(p => p > 0));
    const displayPrice = product.inStock ? `Desde ${this.formatPrice(minPrice)}` : '-';

    return `
      <article class="product-card${stockClass}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <span class="product-badge${badgeClass}">${badgeText}</span>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          ${product.tags ? `<p class="product-notes">${product.tags.join(', ')}</p>` : ''}
          ${product.attributes ? `
            <div class="product-details">
              ${product.attributes.slice(0, 3).map(a => `<span>${a.value}</span>`).join('')}
            </div>
          ` : ''}
          <p class="product-price">${displayPrice}</p>
          ${product.inStock
            ? `<button class="btn btn-secondary" onclick="Kalkux.openProductModal('${product.id}')">Ver Opciones</button>`
            : `<button class="btn btn-disabled" disabled>Sin Stock</button>`
          }
        </div>
      </article>
    `;
  },

  // ---- GALLERY ----

  renderGallery() {
    const g = this.config.gallery;
    if (!g || !g.enabled) return;

    document.getElementById('kx-gallery').innerHTML = `
      <div class="gallery-grid">
        ${g.images.map(img => `<img src="${img.src}" alt="${img.alt}" loading="lazy">`).join('')}
      </div>
    `;
  },

  // ---- CONTACT ----

  renderContact() {
    const ct = this.config.contact;
    if (!ct || !ct.enabled) return;

    const el = document.getElementById('kx-contact');
    el.id = ct.sectionId;

    const locationSvg = '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
    const phoneSvg = '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
    const emailSvg = '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';

    el.innerHTML = `
      <div class="container">
        <div class="contact-grid">
          <div class="contact-info">
            <span class="section-tag">${ct.tag}</span>
            <h2>${ct.title}</h2>
            ${ct.locations.map(loc => `
              <div class="contact-item">
                ${locationSvg}
                <div>
                  <strong>${loc.name}</strong>
                  <p>${loc.address.replace(/\n/g, '<br>')}</p>
                </div>
              </div>
            `).join('')}
            ${ct.whatsapp ? `
              <div class="contact-item">
                ${phoneSvg}
                <div>
                  <strong>WhatsApp</strong>
                  <p><a href="https://wa.me/${ct.whatsapp.number}">${ct.whatsapp.display}</a></p>
                </div>
              </div>
            ` : ''}
            ${ct.email ? `
              <div class="contact-item">
                ${emailSvg}
                <div>
                  <strong>Email</strong>
                  <p><a href="mailto:${ct.email}">${ct.email}</a></p>
                </div>
              </div>
            ` : ''}
          </div>
          <div class="contact-hours">
            <h3>Horario de Atenci&oacute;n</h3>
            <ul class="hours-list">
              ${ct.hours.map(h => `<li><span>${h.days}</span><span>${h.time}</span></li>`).join('')}
            </ul>
            ${ct.paymentMethodsImage ? `
              <div class="payment-methods">
                <h4>M&eacute;todos de Pago</h4>
                <img src="${ct.paymentMethodsImage}" alt="Metodos de Pago" width="200">
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  // ---- FOOTER ----

  renderFooter() {
    const c = this.config;
    const instagramSvg = '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';

    document.getElementById('kx-footer').innerHTML = `
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <img src="${c.store.logo}" alt="${c.store.name}" width="150">
            <p>${c.store.tagline}<br>Santiago de Chile</p>
          </div>
          <div class="footer-links">
            ${c.navigation.map(n => `<a href="${n.href}">${n.label}</a>`).join('')}
          </div>
          <div class="footer-social">
            ${c.social.instagram ? `<a href="${c.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${instagramSvg}</a>` : ''}
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${c.store.year} ${c.store.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    `;
  },

  // ---- SNIPCART ----

  configureSnipcart() {
    const sc = document.getElementById('snipcart');
    if (sc && this.config.snipcart) {
      sc.setAttribute('data-api-key', this.config.snipcart.apiKey);
      sc.setAttribute('data-config-modal-style', this.config.snipcart.modalStyle || 'side');
    }
  },

  // ---- MODAL ----

  openProductModal(productId) {
    const product = this.products.products.find(p => p.id === productId);
    if (!product) return;

    this.currentProduct = product;
    this.selectedVariants = {};

    product.variants.forEach(variantId => {
      const variantType = this.products.variantTypes.find(v => v.id === variantId);
      if (variantType) {
        this.selectedVariants[variantId] = variantType.options[0].value;
      }
    });

    this.renderModal();
    document.getElementById('product-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
    document.body.style.overflow = '';
    this.currentProduct = null;
    this.selectedVariants = {};
  },

  renderModal() {
    const product = this.currentProduct;
    if (!product) return;

    const currentPrice = this.getCurrentPrice();

    const variantSelectors = product.variants.map(variantId => {
      const variantType = this.products.variantTypes.find(v => v.id === variantId);
      if (!variantType) return '';
      return `
        <div class="variant-group">
          <label for="modal-${variantId}">${variantType.label}</label>
          <select id="modal-${variantId}" onchange="Kalkux.updateVariant('${variantId}', this.value)">
            ${variantType.options.map(opt =>
              `<option value="${opt.value}" ${opt.value === this.selectedVariants[variantId] ? 'selected' : ''}>${opt.label}</option>`
            ).join('')}
          </select>
        </div>
      `;
    }).join('');

    const customFieldAttrs = (product.snipcart?.customFields || []).map((cf, i) => {
      const num = i + 1;
      const variantType = this.products.variantTypes.find(v => v.id === cf.variantId);
      const selectedValue = this.selectedVariants[cf.variantId];
      const displayLabel = variantType?.options.find(o => o.value === selectedValue)?.label || selectedValue;
      return `data-item-custom${num}-name="${cf.name}" data-item-custom${num}-value="${displayLabel}"`;
    }).join(' ');

    document.getElementById('modal-body').innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="modal-product-image">
      <h3>${product.name}</h3>
      ${product.tags ? `<p class="product-notes">${product.tags.join(', ')}</p>` : ''}
      ${product.description ? `<p style="margin-bottom:1rem;color:var(--color-text-light);">${product.description}</p>` : ''}
      ${product.attributes && product.attributes.length > 1 ? `
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.5rem;margin-bottom:1rem;font-size:0.9rem;">
          ${product.attributes.map(a => `<div><strong>${a.label}:</strong> ${a.value}</div>`).join('')}
        </div>
      ` : ''}
      ${variantSelectors}
      <p class="modal-price" id="modal-price">${this.formatPrice(currentPrice)}</p>
      <button class="btn btn-primary snipcart-add-item" style="width:100%;"
        data-item-id="${this.getSnipcartItemId()}"
        data-item-name="${product.name}"
        data-item-price="${currentPrice}"
        data-item-url="/"
        data-item-description="${this.getVariantDescription()}"
        data-item-image="${product.image}"
        ${customFieldAttrs}>
        Agregar al Carro
      </button>
    `;
  },

  updateVariant(variantId, value) {
    this.selectedVariants[variantId] = value;

    const product = this.currentProduct;
    if (!product) return;

    // Update price if this variant affects pricing
    const currentPrice = this.getCurrentPrice();
    const priceEl = document.getElementById('modal-price');
    if (priceEl) priceEl.textContent = this.formatPrice(currentPrice);

    // Update Snipcart button attributes
    const btn = document.querySelector('#modal-body .snipcart-add-item');
    if (!btn) return;

    btn.setAttribute('data-item-id', this.getSnipcartItemId());
    btn.setAttribute('data-item-price', currentPrice);
    btn.setAttribute('data-item-description', this.getVariantDescription());

    (product.snipcart?.customFields || []).forEach((cf, i) => {
      const num = i + 1;
      const variantType = this.products.variantTypes.find(v => v.id === cf.variantId);
      const selectedValue = this.selectedVariants[cf.variantId];
      const displayLabel = variantType?.options.find(o => o.value === selectedValue)?.label || selectedValue;
      btn.setAttribute(`data-item-custom${num}-value`, displayLabel);
    });
  },

  // ---- NAVIGATION ----

  initializeNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');

    if (menuToggle && nav) {
      menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
      });

      nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('active');
          menuToggle.classList.remove('active');
        });
      });
    }

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      if (!header) return;
      const currentScroll = window.pageYOffset;
      header.style.boxShadow = currentScroll > 100
        ? '0 4px 12px rgba(0,0,0,0.15)'
        : '0 2px 4px rgba(0,0,0,0.1)';
      lastScroll = currentScroll;
    });
  },

  initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      });
    });
  },

  // ---- HELPERS ----

  formatPrice(price) {
    const c = this.config.store.currency;
    return new Intl.NumberFormat(c.locale, {
      style: 'currency',
      currency: c.code,
      minimumFractionDigits: c.decimals,
      maximumFractionDigits: c.decimals
    }).format(price);
  },

  getCurrentPrice() {
    const product = this.currentProduct;
    if (!product) return 0;

    if (product.pricing.type === 'fixed') return product.pricing.price;

    const key = this.selectedVariants[product.pricing.variantKey];
    return product.pricing.prices[key] || 0;
  },

  getSnipcartItemId() {
    const product = this.currentProduct;
    if (!product) return '';
    const parts = [product.id];
    product.variants.forEach(v => {
      if (this.selectedVariants[v]) parts.push(this.selectedVariants[v]);
    });
    return parts.join('-');
  },

  getVariantDescription() {
    const product = this.currentProduct;
    if (!product) return '';
    const parts = [];
    product.variants.forEach(variantId => {
      const variantType = this.products.variantTypes.find(v => v.id === variantId);
      const selectedValue = this.selectedVariants[variantId];
      const displayLabel = variantType?.options.find(o => o.value === selectedValue)?.label || selectedValue;
      parts.push(displayLabel);
    });
    return parts.join(' - ');
  }
};

// Modal close handlers
document.addEventListener('click', (e) => {
  const modal = document.getElementById('product-modal');
  if (e.target === modal) Kalkux.closeProductModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') Kalkux.closeProductModal();
});

// Boot
document.addEventListener('DOMContentLoaded', () => Kalkux.init());
