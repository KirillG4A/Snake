const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

const gridSize = 20;

// 1. Tracks where the snake's head currently is
let snakeX = 100;
let snakeY = 100;

// adds fruits
let foodX;
let foodY;

// 2. Tracks which direction the snake is moving 
// (X: 1 means moving right, Y: 0 means not moving up/down)
let velocityX = 1; 
let velocityY = 0;

function gameLoop() {
    // 3. Move the snake by updating its coordinates based on its velocity
    snakeX += velocityX * gridSize;
    snakeY += velocityY * gridSize;

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height) {
        alert("Game Over!");

        snakeX = 100;
        snakeY = 100;
        velocityX = 1;
        velocityY = 0;
        return;
    }

    if (snakeX === foodX && snakeY === foodY) {
        spawnFood();
    }

    // Clear the board
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw food
    ctx.fillStyle = "red";
    ctx.fillRect(foodX, foodY, gridSize, gridSize);
    
    // Draw the snake at its NEW position
    ctx.fillStyle = "green";
    ctx.fillRect(snakeX, snakeY, gridSize, gridSize);
}

spawnFood();
setInterval(gameLoop, 100);

window.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const keyPressed = event.key;

    //assign key
    if (keyPressed === "ArrowUp") {
        velocityX = 0;
        velocityY = -1;
    } else if (keyPressed === "ArrowDown") {
        velocityX = 0;
        velocityY = 1;
    } else if (keyPressed === "ArrowLeft") {
        velocityX = -1;
        velocityY = 0;
    } else if (keyPressed === "ArrowRight") {
        velocityX = 1;
        velocityY = 0;
    }
}

function spawnFood() {
    foodX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    foodY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}