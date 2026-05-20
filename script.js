const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

const gridSize = 20;

// 1. Tracks where the snake's head currently is
let snakeX = 100;
let snakeY = 100;

// 2. Tracks which direction the snake is moving 
// (X: 1 means moving right, Y: 0 means not moving up/down)
let velocityX = 1; 
let velocityY = 0;

function gameLoop() {
    // 3. Move the snake by updating its coordinates based on its velocity
    snakeX += velocityX * gridSize;
    snakeY += velocityY * gridSize;

    // Clear the board
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the snake at its NEW position
    ctx.fillStyle = "green";
    ctx.fillRect(snakeX, snakeY, gridSize, gridSize);
}

setInterval(gameLoop, 100);