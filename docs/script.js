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
  { id: 'tap-challenge', name: 'Tap Challenge', icon: '🎯', desc: 'Tap balls in 30 seconds', reward: 50, time: 30 },
  { id: 'penalty-kick', name: 'Penalty Kick', icon: '⚽', desc: 'Score 5 goals', reward: 150, time: 60 },
  { id: 'memory-match', name: 'Memory Match', icon: '🧠', desc: 'Match 6 pairs', reward: 100, time: 120 },
  { id: 'reaction-time', name: 'Reaction Game', icon: '⚡', desc: 'React as fast as possible', reward: 75, time: 30 },
  { id: 'flappy-soccer', name: 'Flappy Soccer', icon: '🚀', desc: 'Navigate through obstacles', reward: 120, time: 180 },
  { id: 'breakout', name: 'Breakout Blocks', icon: '🧱', desc: 'Break all blocks', reward: 140, time: 120 },
  { id: 'soccer-quiz', name: 'Soccer Quiz', icon: '📚', desc: 'Answer 5 questions', reward: 80, time: 60 },
  { id: 'ball-physics', name: 'Ball Physics', icon: '🎱', desc: 'Flick balls into targets', reward: 130, time: 90 },
  { id: '2d-soccer', name: '2D Soccer', icon: '⛳', desc: 'Score goals vs AI', reward: 180, time: 120 },
  { id: 'worldly', name: 'Worldly', icon: '🌐', desc: 'Guess the 5-letter word', reward: 160, time: 600 }
];

let currentGame = null;
let gameRunning = false;
let gameScore = 0;
let gameReward = 0;

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
  document.getElementById('gameScore').textContent = '0';
  document.getElementById('gamePlayBtn').style.display = 'block';
  document.getElementById('gameStopBtn').style.display = 'none';
  document.getElementById('gameReward').style.display = 'none';
  gameScore = 0;
}

function closeGame() {
  document.getElementById('gameModal').classList.remove('open');
  stopGame();
}

function startGame() {
  if (!currentGame) return;
  gameRunning = true;
  gameScore = 0;
  document.getElementById('gamePlayBtn').style.display = 'none';
  document.getElementById('gameStopBtn').style.display = 'block';

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  switch(currentGame.id) {
    case 'tap-challenge': playTapChallenge(canvas, ctx); break;
    case 'penalty-kick': playPenaltyKick(canvas, ctx); break;
    case 'memory-match': playMemoryMatch(canvas, ctx); break;
    case 'reaction-time': playReactionTime(canvas, ctx); break;
    case 'flappy-soccer': playFlappySoccer(canvas, ctx); break;
    case 'breakout': playBreakout(canvas, ctx); break;
    case 'soccer-quiz': playSoccerQuiz(canvas, ctx); break;
    case 'ball-physics': playBallPhysics(canvas, ctx); break;
    case '2d-soccer': play2DSoccer(canvas, ctx); break;
    case 'worldly': playWorldly(canvas, ctx); break;
  }
}

