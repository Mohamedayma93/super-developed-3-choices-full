// Get the selected environment from the URL
const urlParams = new URLSearchParams(window.location.search);
const selectedEnvironment = urlParams.get('environment');

// Define asset URLs for each environment
const assets = {
    jungle: {
        background: 'https://i.ibb.co/kBzb4cG/background.jpg',
        player: 'https://i.ibb.co/58Db9dj/mario.png',
        platform: 'https://i.ibb.co/YXCCF2J/platform.png',
        coin: 'https://i.ibb.co/FVS5zPw/coin.png',
        enemy: 'https://i.ibb.co/pKxht9K/enemy.png',
        heart: 'https://i.ibb.co/xsnzyY8/heart.png'
    },
    ocean: {
        background: 'https://i.ibb.co/z292cRf/background.jpg',
        player: 'https://i.ibb.co/MkTDQ1Z/mario.png',
        platform: 'https://i.ibb.co/KNYWr2h/platform.png',
        coin: 'https://i.ibb.co/SBkJkRz/coin.png',
        enemy: 'https://i.ibb.co/0CX48jr/enemy.png',
        heart: 'https://i.ibb.co/QQhdNxh/heart.png'
    },
    desert: {
        background: 'https://i.ibb.co/7QBZ8DY/background.jpg',
        player: 'https://i.ibb.co/hYknGVp/mario.png',
        platform: 'https://i.ibb.co/LZRkMjN/platform.png',
        coin: 'https://i.ibb.co/xDNRP1Z/coin.png',
        enemy: 'https://i.ibb.co/drSr5r7/enemy.png',
        heart: 'https://i.ibb.co/ky0RQrS/heart.png'
    }
};

// Set the correct assets based on the selected environment
const currentAssets = assets[selectedEnvironment];

// Update the background image
document.getElementById('game-container').style.backgroundImage = `url('${currentAssets.background}')`;

// Update the player image
document.getElementById('player').src = currentAssets.player;

// Update platform, coin, enemy, and heart images
function updateElements() {
    document.querySelectorAll('.platform').forEach(platform => {
        platform.style.backgroundImage = `url('${currentAssets.platform}')`;
    });

    document.querySelectorAll('.coin').forEach(coin => {
        coin.style.backgroundImage = `url('${currentAssets.coin}')`;
    });

    document.querySelectorAll('.enemy').forEach(enemy => {
        enemy.style.backgroundImage = `url('${currentAssets.enemy}')`;
    });

    document.querySelectorAll('.life').forEach(life => {
        life.src = currentAssets.heart;
    });
}

// Rest of your game.js code...
const player = document.getElementById("player");
const platforms = document.getElementById("platforms");
const coins = document.getElementById("coins");
const enemies = document.getElementById("enemies");
const joystickContainer = document.getElementById("joystick-container");
const coinCounter = document.getElementById("coin-counter");
const killCounter = document.getElementById("kill-counter");
const timeCounter = document.getElementById("time-counter");
const livesContainer = document.getElementById("lives-container");
const shootButton = document.getElementById("shoot-button");
const gameOverScreen = document.getElementById("game-over-screen");
const restartButton = document.getElementById("restart-button");

let playerX = 50;
let playerY = 0;
let playerVelocityY = 0;
let playerVelocityX = 0;
const gravity = -0.5;
const jumpPower = 10;
let coinCount = 0;
let killCount = 0;
let gameTime = 0;
let lives = 4;
let worldSpeed = 2;
const acceleration = 0.0001;
const worldRightBoundary = window.innerWidth - 100;

function createPlatform(x, y) {
  const platform = document.createElement('div');
  platform.className = 'platform';
  platform.style.left = x + 'px';
  platform.style.bottom = y + 'px';
  platforms.appendChild(platform);
  updateElements();
}

function createCoin(x, y) {
  const coin = document.createElement('div');
  coin.className = 'coin';
  coin.style.left = x + 'px';
  coin.style.bottom = y + 'px';
  coins.appendChild(coin);
  updateElements();
}

