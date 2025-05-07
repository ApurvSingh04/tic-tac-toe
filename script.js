let currentPlayer = 'X';
let player1 = 'X';
let player2 = 'O';
let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let gameMode = 'friend'; // Default game mode is 'friend'
let player1Score = 0;
let player2Score = 0;
let drawScore = 0;
let difficulty = 'Easy';

function changeGameMode() {
    gameMode = document.getElementById('mode-select').value;
    restart();
}

function changeDifficulty() {
    difficulty = document.getElementById('difficulty-select').value;
}

function startGame() {
    currentPlayer = Math.random() < 0.5 ? player1 : player2;
    document.getElementById('turn').innerText = currentPlayer === player1 ? "Turn: Player 1" : "Turn: Player 2";
    if (gameMode === 'computer' && currentPlayer === player2) {
        makeComputerMove();
    }
}

function updateScore() {
    document.getElementById('player1-score').innerText = `Player 1: ${player1Score}`;
    document.getElementById('player2-score').innerText = `Player 2: ${player2Score}`;
    document.getElementById('draw-score').innerText = `Draws: ${drawScore}`;
}

function makeMove(index) {
    if (!gameOver && board[index] === '') {
        board[index] = currentPlayer;
        document.getElementsByClassName('cell')[index].innerText = currentPlayer;
        if (checkWinner()) {
            if (currentPlayer === player1) {
                player1Score++;
            } else {
                player2Score++;
            }
            document.getElementById('popup-text').innerText = currentPlayer === player1 ? "Player 1 wins!" : (gameMode === 'friend' ? "Player 2 wins!" : "Computer wins!");
            document.getElementById('popup').style.display = 'flex';
            gameOver = true;
        } else if (board.every(cell => cell !== '')) {
            drawScore++;
            document.getElementById('popup-text').innerText = 'It\'s a draw!';
            document.getElementById('popup').style.display = 'flex';
            gameOver = true;
        } else {
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            document.getElementById('turn').innerText = currentPlayer === player1 ? "Turn: Player 1" : "Turn: Player 2";
            if (gameMode === 'computer' && currentPlayer === player2) {
                makeComputerMove();
            }
        }
        updateScore();
    }
}

function makeComputerMove() {
    if (difficulty === 'Easy') {
        makeRandomMove();
    } else if (difficulty === 'Medium') {
        if (!blockPlayerWin()) {
            makeRandomMove();
        }
    } else if (difficulty === 'Hard') {
        makeOptimalMove();
    }
}

function makeRandomMove() {
    const emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    setTimeout(() => {
        makeMove(randomIndex);
    }, 500);
}

function blockPlayerWin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] === 'X' && board[b] === 'X' && board[c] === '') {
            setTimeout(() => {
                makeMove(c);
            }, 500);
            return true;
        } else if (board[a] === 'X' && board[c] === 'X' && board[b] === '') {
            setTimeout(() => {
                makeMove(b);
            }, 500);
            return true;
        } else if (board[b] === 'X' && board[c] === 'X' && board[a] === '') {
            setTimeout(() => {
                makeMove(a);
            }, 500);
            return true;
        }
    }
    return false;
}

function makeOptimalMove() {
    // Placeholder for minimax algorithm (to be implemented for Hard difficulty)
    makeRandomMove();
}

function checkWinner() {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let condition of winConditions) {
        if (board[condition[0]] !== '' && 
            board[condition[0]] === board[condition[1]] && 
            board[condition[0]] === board[condition[2]]) {
                return true;
        }
    }

    return false;
}

function restart() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    document.getElementById('popup').style.display = 'none';
    startGame();
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.innerText = '';
    }
    updateScore();
}

window.onload = function() {
    startGame();
    updateScore();
    document.getElementById('difficulty-select').addEventListener('change', changeDifficulty);
};

