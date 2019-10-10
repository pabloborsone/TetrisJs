const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);


const matrix = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
];

const matrix2 = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
];

const matrix3 = [
    [0, 0, 0],
    [1, 1, 0],
    [1, 1, 0],
];

const matrix4 = [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
];

const matrix5 = [
    [0, 0, 1],
    [0, 0, 1],
    [0, 1, 1],
];

const matrix6 = [
    [0, 0, 0],
    [1, 0, 1],
    [1, 1, 1],
];


const player = {
    position: {x: 6, y: 0},
    matrix: matrix
}

const gameMap = createMatrix(15, 25);

let dropRate = 0;
let dropInterval = 1000;
let lastTime = 0;


function blockDrop() {


    player.position.y++;

    if (collide(gameMap, player)) {
        player.position.y--;
        matrixJoin(gameMap, player);
        resetBlockPosition();
    }

    dropRate = 0;
}

function resetBlockPosition() {
  piece = Math.floor(Math.random() * 5);

  switch(piece) {
    case 0:
      player.matrix = matrix;
      break;
    case 1:
      player.matrix = matrix2;
      break;
    case 2:
      player.matrix = matrix3;
        break;
    case 3:
      player.matrix = matrix4;
        break;
    case 4:
      player.matrix = matrix5;
      break;
    case 5:
      player.matrix = matrix6;
      break;
    }

    player.position.y = 0;
    player.position.x = 6;
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
            if (value !== 0) {
                context.fillStyle = 'red';
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
    } else if (event.keyCode === 40){
        player.position.y = player.position.y + 1;

        if (collide(gameMap, player)) {
            player.position.y--;
            matrixJoin(gameMap, player);
            resetBlockPosition();
        }
    } else if (event.keyCode === 32) {
        rotate(matrix);
    }
});

function rotate(matrix) {
    const n = matrix.length;
    const x = Math.floor(n/ 2);
    const y = n - 1;
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

update();
