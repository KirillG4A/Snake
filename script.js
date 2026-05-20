const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

const gridSize = 20;

// 1. Tracks where the snake's head currently is
let snake = [
    { x: 100, y: 100}
];

// adds fruits
let foodX;
let foodY;

// 2. Tracks which direction the snake is moving 
// (X: 1 means moving right, Y: 0 means not moving up/down)
let velocityX = 1; 
let velocityY = 0;

function gameLoop() {
    // 1. Calculate where the new head WILL be
    let newHead = {
        x: snake[0].x + velocityX * gridSize,
        y: snake[0].y + velocityY * gridSize
    };

    // 2. Check wall collisions (using the newHead's position)
    if (newHead.x < 0 || newHead.x >= canvas.width || newHead.y < 0 || newHead.y >= canvas.height) {
        alert("Game Over!");
        // Reset game state
        snake = [{ x: 100, y: 100 }];
        velocityX = 1;
        velocityY = 0;
        spawnFood();
        return;
    }

    // 3. Add the new head to the front of the snake array
    snake.unshift(newHead);

    // 4. Check if the snake ate the food
    if (newHead.x === foodX && newHead.y === foodY) {
        spawnFood(); // Spawns new food, and we DO NOT pop the tail (snake grows!)
    } else {
        snake.pop(); // Remove the last tail segment (snake stays same size)
    }

    // 5. Clear the board
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 6. Draw the food
    ctx.fillStyle = "red";
    ctx.fillRect(foodX, foodY, gridSize, gridSize);

  // 7. Loop through the snake array and draw contextual borders
    for (let i = 0; i < snake.length; i++) {
        // Draw the base green square
        ctx.fillStyle = "green";
        ctx.fillRect(snake[i].x, snake[i].y, gridSize, gridSize);

        // Define our border properties
        ctx.strokeStyle = "#00000"; // Background gray mask color
        ctx.lineWidth = 2;            // 2 pixels gives a clear side gap

        // Helper function to check if a true connected neighbor is at a specific coordinate
        // It checks if a segment exists there AND if it's adjacent in the array (i-1 or i+1)
        const hasConnectedNeighbor = (x, y) => {
            return snake.some((seg, index) => 
                seg.x === x && 
                seg.y === y && 
                Math.abs(index - i) === 1
            );
        };

        // --- Contextual Checks using our helper ---

        // Is the LEFT edge exposed?
        if (!hasConnectedNeighbor(snake[i].x - gridSize, snake[i].y)) {
            ctx.beginPath();
            ctx.moveTo(snake[i].x, snake[i].y);
            ctx.lineTo(snake[i].x, snake[i].y + gridSize);
            ctx.stroke();
        }

        // Is the RIGHT edge exposed?
        if (!hasConnectedNeighbor(snake[i].x + gridSize, snake[i].y)) {
            ctx.beginPath();
            ctx.moveTo(snake[i].x + gridSize, snake[i].y);
            ctx.lineTo(snake[i].x + gridSize, snake[i].y + gridSize);
            ctx.stroke();
        }

        // Is the TOP edge exposed?
        if (!hasConnectedNeighbor(snake[i].x, snake[i].y - gridSize)) {
            ctx.beginPath();
            ctx.moveTo(snake[i].x, snake[i].y);
            ctx.lineTo(snake[i].x + gridSize, snake[i].y);
            ctx.stroke();
        }

        // Is the BOTTOM edge exposed?
        if (!hasConnectedNeighbor(snake[i].x, snake[i].y + gridSize)) {
            ctx.beginPath();
            ctx.moveTo(snake[i].x, snake[i].y + gridSize);
            ctx.lineTo(snake[i].x + gridSize, snake[i].y + gridSize);
            ctx.stroke();
        }
    }
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