const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);


const matrix = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
];

const player = {
    position: {x: 6, y: 0},
    matrix: matrix
}

const gameMap = createMatrix(12, 20);

let dropRate = 0;
let dropInterval = 1000;

let lastTime = 0;

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);    
    
    drawMatrix(player.matrix, player.position);
}

function matrixJoin() {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                gameMap[y + player.position.y][x + player.position.x] = value;
            }
        });
    });
}

function update(time = 0) {
    const interval = time - lastTime;
    lastTime = time;

    dropRate = dropRate + interval;

    if (dropRate > dropInterval) {
        player.position.y = player.position.y + 1;
        dropRate = 0;
    }
    draw();
    requestAnimationFrame(update);
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
    } else if (event.keyCode === 39) {
        player.position.x = player.position.x + 1;
    } else if (event.keyCode === 40){
       player.position.y = player.position.y + 1;
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
