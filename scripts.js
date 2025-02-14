// Select Elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const grabSound = document.getElementById("grab-sound");
const winSound = document.getElementById("win-sound");

// Set Canvas Dimensions
canvas.width = 400;
canvas.height = 500;

// Game Variables
let clawX = canvas.width / 2 - 25;
let clawY = 50;
let clawWidth = 50;
let clawHeight = 20;
let clawSpeed = 5;
let movingDown = false;
let score = 0;
let gameOver = false;

// Plush Toys
const plushies = [];
const numPlushies = 6;
for (let i = 0; i < numPlushies; i++) {
    plushies.push({
        x: Math.random() * (canvas.width - 40),
        y: Math.random() * (canvas.height - 100) + 150,
        width: 40,
        height: 40,
        value: Math.floor(Math.random() * 50) + 50, // Plush value: 50-100 points
        grabbed: false
    });
}

// Controls
document.addEventListener("keydown", (e) => {
    if (gameOver) return;

    if (e.key === "ArrowLeft" && clawX > 0) {
        clawX -= clawSpeed;
    }
    if (e.key === "ArrowRight" && clawX < canvas.width - clawWidth) {
        clawX += clawSpeed;
    }
    if (e.key === " " && !movingDown) {
        movingDown = true;
    }
});

// Game Loop
function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Claw
    ctx.fillStyle = "black";
    ctx.fillRect(clawX, clawY, clawWidth, clawHeight);
    
    // Draw Plushies
    plushies.forEach(plush => {
        if (!plush.grabbed) {
            ctx.fillStyle = "gray";
            ctx.fillRect(plush.x, plush.y, plush.width, plush.height);
        }
    });

    // Claw Movement Logic
    if (movingDown) {
        clawY += 5;
        if (clawY > canvas.height - 60) {
            let grabbedPlush = false;
            
            plushies.forEach(plush => {
                if (
                    !plush.grabbed &&
                    clawX < plush.x + plush.width &&
                    clawX + clawWidth > plush.x &&
                    clawY + clawHeight > plush.y
                ) {
                    plush.grabbed = true;
                    score += plush.value;
                    grabbedPlush = true;
                    grabSound.play();
                }
            });

            setTimeout(() => {
                clawY = 50;
                movingDown = false;
            }, 500);

            if (grabbedPlush) {
                scoreDisplay.innerText = `Score: ${score}`;
            }

            // Check for Game Over
            if (plushies.every(plush => plush.grabbed)) {
                setTimeout(() => {
                    winSound.play();
                    alert("You won! Final Score: " + score);
                    gameOver = true;
                }, 800);
            }
        }
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();