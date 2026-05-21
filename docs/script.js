// Product catalog
const products = [
  // Computers
  { id: 'synapse-quantum', name: 'Synapse Quantum', price: 600, category: 'computers', icon: '🖥️' },
  { id: 'nebula-800', name: 'Nebula 800 Gaming', price: 650, category: 'computers', icon: '🎮' },
  { id: 'abstract-air', name: 'Abstract Air', price: 700, category: 'computers', icon: '💨' },
  { id: 'sentinal-400', name: 'Sentinal 400', price: 700, category: 'computers', icon: '⚡' },

  // Phones
  { id: 'unity-max140', name: 'UNITY MAX 140', price: 400, category: 'phones', icon: '📱' },
  { id: 'cipherflux', name: 'CipherFlux', price: 450, category: 'phones', icon: '🔐' },
  { id: 'turboflex-flip', name: 'Turboflex Flip', price: 550, category: 'phones', icon: '📂' },
  { id: 'astral-horizon', name: 'Astral Horizon', price: 500, category: 'phones', icon: '🌌' },

  // Chips
  { id: 'neural-weave', name: 'Neural Weave x-1', price: 150, category: 'chips', icon: '🧬' },
  { id: 'quantus-core', name: 'Quantus Metamorphic', price: 110, category: 'chips', icon: '💎' },

  // Accessories
  { id: 'zx360-headset', name: 'zx-360 Headset', price: 400, category: 'accessories', icon: '🎧' },
  { id: 'photon-vest', name: 'Photon Core VR Vest', price: 150, category: 'accessories', icon: '🦾' },
  { id: 'neural-x-glasses', name: 'Neural X Glasses', price: 110, category: 'accessories', icon: '🥽' },
  { id: 'matrix-2a', name: 'Matrix Model 2A', price: 110, category: 'accessories', icon: '👓' },
];

// Cart management
let cart = JSON.parse(localStorage.getItem('unityCart')) || {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  updateCartUI();
  setupFilterButtons();
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

// Cart functions
function openCart() {
  document.getElementById('cartModal').classList.add('open');
}

function closeCart() {
  document.getElementById('cartModal').classList.remove('open');
}

document.getElementById('cartBtn')?.addEventListener('click', openCart);

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  if (!cart[productId]) {
    cart[productId] = { ...product, quantity: 1 };
  } else {
    cart[productId].quantity += 1;
  }

  saveCart();
  updateCartUI();

  // Show feedback
  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = 'Added ✓';
  btn.style.background = 'rgba(52,211,153,0.2)';
  btn.style.color = '#34d399';
  btn.style.borderColor = '#34d399';

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = 'rgba(56,189,248,0.2)';
    btn.style.color = 'var(--cyan)';
    btn.style.borderColor = 'var(--cyan)';
  }, 1500);
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
  updateCartUI();
}

function updateQuantity(productId, change) {
  if (cart[productId]) {
    cart[productId].quantity += change;
    if (cart[productId].quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartUI();
    }
  }
}

function saveCart() {
  localStorage.setItem('unityCart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartCount.textContent = totalItems;

  if (totalItems === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
  } else {
    cartItems.innerHTML = Object.entries(cart)
      .map(([id, item]) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">§ ${item.price} × ${item.quantity}</div>
          </div>
          <div class="cart-item-actions">
            <button class="qty-btn" onclick="updateQuantity('${id}', -1)">−</button>
            <div class="qty-display">${item.quantity}</div>
            <button class="qty-btn" onclick="updateQuantity('${id}', 1)">+</button>
            <button class="remove-btn" onclick="removeFromCart('${id}')">🗑</button>
          </div>
        </div>
      `)
      .join('');
  }

  cartTotal.textContent = totalPrice + ' §';
}

function checkout() {
  if (Object.keys(cart).length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const items = Object.values(cart)
    .map(item => `${item.name} (×${item.quantity})`)
    .join(', ');
  const total = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);

  alert(`Pre-order confirmed!\n\nItems: ${items}\n\nTotal: § ${total}\n\nYour order has been saved to your cart.`);
  // In a real scenario, this would send data to a server
}

// Product rendering
function renderProducts(category = 'all') {
  const grid = document.getElementById('productsGrid');
  const filtered = category === 'all'
    ? products
    : products.filter(p => p.category === category);

  grid.innerHTML = filtered
    .map(product => `
      <div class="product-card">
        <div class="product-icon">${product.icon}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">§ ${product.price}</div>
        <button class="product-cart-btn" onclick="addToCart('${product.id}')">Add to Cart</button>
      </div>
    `)
    .join('');
}

// Filter functionality
function setupFilterButtons() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.category);
    });
  });
}

// Survey function
function openSurvey() {
  const surveyLink = 'https://forms.google.com/';
  alert('Survey link:\n' + surveyLink + '\n\nThis will open a Google Form where you can provide feedback about Unity Studios.');
  // In production, replace with actual survey link
  // window.open(surveyLink, '_blank');
}

// Particle system
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDuration = (6 + Math.random() * 14) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
    container.appendChild(p);
  }
}
createParticles();

// Intersection observer for process items
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.process-item').forEach(el => observer.observe(el));

// Contact form handler
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
    success.classList.add('visible');
    e.target.reset();
    setTimeout(() => success.classList.remove('visible'), 5000);
  }, 1200);
}

// Smooth active link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const scrollSpy = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + id
            ? 'var(--cyan)'
            : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => scrollSpy.observe(s));