function stopGame() {
  gameRunning = false;
  if (gameScore > 0) {
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
function playTapChallenge(canvas, ctx) {
  const balls = [];
  const timeLimit = 30;
  let timeLeft = timeLimit;

  for (let i = 0; i < 5; i++) {
    balls.push({
      x: Math.random() * (canvas.width - 40) + 20,
      y: Math.random() * (canvas.height - 40) + 20,
      r: 20,
      active: true
    });
  }

  canvas.onclick = (e) => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    balls.forEach(ball => {
      if (ball.active && Math.hypot(ball.x - x, ball.y - y) < ball.r) {
        gameScore++;
        ball.active = false;
        setTimeout(() => {
          ball.x = Math.random() * (canvas.width - 40) + 20;
          ball.y = Math.random() * (canvas.height - 40) + 20;
          ball.active = true;
        }, 300);
      }
    });
  };

  const gameLoop = setInterval(() => {
    ctx.fillStyle = '#050812';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(56,189,248,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#38bdf8';
    balls.forEach(ball => {
      if (ball.active) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${gameScore}`, canvas.width / 2, 40);
    ctx.fillText(`Time: ${timeLeft}s`, canvas.width / 2, 80);

    timeLeft--;
    document.getElementById('gameScore').textContent = gameScore;

    if (timeLeft <= 0) {
      clearInterval(gameLoop);
      gameRunning = false;
      stopGame();
    }
  }, 1000 / 60);
}

function playPenaltyKick(canvas, ctx) {
  let angle = 0;
  let power = 50;
  let aiming = true;
  let goalsScored = 0;
  const maxGoals = 5;

  canvas.onmousemove = (e) => {
    if (!gameRunning || !aiming) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    angle = (x / canvas.width) * Math.PI;
  };

  canvas.onclick = () => {
    if (!gameRunning || !aiming) return;
    aiming = false;

    const ballX = canvas.width / 2;
    const ballY = canvas.height - 50;
    const goalX = canvas.width / 2 + Math.cos(angle - Math.PI / 2) * 150;
    const goalY = 60;

    if (Math.abs(goalX - (canvas.width / 2)) < 60) {
      goalsScored++;
      gameScore = goalsScored;
    }

    setTimeout(() => { aiming = true; }, 500);
  };

  const gameLoop = setInterval(() => {
    ctx.fillStyle = '#050812';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1a5f3f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.fillRect(canvas.width / 2 - 50, 20, 100, 80);

    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GOAL', canvas.width / 2, 65);

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height - 50, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height - 50);
    ctx.lineTo(canvas.width / 2 + Math.cos(angle - Math.PI / 2) * 150, 60);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Goals: ${gameScore}/${maxGoals}`, 20, 40);

    if (gameScore >= maxGoals) {
      clearInterval(gameLoop);
      gameRunning = false;
      stopGame();
    }
  }, 1000 / 60);
}

function playMemoryMatch(canvas, ctx) {
  const cards = [];
  const gridSize = 4;
  const cardSize = 60;
  const gap = 10;
  let flipped = [];
  let matched = 0;

  for (let i = 0; i < gridSize * gridSize; i++) {
    cards.push({ id: Math.floor(i / 2), flipped: false, matched: false });
  }

  cards.sort(() => Math.random() - 0.5);

  canvas.onclick = (e) => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < cards.length; i++) {
      const col = i % gridSize;
      const row = Math.floor(i / gridSize);
      const cx = 50 + col * (cardSize + gap);
      const cy = 80 + row * (cardSize + gap);

      if (x > cx && x < cx + cardSize && y > cy && y < cy + cardSize) {
        if (!cards[i].matched && !cards[i].flipped && flipped.length < 2) {
          cards[i].flipped = true;
          flipped.push(i);

          if (flipped.length === 2) {
            if (cards[flipped[0]].id === cards[flipped[1]].id) {
              cards[flipped[0]].matched = true;
              cards[flipped[1]].matched = true;
              gameScore++;
              matched++;
              flipped = [];
            } else {
              setTimeout(() => {
                cards[flipped[0]].flipped = false;
                cards[flipped[1]].flipped = false;
                flipped = [];
              }, 600);
            }
          }
        }
      }
    }
  };

  const gameLoop = setInterval(() => {
    ctx.fillStyle = '#050812';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < cards.length; i++) {
      const col = i % gridSize;
      const row = Math.floor(i / gridSize);
      const x = 50 + col * (cardSize + gap);
      const y = 80 + row * (cardSize + gap);

      ctx.fillStyle = cards[i].matched ? '#34d399' : cards[i].flipped ? '#38bdf8' : '#1a3a3a';
      ctx.fillRect(x, y, cardSize, cardSize);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cardSize, cardSize);

      if (cards[i].flipped || cards[i].matched) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(['🎮', '⚽', '🎯', '💎', '🏆', '🎪', '🎨', '🎭'][cards[i].id], x + cardSize / 2, y + cardSize / 2);
      }
    }

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Matched: ${matched}/8`, 20, 40);

    document.getElementById('gameScore').textContent = matched;

    if (matched === 8) {
      clearInterval(gameLoop);
      gameScore = matched;
      gameRunning = false;
      stopGame();
    }
  }, 1000 / 60);
}

function playReactionTime(canvas, ctx) {
  let ballVisible = false;
  let reactionTime = 0;
  let timeoutId;

  const showBall = () => {
    ballVisible = true;
    reactionTime = Date.now();
  };

  const startRound = () => {
    timeoutId = setTimeout(showBall, Math.random() * 2000 + 1000);
  };

  canvas.onclick = () => {
    if (!gameRunning) return;
    if (ballVisible) {
      const time = Date.now() - reactionTime;
      gameScore = time;
      ballVisible = false;
      clearTimeout(timeoutId);
      startRound();
    }
  };

  startRound();

  const gameLoop = setInterval(() => {
    ctx.fillStyle = '#050812';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (ballVisible) {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CLICK!', canvas.width / 2, canvas.height / 2 + 80);
    } else {
      ctx.fillStyle = '#1a3a3a';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Wait for the ball...', canvas.width / 2, canvas.height / 2);
    }

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Time: ${gameScore}ms`, 20, 40);
  }, 1000 / 60);

  setTimeout(() => {
    clearInterval(gameLoop);
    gameRunning = false;
    stopGame();
  }, 30000);
}