function createEnemy(x, y) {
  const enemy = document.createElement('div');
  enemy.className = 'enemy';
  enemy.style.left = x + 'px';
  enemy.style.bottom = y + 'px';
  enemies.appendChild(enemy);
  updateElements();
}

function createBullet(x, y) {
  const bullet = document.createElement('div');
  bullet.className = 'bullet';
  bullet.style.left = x + 'px';
  bullet.style.bottom = y + 'px';
  document.getElementById('game-container').appendChild(bullet);
  moveBullet(bullet);
}

function generateWorld() {
  for (let i = 0; i < 5; i++) {
    const platformX = worldRightBoundary + i * 300;
    const platformY = Math.random() * 200 + 50;
    createPlatform(platformX, platformY);
    
    if (Math.random() < 0.5) {
      createCoin(platformX + 30, platformY + 30);
    }
    if (Math.random() < 0.3) {
      createEnemy(platformX + 50, platformY + 20);
    }
  }
}

function initializeWorld() {
  createPlatform(100, 100);
  createPlatform(250, 150);
  createPlatform(400, 200);
  createCoin(120, 130);
  createCoin(270, 180);
  createCoin(420, 230);
  createEnemy(350, 100);
}

function movePlayer() {
  playerVelocityY += gravity;
  playerX += playerVelocityX;
  playerY += playerVelocityY;

  if (playerX < 0) playerX = 0;
  if (playerX > window.innerWidth - 50) playerX = window.innerWidth - 50;

  player.style.left = playerX + 'px';
  player.style.bottom = playerY + 'px';

  let onPlatform = false;

  document.querySelectorAll('.platform').forEach(platform => {
    const platformRect = platform.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    if (playerRect.right > platformRect.left &&
        playerRect.left < platformRect.right &&
        playerRect.bottom > platformRect.top &&
        playerRect.top < platformRect.bottom) {
      onPlatform = true;
      playerVelocityY = 0;
      playerY = platformRect.top - playerRect.height + window.innerHeight - platformRect.bottom;
    }
  });

  if (!onPlatform && playerY < 0) {
    playerY = 0;
    playerVelocityY = 0;
  }

  document.querySelectorAll('.coin').forEach(coin => {
    const coinRect = coin.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    if (playerRect.right > coinRect.left &&
        playerRect.left < coinRect.right &&
        playerRect.bottom > coinRect.top &&
        playerRect.top < coinRect.bottom) {
      coin.remove();
      coinCount++;
      coinCounter.textContent = `Coins: ${coinCount}`;
    }
  });

  document.querySelectorAll('.enemy').forEach(enemy => {
    const enemyRect = enemy.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    if (playerRect.right > enemyRect.left &&
        playerRect.left < enemyRect.right &&
        playerRect.bottom > enemyRect.top &&
        playerRect.top < enemyRect.bottom) {
      lives--;
      updateLives();
      if (lives === 0) {
        showGameOverScreen();
      } else {
        playerX = 50;
        playerY = 0;
      }
    }
  });

  requestAnimationFrame(movePlayer);
}

function updateLives() {
  livesContainer.innerHTML = '';
  for (let i = 0; i < lives; i++) {
    const life = document.createElement('img');
    life.src = currentAssets.heart;
    life.className = 'life';
    livesContainer.appendChild(life);
  }
}

function resetGame() {
  lives = 4;
  coinCount = 0;
  killCount = 0;
  gameTime = 0;
  playerX = 50;
  playerY = 0;
  playerVelocityY = 0;
  playerVelocityX = 0;
  worldSpeed = 2;
  
  coinCounter.textContent = `Coins: ${coinCount}`;
  killCounter.textContent = `Kills: ${killCount}`;
  timeCounter.textContent = `Time: ${gameTime}s`;
  updateLives();
  
  platforms.innerHTML = '';
  coins.innerHTML = '';
  enemies.innerHTML = '';
  
  initializeWorld();
  gameOverScreen.classList.add('hidden');
}

