const gameBoard = document.querySelector(".game-board");
const SNAKE_SPEED = 5;
const EXPANSION_RATE = 3;
const GRID_SIZE = 21;

let inputDirection = { x: 1, y: 0 };
let lastInputDirection = { x: 0, y: 0 };
let newSegment = 0;
let lastRenderTime = 0;
let intervalID = null;
let gameOver = false;
let food = {
  x: 10,
  y: 10,
};

const snakeBody = [
  {
    x: 11,
    y: 11,
  },
];

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (lastInputDirection.y !== 0) break;
      inputDirection = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (lastInputDirection.y !== 0) break;
      inputDirection = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (lastInputDirection.x !== 0) break;
      inputDirection = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (lastInputDirection.x !== 0) break;
      inputDirection = { x: 1, y: 0 };
      break;
  }
});

main();

/* functions */
function main() {
  intervalID = setInterval(DOMUpdate, 1000 / (SNAKE_SPEED * snakeBody.length));
}

function DOMUpdate() {
  if (gameOver) {
    clearInterval(intervalID);
    return alert("you loose");
  }
  update();
  draw();
}

function update() {
  updateSnake();
  updateFood();
  checkDeath();
}

function updateSnake() {
  addSegments();
  const direction = getInputDirection();
  console.log("update");
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }
  snakeBody[0].x += direction.x;
  snakeBody[0].y += direction.y;
}

function updateFood() {
  if (onSnake(food)) {
    expandSnake(EXPANSION_RATE);
    food = getRandomFoodPosition();
  }
}

function draw() {
  gameBoard.innerHTML = "";
  drawSnake();
  drawFood();
}

function drawSnake() {
  snakeBody.map((segment) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.classList.add("snake");
    gameBoard.appendChild(snakeElement);
  });
}

function drawFood() {
  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);
}

function getInputDirection() {
  lastInputDirection = inputDirection;
  return inputDirection;
}

function expandSnake(amount) {
  newSegment += amount;
}

function onSnake(position, { ignoreHead = false } = {}) {
  return snakeBody.some((segment, index) => {
    if (ignoreHead && index === 0) return false;
    return equalPosition(segment, position);
  });
}

function equalPosition(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

function addSegments() {
  for (let i = 0; i < newSegment; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  newSegment = 0;
}

function getRandomFoodPosition() {
  let newFoodPosition;
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    newFoodPosition = randomGridPosition();
  }
  return newFoodPosition;
}

function randomGridPosition() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE) + 1,
    y: Math.floor(Math.random() * GRID_SIZE) + 1,
  };
}

function checkDeath() {
  gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}

function outsideGrid(position) {
  return (
    position.x < 1 ||
    position.x > GRID_SIZE ||
    position.y < 1 ||
    position.y > GRID_SIZE
  );
}

function getSnakeHead() {
  return snakeBody[0];
}

function snakeIntersection() {
  return onSnake(snakeBody[0], { ignoreHead: true });
}
