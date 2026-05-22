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

// ========== GAMES SYSTEM ==========

const games = [
  { id: 'breakout', name: 'Breakout Blocks', icon: '🧱', desc: 'Break all blocks', reward: 140 },
  { id: 'worldly', name: 'Worldly', icon: '🌐', desc: 'Guess the 5-letter word', reward: 160 },
  { id: 'sudoku', name: 'Sudoku', icon: '🔢', desc: 'Fill the 9×9 grid', reward: 180 }
];

let currentGame = null;
let gameRunning = false;
let gameScore = 0;
let gameReward = 0;
let _gameRafId = null;
let _gameTimeouts = [];
let _gameDocListeners = [];
let _gameScoreEl = null;

// requestAnimationFrame-based game loop (60fps, synced with display, pauses when tab hidden)
function gameRAF(loop) {
  const tick = () => {
    if (!gameRunning) return;
    loop();
    _gameRafId = requestAnimationFrame(tick);
  };
  _gameRafId = requestAnimationFrame(tick);
}
function gameSetTimeout(fn, delay) {
  const id = setTimeout(fn, delay);
  _gameTimeouts.push(id);
  return id;
}
function addGameListener(target, type, fn) {
  target.addEventListener(type, fn);
  _gameDocListeners.push({ target, type, fn });
}
function cleanupGame() {
  if (_gameRafId) { cancelAnimationFrame(_gameRafId); _gameRafId = null; }
  _gameTimeouts.forEach(clearTimeout);
  _gameTimeouts = [];
  _gameDocListeners.forEach(({ target, type, fn }) => target.removeEventListener(type, fn));
  _gameDocListeners = [];
  const canvas = document.getElementById('gameCanvas');
  if (canvas) {
    canvas.onclick = null;
    canvas.onmousemove = null;
    canvas.onmousedown = null;
    canvas.onmouseup = null;
    const ctx = canvas.getContext('2d');
    ctx.shadowBlur = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function initGames() {
  const grid = document.getElementById('gamesGrid');
  grid.innerHTML = games.map(game => `
    <div class="game-card" onclick="openGame('${game.id}')">
      <div class="game-icon">${game.icon}</div>
      <div class="game-name">${game.name}</div>
      <div class="game-desc">${game.desc}</div>
      <div class="game-reward-text">§ ${game.reward}</div>
      <button class="game-play-btn">Play Now</button>
    </div>
  `).join('');
}

function openGame(gameId) {
  currentGame = games.find(g => g.id === gameId);
  if (!currentGame) return;
  document.getElementById('gameModal').classList.add('open');
  document.getElementById('gameTitle').textContent = currentGame.name;
  _gameScoreEl = document.getElementById('gameScore');
  _gameScoreEl.textContent = '0';
  document.getElementById('gamePlayBtn').style.display = 'block';
  document.getElementById('gameStopBtn').style.display = 'none';
  document.getElementById('gameReward').style.display = 'none';
  gameScore = 0;
}

function toggleGameFullscreen() {
  const panel = document.querySelector('.game-panel');
  const expand = document.getElementById('fsExpandIcon');
  const compress = document.getElementById('fsCompressIcon');
  const isFs = document.fullscreenElement || document.webkitFullscreenElement;

  if (!isFs) {
    const req = panel.requestFullscreen || panel.webkitRequestFullscreen || panel.mozRequestFullScreen;
    if (req) req.call(panel);
  } else {
    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen;
    if (exit) exit.call(document);
  }
}

const _fsChange = () => {
  const isFs = document.fullscreenElement || document.webkitFullscreenElement;
  document.getElementById('fsExpandIcon').style.display = isFs ? 'none' : '';
  document.getElementById('fsCompressIcon').style.display = isFs ? '' : 'none';
};
document.addEventListener('fullscreenchange', _fsChange);
document.addEventListener('webkitfullscreenchange', _fsChange);

function closeGame() {
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (exit) exit.call(document);
  }
  gameRunning = false;
  cleanupGame();
  document.getElementById('gameModal').classList.remove('open');
  document.getElementById('gamePlayBtn').style.display = 'block';
  document.getElementById('gameStopBtn').style.display = 'none';
  document.getElementById('gameReward').style.display = 'none';
}

function startGame() {
  cleanupGame();
  if (!currentGame) return;
  gameRunning = true;
  gameScore = 0;
  _gameScoreEl = document.getElementById('gameScore');
  _gameScoreEl.textContent = '0';
  document.getElementById('gameReward').style.display = 'none';
  document.getElementById('gamePlayBtn').style.display = 'none';
  document.getElementById('gameStopBtn').style.display = 'block';

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  switch(currentGame.id) {
    case 'breakout': playBreakout(canvas, ctx); break;
    case 'worldly': playWorldly(canvas, ctx); break;
    case 'sudoku': playSudoku(canvas, ctx); break;
  }
}

function stopGame() {
  gameRunning = false;
  cleanupGame();
  document.getElementById('gamePlayBtn').style.display = 'block';
  document.getElementById('gameStopBtn').style.display = 'none';
  if (gameScore > 0 && currentGame) {
    gameReward = currentGame.reward;
    addCreditsToCart(currentGame.id, gameReward, gameScore);
    document.getElementById('gameReward').innerHTML = `
      <strong>🎉 Great Job!</strong><br>
      Score: ${gameScore} | Earned: § ${gameReward}<br>
      <small>Credits added to cart</small>
    `;
    document.getElementById('gameReward').style.display = 'block';
  }
}

function addCreditsToCart(gameId, credits, score) {
  const creditItem = {
    id: gameId + '-' + Date.now(),
    name: `${currentGame.name} (Score: ${score})`,
    price: credits,
    category: 'games',
    quantity: 1
  };
  cart[creditItem.id] = creditItem;
  saveCart();
  updateCartUI();
}

// Game Implementations
function playBreakout(canvas, ctx) {
  const blockW = 58, blockH = 18, gap = 4;
  const cols = Math.floor((canvas.width - 10) / (blockW + gap));
  const rows = 4;
  const rowColors = ['#ef4444', '#f97316', '#eab308', '#38bdf8'];
  const blocks = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      blocks.push({ x: 5 + c * (blockW + gap), y: 50 + r * (blockH + gap), w: blockW, h: blockH, color: rowColors[r], active: true });

  const paddle = { x: canvas.width / 2 - 45, y: canvas.height - 25, w: 90, h: 12 };
  const ball = { x: canvas.width / 2, y: canvas.height - 60, vx: 4.5, vy: -4.5, r: 8 };
  let started = false;

  canvas.onmousemove = (e) => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    paddle.x = Math.max(0, Math.min(canvas.width - paddle.w,
      (e.clientX - rect.left) * (canvas.width / rect.width) - paddle.w / 2));
    if (!started) { ball.x = paddle.x + paddle.w / 2; }
  };
  canvas.onclick = () => { started = true; };

  gameRAF(() => {
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (started) {
      ball.x += ball.vx; ball.y += ball.vy;
      if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx = Math.abs(ball.vx); }
      if (ball.x + ball.r > canvas.width) { ball.x = canvas.width - ball.r; ball.vx = -Math.abs(ball.vx); }
      if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); }

      for (const b of blocks) {
        if (!b.active) continue;
        if (ball.x > b.x && ball.x < b.x + b.w && ball.y > b.y - ball.r && ball.y < b.y + b.h + ball.r) {
          b.active = false; ball.vy *= -1; gameScore++;
        }
      }

      if (ball.y + ball.r >= paddle.y && ball.y - ball.r < paddle.y + paddle.h &&
          ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
        ball.vy = -Math.abs(ball.vy);
        ball.vx += ((ball.x - (paddle.x + paddle.w / 2)) / paddle.w) * 3;
      }
    } else {
      ball.x = paddle.x + paddle.w / 2;
    }

    blocks.forEach(b => {
      if (!b.active) return;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(b.x, b.y, b.w, b.h);
    });

    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6);
    ctx.fill();

    ctx.shadowBlur = 8; ctx.shadowColor = '#fff';
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Orbitron, Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`SCORE: ${gameScore}`, canvas.width / 2, 35);
    if (!started) {
      ctx.font = '14px Arial';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Click to launch ball', canvas.width / 2, canvas.height / 2);
    }
    _gameScoreEl.textContent = gameScore;

    if (ball.y > canvas.height + 20 || blocks.every(b => !b.active)) { gameRunning = false; stopGame(); }
  });
}

