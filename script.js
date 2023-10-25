// Page elements
const grid = document.querySelector('.grid');
const stackBtn = document.querySelector('.stack-button');
const scoreCounter = document.querySelector('.score-counter');
const endGameScreen = document.querySelector('.lose-end-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again-button');
const infoButton = document.querySelector('.info-button');

// GAME FIELD
const gridMatrix = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 0]
];

// Logic vars
let currentRowIndex = gridMatrix.length - 1;
let barDirection = 'right';
let barSize = 3;
let isGameOver = false;
let score = 0;
let t;

//########################### ALL FUNCTIONS #################################//

function draw () {
  // clear old field div //
  grid.innerHTML = '';

  gridMatrix.forEach(function (rowContent, rowIndex) {
    rowContent.forEach(function (cellContent, cellIndex) {
      // create cell
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // chess board style
      const isRowEven = rowIndex % 2 === 0;
      const isCellEven = cellIndex % 2 === 0;

      if ((isRowEven && isCellEven) || (!isRowEven && !isCellEven)) {
        cell.classList.add('cell-dark');
      }

      // making bar
      if (cellContent === 1) {
        cell.classList.add('bar');
      }

      // Insert all to game field //
      grid.appendChild(cell);
    });
  });
}

// 4 basic move functions //

function moveRight (row) {
  row.pop();
  row.unshift(0);
}

function moveLeft (row) {
  row.shift();
  row.push(0);
}

function isRightEdge (row) {
  const lastElement = row[row.length - 1];
  return lastElement === 1;
}

function isLeftEdge (row) {
  const firstElement = row[0];
  return firstElement === 1;
}

// Full move function //

function moveBar () {
  const currentRow = gridMatrix[currentRowIndex];

  if (barDirection === 'right') {
    moveRight(currentRow);
    if (isRightEdge(currentRow)) {
      barDirection = 'left';
    }
  } else if (barDirection === 'left') {
    moveLeft(currentRow);
    if (isLeftEdge(currentRow)) {
      barDirection = 'right';
    }
  }
}



function checkLost () {
  const currentRow = gridMatrix[currentRowIndex];
  const prevRow = gridMatrix[currentRowIndex + 1];

// console.log(currentRow); == [0, 1, 1, 1, 0, 0] -- here last "1" disappears
// console.log(prevRow); ==    [1, 1, 1, 0, 0, 0]


  // Exclude for first action(exit from func) //
  if (!prevRow) return;

  // CHECK FOR BASE ELEMENTS //
  for (let i = 0; i < currentRow.length; i++) {
    
    if (currentRow[i] === 1 && prevRow[i] === 0) {
      // Reduce bar(where is no base under)//
      currentRow[i] = 0;
      barSize--;

      // CASE IF BAR FINISHED //
      if (barSize === 0) {
        isGameOver = true; // Game over
        clearInterval(t);
        endGame(false);
      }
    }
  }
}

// Check WIN //

function checkWin () {
  if (currentRowIndex === 0) {
    isGameOver = true;
    clearInterval(t);
    endGame(true);
  }
}

// STACK FUNCTION //

function onStack () {
  // win/lost check
  checkLost();
  checkWin();

  if (isGameOver) return; // if true -- finish all

  updateScore();

  // Start from new row //
  currentRowIndex = currentRowIndex - 1;
  barDirection = 'right';
  
  // draw the bar //
  for (let i = 0; i < barSize; i++) {
    gridMatrix[currentRowIndex][i] = 1;
  }

  draw();
}

function updateScore () {
  // Increase score (DEPENDS ON BAR-SIZE) //
  if (barSize === 3) {
    score += 3;
  } else if (barSize === 2) {
    score += 2;
  } else if (barSize === 1) {
  score++;
  }

  scoreCounter.innerText = String(score).padStart(5, '0');
}

// Funzione per il gameover
function endGame(isVictory) {
  // check if you won //
  if (isVictory) {
    draw();
    if (barSize === 0) {
      grid.classList.add('grid-lose');
      endGameScreen.classList.remove('hidden');  
      playAgainButton.classList.add('lose');
      playAgainButton.focus();
      return;
    }
    updateScore();
    grid.classList.add('grid-win');
    endGameText.innerHTML = 'YOU<br>WON';
    endGameScreen.classList.remove('lose-end-screen');
    endGameScreen.classList.add('win-end-screen');
    playAgainButton.classList.add('win');
  } else {
      // Lost condition //
      grid.classList.add('grid-lose');
      endGameScreen.classList.remove('hidden');  
      playAgainButton.classList.add('lose');
      playAgainButton.focus();
  }

  endGameScreen.classList.remove('hidden');  

}


// Restart func for game in button //

function onPlayAgain () {
  location.reload();
}


//----------------------Main-game function-------------------------//

function main () {
  moveBar();
  draw();
}

// button events //

stackBtn.addEventListener('click', onStack);
document.addEventListener('keyup', function(event) {
  if (event.key === " ") {
    onStack();                    
  }
});
playAgainButton.addEventListener('click', onPlayAgain);

infoButton.addEventListener('click', function(event) {
  alert("Click on the game-board to stack the blocks");
});



//-------------------START OF GAMEPLAY------------------//

// First draw
draw();

// Start game Loop
t = setInterval(main, 500);

