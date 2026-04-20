const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player Settings
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: '#00ffcc',
    velocity: 5
};

const bullets = [];
const enemies = [];
let score = 0;

// Shooting Logic
window.addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
    const velocity = {
        x: Math.cos(angle) * 10,
        y: Math.sin(angle) * 10
    };
    bullets.push({ x: player.x, y: player.y, velocity });
});

// Enemy Spawn
function spawnEnemy() {
    setInterval(() => {
        const radius = Math.random() * (30 - 10) + 10;
        let x, y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        const angle = Math.atan2(player.y - y, player.x - x);
        const velocity = { x: Math.cos(angle) * 2, y: Math.sin(angle) * 2 };
        enemies.push({ x, y, radius, color: '#ff4444', velocity });
    }, 1000);
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Motion blur effect for realism
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = player.color;
    ctx.fill();

    // Bullets Logic
    bullets.forEach((bullet, index) => {
        bullet.x += bullet.velocity.x;
        bullet.y += bullet.velocity.y;
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(bullet.x, bullet.y, 5, 5);
        
        // Remove off-screen bullets
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(index, 1);
        }
    });

    // Enemy Logic
    enemies.forEach((enemy, index) => {
        enemy.x += enemy.velocity.x;
        enemy.y += enemy.velocity.y;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = enemy.color;
        ctx.fill();

        // Bullet-Enemy Collision
        bullets.forEach((bullet, bIndex) => {
            const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            if (dist - enemy.radius < 1) {
                enemies.splice(index, 1);
                bullets.splice(bIndex, 1);
                score += 10;
                document.getElementById('score').innerHTML = `Kills: ${score}`;
            }
        });
    });
}

spawnEnemy();
animate();