function playWorldly(canvas, ctx) {
  const wordList = ['UNITY', 'WORLD', 'PIXEL', 'CYBER', 'NEXUS', 'FORGE', 'CLOUD', 'LOGIC', 'BYTES', 'SOLAR',
                    'LUNAR', 'TITAN', 'QUARK', 'PRISM', 'SONIC', 'SWIFT', 'BURST', 'CHAOS', 'DELTA', 'EPOCH'];
  const secretWord = wordList[Math.floor(Math.random() * wordList.length)];
  let guesses = [];
  let currentGuess = '';
  let gameWon = false;
  let gameOver = false;

  const cellW = 52, cellH = 52, cellGap = 6;
  const gridW = 5 * cellW + 4 * cellGap;
  const gridX = (canvas.width - gridW) / 2;
  const gridY = 70;

  const getColor = (letter, pos) => {
    if (secretWord[pos] === letter) return '#538d4e';
    if (secretWord.includes(letter)) return '#b59f3b';
    return '#3a3a3c';
  };

  addGameListener(document, 'keydown', (e) => {
    if (!gameRunning || gameOver || gameWon) return;
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      currentGuess += key;
    } else if (e.key === 'Backspace') {
      currentGuess = currentGuess.slice(0, -1);
    } else if (e.key === 'Enter' && currentGuess.length === 5) {
      guesses.push(currentGuess);
      if (currentGuess === secretWord) {
        gameWon = true;
        gameScore = (7 - guesses.length) * 25;
        _gameScoreEl.textContent = gameScore;
        gameSetTimeout(() => { gameRunning = false; stopGame(); }, 2500);
      } else if (guesses.length >= 6) {
        gameOver = true;
        gameScore = 0;
        gameSetTimeout(() => { gameRunning = false; stopGame(); }, 2500);
      }
      currentGuess = '';
    }
  });

  gameRAF(() => {
    ctx.fillStyle = '#121213';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Orbitron, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('WORLDLY', canvas.width / 2, 42);
    ctx.strokeStyle = '#3a3a3c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, 52); ctx.lineTo(canvas.width - 20, 52);
    ctx.stroke();

    // Draw grid
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const x = gridX + col * (cellW + cellGap);
        const y = gridY + row * (cellH + cellGap);
        const guess = guesses[row];
        const isCurrent = row === guesses.length;

        let bg = '#121213';
        let border = '#3a3a3c';
        let letter = '';

        if (guess) {
          letter = guess[col];
          bg = getColor(letter, col);
          border = bg;
        } else if (isCurrent) {
          letter = currentGuess[col] || '';
          border = letter ? '#999' : '#3a3a3c';
        }

        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.roundRect(x, y, cellW, cellH, 4);
        ctx.fill();
        ctx.strokeStyle = border;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (letter) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 22px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(letter, x + cellW / 2, y + cellH / 2);
        }
      }
    }
    ctx.textBaseline = 'alphabetic';

    ctx.fillStyle = '#818384';
    ctx.font = '13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Type a 5-letter word and press ENTER', canvas.width / 2, canvas.height - 8);

    if (gameWon) {
      ctx.fillStyle = 'rgba(18,18,19,0.88)';
      ctx.fillRect(0, canvas.height / 2 - 55, canvas.width, 100);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 32px Orbitron, Arial';
      ctx.textAlign = 'center';
      ctx.fillText('BRILLIANT!', canvas.width / 2, canvas.height / 2);
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.fillText(`${guesses.length} guess${guesses.length > 1 ? 'es' : ''} — +${gameScore} credits`, canvas.width / 2, canvas.height / 2 + 28);
    } else if (gameOver) {
      ctx.fillStyle = 'rgba(18,18,19,0.88)';
      ctx.fillRect(0, canvas.height / 2 - 55, canvas.width, 100);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 28px Orbitron, Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.fillText(`The word was: ${secretWord}`, canvas.width / 2, canvas.height / 2 + 28);
    }
  });
}

