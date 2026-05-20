const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

const gridSize = 20;

// 1. Tracks where the snake's head currently is
let snake = [
    { x: 100, y: 100}
];

let score = 0;
const scoreDisplay = document.getElementById("score");

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
        alert("Game Over! A wall has been hit!");
        // Reset game state
        snake = [{ x: 100, y: 100 }];
        velocityX = 1;
        velocityY = 0;
        spawnFood();
        score = 0;
        scoreDisplay.innerText = score;
        return;
    }

    // 3. NEW: Check self-collision (Did the head hit the body?)
    // We loop starting at index 1 because index 0 is the head itself!
    for (let i = 1; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            alert("Game Over! You bit your own tail.");
            snake = [{ x: 100, y: 100 }];
        velocityX = 1;
            velocityY = 0;
            spawnFood();
            score = 0;
            scoreDisplay.innerText = score;
            return;
        }
    }

    // 3. Add the new head to the front of the snake array
    snake.unshift(newHead);

    // 4. Check if the snake ate the food
    if (newHead.x === foodX && newHead.y === foodY) {
        score++; // Increase score by 1
        scoreDisplay.innerText = score; // Update the text on the website
        spawnFood();
    } else {
        snake.pop();
    }

    // 5. Clear the board
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 7. Draw the food as a sleek glowing circle
    ctx.beginPath();
    let radius = gridSize / 2;
    // Math.PI * 2 draws a full 360-degree circle
    ctx.arc(foodX + radius, foodY + radius, radius - 2, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444"; // Sleek crimson red
    ctx.fill();
    ctx.closePath();

  // 8. Loop through the snake array and draw a flawless, connected ribbon with eyes and a fading tail
    for (let i = 0; i < snake.length; i++) {
        let x = snake[i].x;
        let y = snake[i].y;
        let pad = 2; // Controls the thickness of the passing air gap

        // --- DYNAMIC FADING COLOR ---
        // Start at full opacity (1.0) and decrease it as we move down the body array.
        // We set a minimum opacity of 0.4 so the tail tip doesn't become totally invisible.
        let opacity = Math.max(0.4, 1 - (i * 0.05)); 
        ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`; // Modern vibrant emerald green with fade

        // Helper function to check if a truly connected neighbor is touching this segment
        const hasConnectedNeighbor = (nx, ny) => {
            return snake.some((seg, index) => 
                seg.x === nx && 
                seg.y === ny && 
                Math.abs(index - i) === 1
            );
        };

        // Check all 4 directions around the current segment
        let neighborLeft   = hasConnectedNeighbor(x - gridSize, y);
        let neighborRight  = hasConnectedNeighbor(x + gridSize, y);
        let neighborTop    = hasConnectedNeighbor(x, y - gridSize);
        let neighborBottom = hasConnectedNeighbor(x, y + gridSize);

        // Calculate boundaries (pad = 0 if neighbor exists, pad = 2 if edge is exposed)
        let leftPad   = neighborLeft   ? 0 : pad;
        let rightPad  = neighborRight  ? 0 : pad;
        let topPad    = neighborTop    ? 0 : pad;
        let bottomPad = neighborBottom ? 0 : pad;

        let drawX = x + leftPad;
        let drawY = y + topPad;
        let drawWidth = gridSize - leftPad - rightPad;
        let drawHeight = gridSize - topPad - bottomPad;

        // Draw the segment body
        ctx.fillRect(drawX, drawY, drawWidth, drawHeight);

        // --- NEW: ADDING EYES TO THE HEAD ---
        if (i === 0) {
            ctx.fillStyle = "#ffffff"; // White for the eyes
            let eyeSize = 3;           // Radius of the eyes
            let offset = 5;            // Distance from the edges

            let leftEyeX, leftEyeY, rightEyeX, rightEyeY;

            // Calculate eye placement depending on which way the head is facing
            if (velocityX === 1) { // Moving RIGHT
                leftEyeX = x + gridSize - offset; leftEyeY = y + offset;
                rightEyeX = x + gridSize - offset; rightEyeY = y + gridSize - offset;
            } else if (velocityX === -1) { // Moving LEFT
                leftEyeX = x + offset; leftEyeY = y + offset;
                rightEyeX = x + offset; rightEyeY = y + gridSize - offset;
            } else if (velocityY === -1) { // Moving UP
                leftEyeX = x + offset; leftEyeY = y + offset;
                rightEyeX = x + gridSize - offset; rightEyeY = y + offset;
            } else if (velocityY === 1) { // Moving DOWN
                leftEyeX = x + offset; leftEyeY = y + gridSize - offset;
                rightEyeX = x + gridSize - offset; rightEyeY = y + gridSize - offset;
            }

            // Draw Left Eye
            ctx.beginPath();
            ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
            ctx.fill();

            // Draw Right Eye
            ctx.beginPath();
            ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

spawnFood();
setInterval(gameLoop, 100);

window.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const keyPressed = event.key;

    // Check if we are moving horizontally or vertically right now
    const goingUp = (velocityY === -1);
    const goingDown = (velocityY === 1);
    const goingLeft = (velocityX === -1);
    const goingRight = (velocityX === 1);

    // Only allow pressing UP if we aren't currently going DOWN
    if (keyPressed === "ArrowUp" && !goingDown) {
        velocityX = 0;
        velocityY = -1;
    } 
    // Only allow pressing DOWN if we aren't currently going UP
    else if (keyPressed === "ArrowDown" && !goingUp) {
        velocityX = 0;
        velocityY = 1;
    } 
    // Only allow pressing LEFT if we aren't currently going RIGHT
    else if (keyPressed === "ArrowLeft" && !goingRight) {
        velocityX = -1;
        velocityY = 0;
    } 
    // Only allow pressing RIGHT if we aren't currently going LEFT
    else if (keyPressed === "ArrowRight" && !goingLeft) {
        velocityX = 1;
        velocityY = 0;
    }
}

function spawnFood() {
    let foodOnSnake = true;

    // Keep running this loop as long as the food is spawning on top of the snake
    while (foodOnSnake) {
        // 1. Pick a random grid position
        foodX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        foodY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;

        // 2. Check if this random spot matches ANY part of the snake's body
        foodOnSnake = false; // Assume it's a good spot first
        for (let i = 0; i < snake.length; i++) {
            if (foodX === snake[i].x && foodY === snake[i].y) {
                foodOnSnake = true; // Uh oh, it's on the snake! Break out and try again.
                break; 
            }
        }
    }
}