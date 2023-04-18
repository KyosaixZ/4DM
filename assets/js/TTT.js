// variables to keep track of game state
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameStatus = '';

// selectors
const cells = document.querySelectorAll('td');
const resetBtn = document.getElementById('reset');

// add event listener to each cell
cells.forEach((cell) => {
	cell.addEventListener('click', cellClicked);
});

// add event listener to reset button
resetBtn.addEventListener('click', resetGame);

// function to handle cell clicked
function cellClicked() {
  const cellIndex = parseInt(this.id);

  // check if cell is already clicked or game is over
  if (board[cellIndex] !== '' || gameStatus !== '') {
      return;
  }

  // update board with current player's symbol
  board[cellIndex] = currentPlayer;

  // update cell text content and style
  this.textContent = currentPlayer;
  this.style.color = currentPlayer === 'X' ? 'red' : 'blue';

  // check if current player has won
  if (checkWin()) {
      gameStatus = `${currentPlayer} wins!`;
      endGame();
      return;
  }

  // check if game is tied
  if (checkTie()) {
      gameStatus = 'Tie game!';
      endGame();
      return;
  }

  // switch to next player
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  // if playing with bot and it's the bot's turn
  if (playWithBot && currentPlayer === 'O') {
      // make bot's move
      const botIndex = getBotMove();
      cells[botIndex].click();
  }
}

// function to check if current player has won
function checkWin() {
	// check rows
	for (let i = 0; i < 9; i += 3) {
		if (board[i] !== '' && board[i] === board[i+1] && board[i] === board[i+2]) {
			return true;
		}
	}

	// check columns
	for (let i = 0; i < 3; i++) {
		if (board[i] !== '' && board[i] === board[i+3] && board[i] === board[i+6]) {
			return true;
		}
	}

	// check diagonals
	if (board[0] !== '' && board[0] === board[4] && board[0] === board[8]) {
		return true;
	}
	if (board[2] !== '' && board[2] === board[4] && board[2] === board[6]) {
		return true;
	}

	// no win
	return false;
}

// function to check if game is tied
function checkTie() {
	return board.every((cell) => cell !== '');
}

// function to end the game
function endGame() {
	// disable all cells
	cells.forEach((cell) => cell.removeEventListener('click', cellClicked));

	// show game status
	alert(gameStatus);
}

// function to reset the game
function resetGame() {
	// reset variables
	board = ['', '', '', '', '', '', '', '', ''];
	currentPlayer = 'X';
	gameStatus = '';

	// reset cell text content and style
	cells.forEach((cell) => {
		cell.textContent = '';
		cell.style.color = '';
	});

	// enable all cells
	cells.forEach((cell) => cell.addEventListener('click', cellClicked));
}

const toggleBotBtn = document.getElementById('toggle-bot');
let playWithBot = false;

toggleBotBtn.addEventListener('click', () => {
    playWithBot = !playWithBot;
    if (playWithBot) {
        toggleBotBtn.textContent = 'Play with Human';
        // make bot's first move
        const randomIndex = Math.floor(Math.random() * 9);
        cells[randomIndex].click();
    } else {
        toggleBotBtn.textContent = 'Play with Bot';
    }
});

//           EASY BOT
//
//function getBotMove() {
//   // check if bot can win on next move
//   for (let i = 0; i < 9; i++) {
//       if (board[i] === '') {
//           board[i] = 'O';
//           if (checkWin()) {
//               board[i] = '';
//               return i;
//           }
//           board[i] = '';
//       }
//   }

//   // check if human can win on next move
//   for (let i = 0; i < 9; i++) {
//       if (board[i] === '') {
//           board[i] = 'X';
//           if (checkWin()) {
//               board[i] = '';
//               return i;
//           }
//           board[i] = '';
//       }
//   }

//   // choose a random available cell
//   while (true) {
//     const randomIndex = Math.floor(Math.random() * 9);
//     if (board[randomIndex] === '') {
//         return randomIndex;
//     }
// }
// }

function getBotMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, 0, false);
        board[i] = '';
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }
  
  function minimax(board, depth, isMaximizing) {
    if (checkWin() !== null) {
      if (checkWin() === 'O') {
        return 10 - depth;
      } else if (checkWin() === 'X') {
        return depth - 10;
      } else {
        return 0;
      }
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i] = '';
          bestScore = Math.max(bestScore, score);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i] = '';
          bestScore = Math.min(bestScore, score);
        }
      }
      return bestScore;
    }
  }  