function playFlappySoccer(canvas, ctx) {
  const ball = { x: 60, y: canvas.height / 2, r: 15, vy: 0 };
  const pipes = [];
  const pipeWidth = 60;
  const gap = 120;
  let pipeCounter = 0;
  let score = 0;

  canvas.onclick = () => {
    ball.vy = -8;
  };

  const gameLoop = setInterval(() => {
    ctx.fillStyle = '#050812';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1a5f3f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ball.vy += 0.4;
    ball.y += ball.vy;

    pipeCounter++;
    if (pipeCounter > 100) {
      const pipeY = Math.random() * (canvas.height - gap - 100) + 50;
      pipes.push({ x: canvas.width, y: pipeY });
      pipeCounter = 0;
    }

    pipes.forEach((pipe, idx) => {
      pipe.x -= 6;

      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
      ctx.fillRect(pipe.x, pipe.y + gap, pipeWidth, canvas.height);

      if (pipe.x < ball.x - ball.r && pipe.x + pipeWidth > ball.x - ball.r && !pipe.scored) {
        score++;
        gameScore = score;
        pipe.scored = true;
      }

      if (pipe.x < -pipeWidth) pipes.splice(idx, 1);
    });

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();

    if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) {
      clearInterval(gameLoop);
      gameRunning = false;
      stopGame();
    }

    pipes.forEach(pipe => {
      if (Math.hypot(ball.x - pipe.x, ball.y - pipe.y) < ball.r + 20) {
        clearInterval(gameLoop);
        gameRunning = false;
        stopGame();
      }
    });

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 40);

    document.getElementById('gameScore').textContent = score;
  }, 1000 / 60);
}

function playBreakout(canvas, ctx) {
  const blocks = [];
  const blockWidth = 60;
  const blockHeight = 20;
  const cols = Math.floor(canvas.width / (blockWidth + 5));
  const rows = 3;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      blocks.push({ x: c * (blockWidth + 5) + 5, y: r * (blockHeight + 5) + 5, width: blockWidth, height: blockHeight, active: true });
    }
  }

  const paddle = { x: canvas.width / 2 - 40, y: canvas.height - 20, width: 80, height: 15 };
  const ball = { x: canvas.width / 2, y: canvas.height - 50, vx: 4, vy: -4, r: 8 };

  canvas.onmousemove = (e) => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    paddle.x = e.clientX - rect.left - paddle.width / 2;
  };

  const gameLoop = setInterval(() => {
    ctx.fillStyle = '#050812';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.vx *= -1;
    if (ball.y - ball.r < 0) ball.vy *= -1;

    blocks.forEach(block => {
      if (block.active && ball.x > block.x && ball.x < block.x + block.width && ball.y > block.y && ball.y < block.y + block.height) {
        block.active = false;
        ball.vy *= -1;
        gameScore++;
      }

      if (block.active) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(block.x, block.y, block.width, block.height);
      }
    });

    if (ball.y > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.vy *= -1;
    }

    ctx.fillStyle = '#34d399';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Blocks: ${gameScore}`, 20, 40);

    document.getElementById('gameScore').textContent = gameScore;

    if (ball.y > canvas.height || blocks.every(b => !b.active)) {
      clearInterval(gameLoop);
      gameRunning = false;
      stopGame();
    }
  }, 1000 / 60);
}

function playSoccerQuiz(canvas, ctx) {
  const questions = [
    { q: 'How many players per team?', a: '11' },
    { q: 'Goal width in meters?', a: '7.32' },
    { q: 'Match duration (minutes)?', a: '90' },
    { q: 'Penalty distance (meters)?', a: '12' },
    { q: 'Field corners called?', a: 'kick' }
  ];

  let currentQ = 0;
  let answered = 0;
  let input = '';

  canvas.onclick = () => { input += 'x'; };
  document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    if (e.key === 'Enter' && input.trim()) {
      if (input.trim().toLowerCase() === questions[currentQ].a.toLowerCase()) {
        gameScore++;
        answered++;
      }
      currentQ++;
      input = '';
      if (currentQ >= questions.length) {
        gameRunning = false;
        stopGame();
      }
    } else if (e.key === 'Backspace') {
      input = input.slice(0, -1);
    } else if (e.key.length === 1) {
      input += e.key;
    }
  });

  const gameLoop = setInterval(() => {
    ctx.fillStyle = '#050812';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (currentQ < questions.length) {
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(questions[currentQ].q, canvas.width / 2, 100);

      ctx.font = '24px Arial';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(input + '_', canvas.width / 2, 200);

      ctx.font = '16px Arial';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('(Press Enter to submit)', canvas.width / 2, 250);
    }

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Correct: ${gameScore}/${questions.length}`, 20, 40);

    document.getElementById('gameScore').textContent = gameScore;
  }, 1000 / 60);
}

