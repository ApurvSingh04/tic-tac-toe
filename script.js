let currentPlayer = 'X';
let player1 = 'X';
let player2 = 'O';
let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let gameMode = 'friend';
let player1Score = 0;
let player2Score = 0;
let drawScore = 0;
let difficulty = 'Easy';

function changeGameMode() {
    gameMode = document.getElementById('mode-select').value;
    restart();
    // Update scores to show correct labels after mode change
    updateScore();
}

function changeDifficulty() {
    difficulty = document.getElementById('difficulty-select').value;
}

function startGame() {
    currentPlayer = Math.random() < 0.5 ? player1 : player2;
    updateTurnText();
    if (gameMode === 'computer' && currentPlayer === player2) {
        makeComputerMove();
    }
}

function updateTurnText() {
    if (currentPlayer === player1) {
        document.getElementById('turn').innerText = gameMode === 'computer' ? "Turn: Your Turn" : "Turn: Player 1";
    } else {
        document.getElementById('turn').innerText = gameMode === 'computer' ? "Turn: Computer" : "Turn: Player 2";
    }
}

function updateScore() {
    document.getElementById('player1-score').innerText = `Player 1: ${player1Score}`;
    
    // Change label based on game mode
    if (gameMode === 'computer') {
        document.getElementById('player2-score').innerText = `Computer: ${player2Score}`;
    } else {
        document.getElementById('player2-score').innerText = `Player 2: ${player2Score}`;
    }
    
    document.getElementById('draw-score').innerText = `Draws: ${drawScore}`;
}

function makeMove(index) {
    if (!gameOver && board[index] === '') {
        board[index] = currentPlayer;
        const cellElement = document.getElementsByClassName('cell')[index];
        cellElement.innerText = currentPlayer;
        
        // Add animation to cell when placed
        cellElement.classList.add('placed');
        setTimeout(() => cellElement.classList.remove('placed'), 300);
        
        if (checkWinner()) {
            if (currentPlayer === player1) {
                player1Score++;
            } else {
                player2Score++;
            }
            
            const winMessage = currentPlayer === player1 ? 
                "Player 1 wins!" : 
                (gameMode === 'friend' ? "Player 2 wins!" : "Computer wins!");
            setTimeout(() => {
                document.getElementById('popup-text').innerText = winMessage;
                document.getElementById('popup').style.display = 'flex';
            }, 1200);
            
            gameOver = true;
        } else if (board.every(cell => cell !== '')) {
            drawScore++;
            
            setTimeout(() => {
                document.getElementById('popup-text').innerText = 'It\'s a draw!';
                document.getElementById('popup').style.display = 'flex';
            }, 500);
            
            gameOver = true;
        } else {
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            updateTurnText();
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
    
    // First check if computer can win
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        // Check if computer can win with one more move
        if (board[a] === player2 && board[b] === player2 && board[c] === '') {
            setTimeout(() => {
                makeMove(c);
            }, 500);
            return true;
        } else if (board[a] === player2 && board[c] === player2 && board[b] === '') {
            setTimeout(() => {
                makeMove(b);
            }, 500);
            return true;
        } else if (board[b] === player2 && board[c] === player2 && board[a] === '') {
            setTimeout(() => {
                makeMove(a);
            }, 500);
            return true;
        }
    }
    
    // If computer can't win, block player's winning move
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] === player1 && board[b] === player1 && board[c] === '') {
            setTimeout(() => {
                makeMove(c);
            }, 500);
            return true;
        } else if (board[a] === player1 && board[c] === player1 && board[b] === '') {
            setTimeout(() => {
                makeMove(b);
            }, 500);
            return true;
        } else if (board[b] === player1 && board[c] === player1 && board[a] === '') {
            setTimeout(() => {
                makeMove(a);
            }, 500);
            return true;
        }
    }
    return false;
}

function makeOptimalMove() {
    let bestScore = -Infinity;
    let bestMove;
    
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = player2;
            let score = minimax(board, 0, false);
            board[i] = '';
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    setTimeout(() => {
        makeMove(bestMove);
    }, 500);
}

// Minimax algorithm 
function minimax(board, depth, isMaximizing) {
    if (checkWinnerForMinimax(player1)) {
        return -10 + depth;
    }
    
    if (checkWinnerForMinimax(player2)) {
        return 10 - depth;
    }
    
    if (isBoardFull()) {
        return 0;
    }
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = player2;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = player1;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}

// Helper function to check winner for minimax
function checkWinnerForMinimax(player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

// Helper function to check if board is full (for minimax)
function isBoardFull() {
    return board.every(cell => cell !== '');
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
                const cells = document.getElementsByClassName('cell');
                condition.forEach(index => {
                    cells[index].classList.add('winning-cell');
                });
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
        cell.classList.remove('winning-cell');
    }
    updateScore();
    updateTurnText();
}

window.onload = function() {
    startGame();
    updateScore();
    document.getElementById('difficulty-select').addEventListener('change', changeDifficulty);
};