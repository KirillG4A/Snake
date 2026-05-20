const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

const gridSize = 20;

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "green";
    ctx.fillRect(100, 100, gridSize, gridSize);
}

setInterval(gameLoop, 100);