const playerTurn = document.getElementById('player-turn');
playerTurn.innerText = 'Player 1\'s turn'


class Game {
  constructor(p1, p2, height = 7, width = 6) {
    this.height = height;
    this.width = width;
    this.players = ['1', '2'];
    this.currPlayer = this.players[0];
    this.gameOver = false;
    this.makeBoard();
    this.makeHtmlBoard();
  }
  // create board array
  makeBoard() {
    this.board = [];
    console.log(this.board)
    for(let y = 0; y < this.height; y++) {
      this.board.push(Array.from({length: this.width}));
    }
  }
  makeHtmlBoard() {
    const board = document.querySelector('#board');
  
    // create top row
    const top = document.createElement("tr");
  
    top.setAttribute("id", "column-top");
    this.handleGameClick = this.handleClick.bind(this);
    top.addEventListener("click", this.handleGameClick);
  
    for(let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    board.append(top);
  
    // create game cells
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.classList.add('cell');
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }
  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y,x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    const cell = document.getElementById(`${y}-${x}`);
    cell.appendChild(piece);
  }
  endGame(msg) {
    const interval = setInterval(() => {
      alert(msg);
      clearInterval(interval)
    },500);
    this.restartGame();
    const top = document.querySelector('#column-top');
    top.removeEventListener('click',this.handleGameClick)
  }
  restartGame() {
    setInterval(() => {
      location.reload();
    },500)
  }
  // clicking to play a piece
  handleClick(evt) {
  // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    
    // place piece in board and add to HTML table
    this.placeInTable(y, x);

    // update board variable to which player took the spot - if the spot is taken by player number, do nothing. else, add player number in spot
    this.board[y][x] = this.currPlayer

    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer} wins!`);
    }

    // // check for tie - see if every value in board array has player number
    const isTie = () => {
      return this.board.every((val) => {
        return val.indexOf(undefined) === -1;
      })
    }
    if(isTie()) {
      alert('It\'s a tie!');
      location.reload();
    }

    // switch players
    if(this.currPlayer === this.players[0]) {
      this.currPlayer = this.players[1];
      playerTurn.innerText = "Player " + this.currPlayer + "\'s turn"
    } else {
      this.currPlayer = this.players[0];
      playerTurn.innerText = "Player " + this.currPlayer + "\'s turn"
    }
  }
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
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
}

new Game()

