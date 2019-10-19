const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreBoard = document.getElementById('scoreBoard');
var ranking = [];
let totalScore = 0;
var difficultyCounter = 0;
var difficultyArray = ["Fácil", "Médio", "Difícil", "Desafiante", "Especialista"];

context.scale(20, 20);

const tPiece = [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1],
];

const lPiece = [
    [0, 2, 0],
    [0, 2, 0],
    [0, 2, 2],
];

const iPiece = [
    [0 ,0, 3, 0, 0],
    [0 ,0, 3, 0, 0],
    [0 ,0, 3, 0, 0],
    [0 ,0, 3, 0, 0],
];

const zPiece = [
    [0 ,0, 0],
    [4, 4, 0],
    [0, 4, 4],
];

const sPiece = [
    [0, 0, 0],
    [0, 6, 6],
    [6, 6, 0],
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
var dropController = 0;
var piece = 0;
let pause = false;

var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;

if (!pause){
    setInterval(setTime, 1000);
}

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = stringTime(totalSeconds % 60);
  minutesLabel.innerHTML = stringTime(parseInt(totalSeconds / 60));
}

function stringTime(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else
    return valString;
}

function blockDrop() {
    player.position.y--;

    if (collide(gameMap, player)) {
        player.position.y++;
        matrixJoin(gameMap, player);
        resetBlockPosition();
        gameMapSweep();
    }

    dropRate = 0;
}

function randomGenerator() {
    piece = Math.floor(Math.random() * (7 - 1) + 1);
    return piece;
}

function getCurrentScore() {
    let havePoints = true;
    let nRows = 0;
    let ri = [];

    gameMap.map(function(row) {
        havePoints = true;

        row.map(function (el) {
            if (el == 0) { havePoints = false; }
        })
        if (havePoints) {
            console.log(gameMap.indexOf(row))
            nRows++;
            ri.push(gameMap.indexOf(row))
        }
    })

    ri.reverse()
    return (10 * nRows * nRows);
}

function resetBlockPosition() {
    randomGenerator();

    totalScore += getCurrentScore();
    difficulty.innerHTML = difficultyArray[difficultyCounter];
    scoreBoard.innerHTML = totalScore;
    if (totalScore % 500 == 0 && totalScore != 0 && totalScore != dropController) { //Lógica incorreta em totalScore % 500 == 0
        if (dropInterval > 200) {
            difficultyCounter++;
            dropInterval -= 200;
        } else if (dropInterval > 20) {
            dropInterval -= 20;
        }
        dropController = totalScore;
    }

  switch(piece) {
    case 1:
        let t = tPiece.slice(0);
      player.matrix = t;
      break;
    case 2:
      player.matrix = lPiece;
      break;
    case 3:
      player.matrix = iPiece;
      break;
    case 4:
      player.matrix = zPiece;
      break;
    case 5:
      player.matrix = square;
      break;
    case 6:
      player.matrix = sPiece;
      break;
    case 7:
      player.matrix = jPiece;
      break;
    }
/*
  if (player.matrix == lPiece || player.matrix == jPiece || player.matrix == square || player.matrix == iPiece) {
      player.position.y = gameMap.length - player.matrix.length;
  } else {
    player.position.y = gameMap.length - player.matrix.length + 1;
  }
  */
  player.position.y = gameMap.length - player.matrix.length;
  player.position.x = (gameMap[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

    endGame();
}

function endGame() {
    if (collide(gameMap, player)) {
        gameMap.forEach(row => row.fill(0));
        alert("End game");
        let dropInterval = 1000;

        ranking.push("Etevaldo", totalScore, difficultyArray[difficultyCounter], parseInt(totalSeconds / 60), totalSeconds % 60); //achar alguma maneira de inserir o tempo num melhor formato

        totalSeconds = 0;
        totalScore = 0;
        difficultyCounter = 0;
        difficulty.innerHTML = difficultyArray[difficultyCounter];
        scoreBoard.innerHTML = totalScore;

        rankingJog.innerHTML = ranking.toString();
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

    if (dropRate > dropInterval && !pause) {
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
  if (event.keyCode === 27) {
        if (pause) {
            pause = false;
        }else{
            pause = true;
        }
    }

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
            gameMapSweep();
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

function gameMapSweep() {
    outer: for (let y = 0; y < gameMap.length-1; ++y) {
        for (let x = 0; x < gameMap[y].length; ++x) {
            if (gameMap[y][x] === 0) {
                continue outer;
            }
        }

        const row = gameMap.splice(y, 1)[0].fill(0);
        gameMap.push(row);
       --y;
    }
}

resetBlockPosition();
update();