function playBallPhysics(canvas, ctx) {
  const balls = [];
  const targets = [];
  let score = 0;

  for (let i = 0; i < 3; i++) {
    targets.push({
      x: Math.random() * (canvas.width - 40) + 20,
      y: Math.random() * (canvas.height - 100) + 20,
      r: 20,
      active: true
    });
  }

  canvas.onmousedown = (e) => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    balls.push({ x, y, vx: Math.random() * 4 - 2, vy: -8, r: 8 });
  };

  const gameLoop = setInterval(() => {
    ctx.fillStyle = '#050812';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    balls.forEach((ball, idx) => {
      ball.vy += 0.3;
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.y > canvas.height) balls.splice(idx, 1);

      targets.forEach(target => {
        if (target.active && Math.hypot(ball.x - target.x, ball.y - target.y) < ball.r + target.r) {
          target.active = false;
          gameScore++;
          score++;
        }
      });

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
    });

    targets.forEach(target => {
      if (target.active) {
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Targets: ${score}/${targets.length}`, 20, 40);
    ctx.fillText('Drag to flick balls', 20, 70);

    document.getElementById('gameScore').textContent = score;

    if (targets.every(t => !t.active)) {
      clearInterval(gameLoop);
      gameRunning = false;
      stopGame();
    }
  }, 1000 / 60);
}

function play2DSoccer(canvas, ctx) {
  const player = { x: canvas.width / 2, y: canvas.height - 50, width: 30, height: 40, speed: 5 };
  const ball = { x: canvas.width / 2, y: canvas.height / 2, r: 8, vx: 0, vy: 0 };
  const goal = { x: canvas.width - 40, y: canvas.height / 2 - 30, width: 40, height: 60 };
  let goals = 0;
  const keys = {};

  document.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
  document.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

  const gameLoop = setInterval(() => {
    ctx.fillStyle = '#050812';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1a5f3f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (keys['arrowleft'] || keys['a']) player.x = Math.max(0, player.x - player.speed);
    if (keys['arrowright'] || keys['d']) player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    if (keys['arrowup'] || keys['w']) player.y = Math.max(0, player.y - player.speed);
    if (keys['arrowdown'] || keys['s']) player.y = Math.min(canvas.height - player.height, player.y + player.speed);

    if (Math.hypot(ball.x - player.x, ball.y - player.y) < 30) {
      ball.vx = (ball.x - player.x) / 10;
      ball.vy = (ball.y - player.y) / 10;
    }

    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vx *= 0.98;
    ball.vy *= 0.98;

    if (ball.x < 0 || ball.x > canvas.width) ball.vx *= -1;
    if (ball.y < 0 || ball.y > canvas.height) ball.vy *= -1;

    if (ball.x > goal.x && ball.y > goal.y && ball.y < goal.y + goal.height) {
      goals++;
      gameScore = goals;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.vx = 0;
      ball.vy = 0;
    }

    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#34d399';
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Goals: ${goals}`, 20, 40);
    ctx.font = '14px Arial';
    ctx.fillText('Use Arrow Keys/WASD to move', 20, 70);

    document.getElementById('gameScore').textContent = goals;
  }, 1000 / 60);

  setTimeout(() => {
    clearInterval(gameLoop);
    gameRunning = false;
    stopGame();
  }, 120000);
}