function moveWorld() {
  worldSpeed += acceleration;
  document.querySelectorAll('.platform, .coin, .enemy').forEach(element => {
    const currentLeft = parseFloat(element.style.left);
    element.style.left = (currentLeft - worldSpeed) + 'px';
    if (currentLeft < -100) {
      element.remove();
    }
  });

  if (platforms.children.length < 3) {
    generateWorld();
  }
}

function shoot() {
  const bulletX = playerX + 50; 
  const bulletY = playerY + 25; 
  createBullet(bulletX, bulletY);
}

shootButton.addEventListener('click', shoot);

function moveBullet(bullet) {
  const bulletSpeed = 10;
  let bulletX = parseFloat(bullet.style.left);
  const interval = setInterval(() => {
    bulletX += bulletSpeed;
    bullet.style.left = bulletX + 'px';

    if (bulletX > window.innerWidth) {
      bullet.remove();
      clearInterval(interval);
    }

    document.querySelectorAll('.enemy').forEach(enemy => {
      const bulletRect = bullet.getBoundingClientRect();
      const enemyRect = enemy.getBoundingClientRect();
      if (bulletRect.right > enemyRect.left &&
          bulletRect.left < enemyRect.right &&
          bulletRect.bottom > enemyRect.top &&
          bulletRect.top < enemyRect.bottom) {
        enemy.remove();
        bullet.remove();
        clearInterval(interval);
        killCount++;
        killCounter.textContent = `Kills: ${killCount}`;
      }
    });
  }, 16);
}

function showGameOverScreen() {
  gameOverScreen.classList.remove('hidden');
  const previousBestScore = JSON.parse(localStorage.getItem('bestScore')) || { coins: 0, kills: 0, time: 0 };
  const bestCoins = Math.max(previousBestScore.coins, coinCount);
  const bestKills = Math.max(previousBestScore.kills, killCount);
  const bestTime = Math.max(previousBestScore.time, gameTime);
  localStorage.setItem('bestScore', JSON.stringify({ coins: bestCoins, kills: bestKills, time: bestTime }));
  document.getElementById("coin-summary").textContent = `Coins: ${coinCount} (Best: ${bestCoins})`;
  document.getElementById("kill-summary").textContent = `Kills: ${killCount} (Best: ${bestKills})`;
  document.getElementById("time-summary").textContent = `Time: ${gameTime}s (Best: ${bestTime}s)`;
}

restartButton.addEventListener('click', () => {
  resetGame();
});

const joystick = nipplejs.create({
  zone: joystickContainer,
  mode: 'static',
  position: { left: '50%', top: '50%' },
  color: 'white'
});

joystick.on('move', (evt, data) => {
  const angle = data.angle.degree;
  const force = Math.min(data.force, 1);

  if (angle >= 45 && angle < 135) {
    playerVelocityY = jumpPower * force;
  } else if (angle >= 225 && angle < 315) {
    playerVelocityY = -jumpPower * force;
  } else if (angle >= 135 && angle < 225) {
    playerVelocityX = -5 * force;
  } else {
    playerVelocityX = 5 * force;
  }
});

joystick.on('end', () => {
  playerVelocityY = 0;
  playerVelocityX = 0;
});

let isShooting = false;

shootButton.addEventListener('mousedown', () => {
  if (!isShooting) {
    isShooting = true;
    shoot();
  }
});

shootButton.addEventListener('touchstart', () => {
  if (!isShooting) {
    isShooting = true;
    shoot();
  }
});

shootButton.addEventListener('mouseup', () => {
  isShooting = false;
});

shootButton.addEventListener('touchend', () => {
  isShooting = false;
});

function startWorldMovement() {
  moveWorld();
  requestAnimationFrame(startWorldMovement);
}

function updateTime() {
  gameTime++;
  timeCounter.textContent = `Time: ${gameTime}s`;
}

// Initialize the game
initializeWorld();
movePlayer();
startWorldMovement();
setInterval(updateTime, 1000);
updateLives();