function playSudoku(canvas, ctx) {
  let solution = new Array(81).fill(0);
  let puzzle   = new Array(81).fill(0);
  let userGrid = new Array(81).fill(0);
  let givens   = new Set();
  let selected = -1;
  let completed = false;

  const CELL = 40, GS = CELL * 9;           // 360px grid
  const OX = (canvas.width - GS) / 2;       // 120 — centered
  const OY = 12;

  function shuffle9() {
    const a = [1,2,3,4,5,6,7,8,9];
    for (let i = 8; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function isOK(grid, idx, val) {
    const r = Math.floor(idx / 9), c = idx % 9;
    for (let i = 0; i < 9; i++) {
      if (grid[r * 9 + i] === val || grid[i * 9 + c] === val) return false;
    }
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let dr = 0; dr < 3; dr++)
      for (let dc = 0; dc < 3; dc++)
        if (grid[(br + dr) * 9 + bc + dc] === val) return false;
    return true;
  }

  function solve(grid, rand = false) {
    const idx = grid.indexOf(0);
    if (idx === -1) return true;
    const nums = rand ? shuffle9() : [1,2,3,4,5,6,7,8,9];
    for (const v of nums) {
      if (isOK(grid, idx, v)) {
        grid[idx] = v;
        if (solve(grid, rand)) return true;
        grid[idx] = 0;
      }
    }
    return false;
  }

  function countSols(grid, max = 2) {
    const idx = grid.indexOf(0);
    if (idx === -1) return 1;
    let n = 0;
    for (let v = 1; v <= 9; v++) {
      if (isOK(grid, idx, v)) {
        grid[idx] = v;
        n += countSols(grid, max);
        grid[idx] = 0;
        if (n >= max) return n;
      }
    }
    return n;
  }

  function newPuzzle() {
    solution.fill(0);
    solve(solution, true);
    puzzle = [...solution];

    // Remove cells while keeping a unique solution (medium: ~46 removed)
    const order = [...Array(81).keys()].sort(() => Math.random() - 0.5);
    let removed = 0;
    for (const idx of order) {
      const bk = puzzle[idx];
      puzzle[idx] = 0;
      if (countSols([...puzzle], 2) !== 1) puzzle[idx] = bk;
      else if (++removed >= 46) break;
    }

    givens   = new Set(puzzle.flatMap((v, i) => v ? [i] : []));
    userGrid = [...puzzle];
    selected = -1;
    completed = false;
    gameScore = 0;
  }

  newPuzzle();

  function render() {
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle group highlight (row + col + box of selected cell)
    if (selected !== -1) {
      const sr = Math.floor(selected / 9), sc = selected % 9;
      ctx.fillStyle = 'rgba(56,189,248,0.06)';
      ctx.fillRect(OX, OY + sr * CELL, GS, CELL);
      ctx.fillRect(OX + sc * CELL, OY, CELL, GS);
      ctx.fillRect(OX + Math.floor(sc / 3) * 3 * CELL, OY + Math.floor(sr / 3) * 3 * CELL, CELL * 3, CELL * 3);
    }

    for (let i = 0; i < 81; i++) {
      const r = Math.floor(i / 9), c = i % 9;
      const x = OX + c * CELL, y = OY + r * CELL;
      const val = userGrid[i];
      const isGiven   = givens.has(i);
      const isSelected = selected === i;
      const isError   = !isGiven && val !== 0 && val !== solution[i];
      const sameNum   = selected !== -1 && val !== 0 && val === userGrid[selected] && i !== selected;

      if (isSelected) {
        ctx.fillStyle = '#1d4ed8';
        ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      } else if (sameNum) {
        ctx.fillStyle = 'rgba(56,189,248,0.22)';
        ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      }

      if (val) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 22px Arial';
        ctx.fillStyle = isGiven ? '#f1f5f9' : isError ? '#ef4444' : '#38bdf8';
        ctx.fillText(val, x + CELL / 2, y + CELL / 2);
      }
    }

    // Grid lines — thin for cells, thick for 3×3 boxes
    for (let i = 0; i <= 9; i++) {
      const box = i % 3 === 0;
      ctx.strokeStyle = box ? '#64748b' : '#1e293b';
      ctx.lineWidth   = box ? 2 : 1;
      ctx.beginPath(); ctx.moveTo(OX + i * CELL, OY); ctx.lineTo(OX + i * CELL, OY + GS); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(OX, OY + i * CELL); ctx.lineTo(OX + GS, OY + i * CELL); ctx.stroke();
    }
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
    ctx.strokeRect(OX, OY, GS, GS);

    // Status line below grid
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    if (completed) {
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 14px Orbitron, Arial';
      ctx.fillText('PUZZLE SOLVED!', canvas.width / 2, OY + GS + 20);
    } else {
      ctx.fillStyle = '#475569';
      ctx.font = '12px Arial';
      ctx.fillText('Click a cell · 1-9 to fill · Backspace to erase · Arrow keys to move', canvas.width / 2, OY + GS + 20);
    }
    _gameScoreEl.textContent = gameScore;
  }

  function checkDone() {
    const total = 81 - givens.size;
    let correct = 0;
    for (let i = 0; i < 81; i++) if (!givens.has(i) && userGrid[i] === solution[i]) correct++;
    gameScore = correct;
    if (correct === total) {
      completed = true;
      gameScore = 100;
      gameRunning = false;
      render();
      stopGame();
    }
  }

  canvas.onclick = (e) => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor(((e.clientX - rect.left) * canvas.width / rect.width - OX) / CELL);
    const r = Math.floor(((e.clientY - rect.top) * canvas.height / rect.height - OY) / CELL);
    if (c >= 0 && c < 9 && r >= 0 && r < 9) { selected = r * 9 + c; render(); }
  };

  addGameListener(document, 'keydown', (e) => {
    if (!gameRunning) return;
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) e.preventDefault();

    if (selected === -1) { selected = puzzle.findIndex(v => v === 0); render(); return; }

    const r = Math.floor(selected / 9), c = selected % 9;
    if      (e.key === 'ArrowRight') selected = r * 9 + (c + 1) % 9;
    else if (e.key === 'ArrowLeft')  selected = r * 9 + (c + 8) % 9;
    else if (e.key === 'ArrowDown')  selected = ((r + 1) % 9) * 9 + c;
    else if (e.key === 'ArrowUp')    selected = ((r + 8) % 9) * 9 + c;
    else if (e.key >= '1' && e.key <= '9' && !givens.has(selected)) {
      userGrid[selected] = +e.key;
      checkDone();
    } else if ((e.key === 'Backspace' || e.key === 'Delete') && !givens.has(selected)) {
      userGrid[selected] = 0;
    }
    render();
  });

  render();
}

// Initialize games
document.addEventListener('DOMContentLoaded', () => {
  initGames();
}, { once: true });
