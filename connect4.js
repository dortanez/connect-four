const WIDTH = 7;
const HEIGHT = 6;

const playerTurn = document.getElementById('player-turn');
let currPlayer = 1; 
playerTurn.innerText = 'Player 1\'s turn'

// array of rows, each row is array of cells  (board[y][x])
const board = []; 

// create board array
const makeBoard = () => {
  for(let i = 0; i < HEIGHT; i++) {
    const arr = [];
    for(let j = 0; j < WIDTH; j++) {
      arr.push(null);
    }
    board.push(arr);
  }
}

const makeHtmlBoard = () => {
  const board = document.querySelector('#board');

  // create top row
  const top = document.createElement("tr");

  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for(let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  board.append(top);

  // create game cells
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.classList.add('cell');
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = (x) => {
  for(let y = HEIGHT - 1; y >= 0; y--) {
    if(board[y][x] !== null) {
      continue;
    } else {
      return y;
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */
const placeInTable = (y,x) => {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);

  const cell = document.getElementById(`${y}-${x}`);
  cell.appendChild(piece);
}

const endGame = (msg) => {
    const interval = setInterval(() => {
      alert(msg);
      clearInterval(interval)
    },500);
    restartGame();
}

const restartGame = () => {
  setInterval(() => {
    location.reload();
  },500)
}

// clicking to play a piece
const handleClick = (evt) => {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // update board variable to which player took the spot - if the spot is taken by player number, do nothing. else, add player number in spot
  if(board[y][x] !== null) {
    return;
  } else {
    board[y][x] = currPlayer;
  }

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} wins!`);
  }

  // check for tie - see if every value in board array has player number
  const isTie = () => {
    return board.every((val) => {
      return val.indexOf(null) === -1;
    })
  }
  if(isTie()) {
    alert('tie');
    location.reload();
  }

  // switch players
  if(currPlayer === 1) {
    currPlayer = 2;
    playerTurn.innerText = `Player ${currPlayer}'s turn`;
  } else {
    currPlayer = 1;
    playerTurn.innerText = `Player ${currPlayer}'s turn`;
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [
        [y, x], 
        [y, x + 1], 
        [y, x + 2], 
        [y, x + 3]
      ];
      const vert = [
        [y, x], 
        [y + 1, x], 
        [y + 2, x], 
        [y + 3, x]
      ];
      const diagDR = [
        [y, x], 
        [y + 1, x + 1], 
        [y + 2, x + 2], 
        [y + 3, x + 3]
      ];
      const diagDL = [
        [y, x], 
        [y + 1, x - 1], 
        [y + 2, x - 2], 
        [y + 3, x - 3]
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