function playWorldly(canvas, ctx) {
  const wordList = ['UNITY', 'WORLD', 'PIXEL', 'CYBER', 'NEXUS', 'FORGE', 'CLOUD', 'LOGIC', 'BYTES', 'SOLAR', 'LUNAR', 'TITAN', 'QUARK', 'PRISM', 'SONIC', 'SWIFT', 'BURST', 'CHAOS', 'DELTA', 'EPOCH'];
  const secretWord = wordList[Math.floor(Math.random() * wordList.length)];
  let guesses = [];
  let currentGuess = '';
  let gameWon = false;
  let gameOver = false;

  const getLetterFeedback = (letter, position) => {
    if (secretWord[position] === letter) return '🟩';
    if (secretWord.includes(letter)) return '🟨';
    return '⬜';
  };

  canvas.addEventListener('keydown', (e) => {
    if (!gameRunning || gameOver || gameWon) return;

    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
      if (currentGuess.length < 5) currentGuess += key;
    } else if (e.key === 'Backspace') {
      currentGuess = currentGuess.slice(0, -1);
    } else if (e.key === 'Enter') {
      if (currentGuess.length === 5) {
        guesses.push(currentGuess);
        if (currentGuess === secretWord) {
          gameWon = true;
          gameScore = (6 - guesses.length + 1) * 30;
          setTimeout(() => {
            gameRunning = false;
            stopGame();
          }, 2000);
        } else if (guesses.length >= 6) {
          gameOver = true;
          gameScore = 0;
          setTimeout(() => {
            gameRunning = false;
            stopGame();
          }, 2000);
        }
        currentGuess = '';
      }
    }
  });

  canvas.focus();

  const gameLoop = setInterval(() => {
    ctx.fillStyle = '#050812';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('WORLDLY', canvas.width / 2, 50);

    let y = 100;
    guesses.forEach((guess, idx) => {
      guess.split('').forEach((letter, pos) => {
        const feedback = getLetterFeedback(letter, pos);
        ctx.fillStyle = feedback === '🟩' ? '#34d399' : feedback === '🟨' ? '#fbbf24' : '#6b7280';
        ctx.fillRect(pos * 50 + 80, y, 40, 40);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(letter, pos * 50 + 100, y + 28);
      });
      y += 50;
    });

    if (!gameWon && !gameOver) {
      currentGuess.split('').forEach((letter, pos) => {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(pos * 50 + 80, y, 40, 40);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(letter, pos * 50 + 100, y + 28);
      });

      for (let i = currentGuess.length; i < 5; i++) {
        ctx.fillStyle = '#374151';
        ctx.fillRect(i * 50 + 80, y, 40, 40);
      }
    }

    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Attempts: ${guesses.length}/6`, canvas.width / 2, canvas.height - 50);
    ctx.fillText('Type letters and press ENTER', canvas.width / 2, canvas.height - 25);

    if (gameWon) {
      ctx.fillStyle = 'rgba(52, 211, 153, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🎉 YOU WON!', canvas.width / 2, canvas.height / 2);
      ctx.font = '20px Arial';
      ctx.fillText(`Word: ${secretWord}`, canvas.width / 2, canvas.height / 2 + 50);
      document.getElementById('gameScore').textContent = gameScore;
    } else if (gameOver) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
      ctx.font = '20px Arial';
      ctx.fillText(`Word was: ${secretWord}`, canvas.width / 2, canvas.height / 2 + 50);
      document.getElementById('gameScore').textContent = 0;
    }
  }, 1000 / 60);

  setTimeout(() => {
    clearInterval(gameLoop);
    if (!gameOver && !gameWon) {
      gameScore = 0;
      gameRunning = false;
      stopGame();
    }
  }, 600000);
}

// Initialize games
document.addEventListener('DOMContentLoaded', () => {
  initGames();
}, { once: true });
