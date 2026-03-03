const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const SHIP_W = 50, SHIP_H = 30;
const BULLET_W = 10, BULLET_H = 4;
const ASTEROID_W = 40, ASTEROID_H = 40;
const BULLET_SPEED = 10, ASTEROID_SPEED = 5, SHIP_SPEED = 5;
const OBSTACLE_RATE = 40;

let shipY, bullets, asteroids, score, keys, frameCount, isGameOver;
let gameState, countdownNum, countdownStart;

function resetGame() {
    shipY = HEIGHT/2 - SHIP_H/2;
    bullets = [];
    asteroids = [];
    score = 0;
    frameCount = 0;
    isGameOver = false;
    keys = {};
    document.getElementById('gameOver').style.display = 'none';
    gameState = "countdown";
    countdownNum = 3;
    countdownStart = performance.now();
    loop();
}

function drawShip() {
    ctx.save();
    ctx.translate(40 + 18, shipY + 18);
    ctx.rotate(Math.PI / 4);
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText('🚀', 0, 0);
    ctx.restore();
}

function drawBullets() {
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    bullets.forEach(b => ctx.fillText('〰️', b.x, b.y));
}

function drawAsteroids() {
    ctx.font = "32px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    asteroids.forEach(a => ctx.fillText('🪨', a.x, a.y));
}

function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, 12, 12);
}

function drawCountdown() {
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = "#fff";
    ctx.font = "64px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(countdownNum > 0 ? countdownNum : "Go!", WIDTH / 2, HEIGHT / 2);
}

function moveShip() {
    if (keys['w'] || keys['ArrowUp']) shipY -= SHIP_SPEED;
    if (keys['s'] || keys['ArrowDown']) shipY += SHIP_SPEED;
    if (shipY < 0) shipY = 0;
    if (shipY > HEIGHT - SHIP_H) shipY = HEIGHT - SHIP_H;
}

function shoot() {
    if (bullets.length === 0 || bullets[bullets.length-1].x > 40 + SHIP_W + 20) {
        bullets.push({x: 40 + SHIP_W, y: shipY + SHIP_H/2 - BULLET_H/2});
    }
}

function loop() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if (gameState === "countdown") {
        drawShip();
        drawAsteroids();
        drawBullets();
        drawScore();
        drawCountdown();

        let elapsed = (performance.now() - countdownStart) / 1000;
        if (elapsed > 1) {
            countdownNum -= 1;
            countdownStart = performance.now();
        }
        if (countdownNum < 0) {
            gameState = "playing";
        }
        requestAnimationFrame(loop);
        return;
    }

    if (isGameOver) return;

    // PLAYING STATE
    if (gameState === "playing") {
        moveShip();
        if (keys[' ']) shoot();

        bullets.forEach(b => b.x += BULLET_SPEED);
        bullets = bullets.filter(b => b.x < WIDTH);

        frameCount++;
        if (frameCount % OBSTACLE_RATE === 0) {
            let ay = Math.random() * (HEIGHT - ASTEROID_H);
            asteroids.push({x: WIDTH, y: ay});
        }
        asteroids.forEach(a => a.x -= ASTEROID_SPEED);
        asteroids = asteroids.filter(a => a.x + ASTEROID_W > 0);

        // Collisions: bullet vs asteroid
        let removeBullets = [];
        let removeAsteroids = [];
        asteroids.forEach((a, ai) => {
            bullets.forEach((b, bi) => {
                if (b.x < a.x + ASTEROID_W &&
                    b.x + BULLET_W > a.x &&
                    b.y < a.y + ASTEROID_H &&
                    b.y + BULLET_H > a.y
                ) {
                    removeAsteroids.push(ai);
                    removeBullets.push(bi);
                    score += 1;
                }
            });
        });
        bullets = bullets.filter((_, i) => !removeBullets.includes(i));
        asteroids = asteroids.filter((_, i) => !removeAsteroids.includes(i));

        // Collisions: ship vs asteroid
        for (let a of asteroids) {
            if (
                40 < a.x + ASTEROID_W &&
                40 + SHIP_W > a.x &&
                shipY < a.y + ASTEROID_H &&
                shipY + SHIP_H > a.y
            ) {
                gameOver();
                return;
            }
        }

        drawShip();
        drawBullets();
        drawAsteroids();
        drawScore();

        requestAnimationFrame(loop);
    }
}

function gameOver() {
    isGameOver = true;
    document.getElementById('finalScore').innerText = "Game Over! Final Score: " + score;
    document.getElementById('gameOver').style.display = 'block';
}

function restartGame() {
    resetGame();
}

document.addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === ' ') e.preventDefault();
});
document.addEventListener('keyup', e => {
    keys[e.key.toLowerCase()] = false;
});

// Initialize game
resetGame();