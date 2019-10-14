const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

const tPiece = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
];

const lPiece = [
    [0, 2, 0],
    [0, 2, 0],
    [0, 2, 2],
];

const iPiece = [
    [0 ,3, 0, 0],
    [0 ,3, 0, 0],
    [0 ,3, 0, 0],
    [0 ,3, 0, 0],
];

const zPiece = [
    [4 ,4, 0],
    [0, 4, 4],
    [0, 0, 0],
];

const sPiece = [
    [0, 6, 6],
    [6, 6, 0],
    [0, 0, 0],
];

const square = [
    [7, 7],
    [7, 7],
];

const jPiece = [ 
    [0, 8, 0],
    [0, 8, 0],
    [8, 8, 0],
];

const player = {
    position: {x: 0, y: 0},
    matrix: null,
}

const gameMap = createMatrix(15, 25);

let dropRate = 0;
let dropInterval = 1000;
let lastTime = 0;
var piece = 0;


function blockDrop() {
    player.position.y--;

    if (collide(gameMap, player)) {
        player.position.y++;
        matrixJoin(gameMap, player);
        resetBlockPosition();
    }

    dropRate = 0;
}

function randomGenerator() {
    piece = Math.floor(Math.random() * (7 - 1) + 1);
    return piece;
}

function resetBlockPosition() {
    randomGenerator();

  switch(piece) {
    case 1:
      player.matrix = tPiece;
      player.position.y = 23;
      player.position.x = 6;
      break;
    case 2:
      player.matrix = lPiece;
      player.position.y = 22;
      player.position.x = 6;
      break;
    case 3:
      player.matrix = iPiece;
      player.position.y = 21;
      player.position.x = 6;
      break;
    case 4:
      player.matrix = zPiece;
      player.position.y = 22;
      player.position.x = 6;
      break;
    case 5:
      player.matrix = square;
      player.position.y = 23;
      player.position.x = 6;
      break;
    case 6:
      player.matrix = sPiece;
      player.position.y = 23;
      player.position.x = 6;
      break;
    case 7:
      player.matrix = jPiece;
      player.position.y = 23;
      player.position.x = 6;
      break;
  }
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(gameMap,  {x: 0, y: 0});
    drawMatrix(player.matrix, player.position);
}

function collide(gameMap, player) {
    const m = player.matrix;
    const o = player.position;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (gameMap[y + o.y] &&
                gameMap[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function update(time = 0) {
    const interval = time - lastTime;

    dropRate = dropRate + interval;

    if (dropRate > dropInterval) {
        blockDrop();
    }

    lastTime = time;

    draw();
    requestAnimationFrame(update);
}

function matrixJoin(gameMap, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                gameMap[y + player.position.y][x + player.position.x] = value;
            }
        });
    });
}

function createMatrix(width, height) {
    const matrix = [];
    while (height--) {
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                context.fillStyle = 'purple';
                context.fillRect(x + offset.x,
                                 y + offset.y, 1, 1);
            } else if (value === 2) {
                context.fillStyle = 'blue';
                context.fillRect(x + offset.x,
                                 y + offset.y, 1, 1);
            } else if (value === 3) {
                context.fillStyle = 'cyan';
                context.fillRect(x + offset.x,
                                 y + offset.y, 1, 1);
            } else if (value === 4) {
                context.fillStyle = 'green';
                context.fillRect(x + offset.x,
                                 y + offset.y, 1, 1);
            } else if (value === 5) {
                context.fillStyle = 'yellow';
                context.fillRect(x + offset.x,
                                 y + offset.y, 1, 1);
            } else if (value === 6) {
                context.fillStyle = 'brown';
                context.fillRect(x + offset.x,
                                 y + offset.y, 1, 1);
            } else if (value === 7) {
                context.fillStyle = 'pink';
                context.fillRect(x + offset.x,
                                 y + offset.y, 1, 1);
            }
    });
});
}

document.addEventListener('keydown', event => {
   if (event.keyCode === 37) {
    player.position.x = player.position.x - 1;
    if (collide(gameMap, player)) {
        player.position.x = player.position.x + 1;
        }
    } else if (event.keyCode === 39) {
        player.position.x = player.position.x + 1;
        if (collide(gameMap, player)) {
            player.position.x = player.position.x - 1;
            }
    } else if (event.keyCode === 38){
        player.position.y = player.position.y - 1;
        if (collide(gameMap, player)) {
            player.position.y++;
            matrixJoin(gameMap, player);
            resetBlockPosition();
        }
    } else if (event.keyCode === 32) {
        rotate(player.matrix);
    }
});

function rotate(matrix) {
    const x = Math.floor(matrix.length / 2);
    const y = matrix.length - 1;
    for (let i = 0; i < x; i++) {
       for (let j = i; j < y - i; j++) {
          k = matrix[i][j];
          matrix[i][j] = matrix[y - j][i];
          matrix[y - j][i] = matrix[y - i][y - j];
          matrix[y - i][y - j] = matrix[j][y - i]
          matrix[j][y - i] = k
       }
    }
  }

resetBlockPosition();
update();
