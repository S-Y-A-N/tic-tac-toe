// Gameboard module
const gameboard = (function () {
    const board = [];

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
          board[i].push(0);
        }
    }

    const getBoard = () => board;

    const updateBoard = (token, x, y) => {
        if (board[x][y] === 0) {
            board[x][y] = token;
            return true;
        } else return false;
    }

    const printBoard = () => {
        for (let i = 0; i < 3; i++) {
            console.log(`${board[i]}`)
        }
    }

    const checkRows = () => {
        for (let i = 0; i < 3; i++) {
            if (board[i][0] == board[i][1] && 
                board[i][1] == board[i][2] &&
                board[i][0] != 0)
                return board[i][0];
        }
        return null;
    }

    const checkColumns = () => {
        for (let i = 0; i < 3; i++) {
            if (board[0][i] == board[1][i] &&
                board[1][i] == board[2][i] &&
                board[0][i] != 0)
                return board[0][i];
        }
        return null;
    }

    const checkDiagonal = () => {
        // Main Diagonal
        if (board[0][0] == board[1][1] &&
            board[1][1] == board[2][2] &&
            board[0][0] != 0)
            return board[0][0];

        // Opposite Diagonal
        if (board[0][2] == board[1][1] &&
            board[1][1] == board[2][0] &&
            board[0][2] != 0)
            return board[0][2];

        return null;
    }


    const checkWin = () => {
        const row = checkRows();
        const column = checkColumns();
        const diagonal = checkDiagonal();

        if (row != null)           return row;
        else if (column != null)   return column;
        else if (diagonal != null) return diagonal;
        else                       return null;
    }

    return { getBoard, updateBoard, printBoard, checkWin };
})();

// Game module
function gameController(playerOne, playerTwo) {
    let activePlayer = playerOne;
    let endOfGame = false;
    let winner = '';
    let round = 0;
    const maxRounds = 9;
    

    const changeTurn = () => {
        activePlayer = activePlayer == playerOne ? playerTwo : playerOne;
    }

    const getActivePlayer = () => activePlayer;

    const getWinner = () => winner;

    const getEndOfGame = () => endOfGame;

    const playRound = (x, y) => {
        if (endOfGame) return;

        let isUpdated = gameboard.updateBoard(activePlayer.getToken(), x, y)
        
        if (gameboard.checkWin() != null) {
            winner = activePlayer.getName()
            endOfGame = true;
            return;
        }

        if (isUpdated && !endOfGame) {
            changeTurn();
            round++;
        }

        if (round == maxRounds) endOfGame = true;
    }

    return { getActivePlayer, playRound, getWinner, getEndOfGame }
}

// Player factory function
function createPlayer(name, token) {
    this.name = name;
    this.token = token;

    const getName = () => name;
    const getToken = () => token;
    
    return { getName, getToken };
}

// TODO displayController: organize code, handleRestart, handleReset
const displayController = () => {
    const contentX = 'X'
    const contentO = 'O'
    const form = document.querySelector('form')
    const submit = form.querySelector('button')
    const grid = document.querySelector('.grid')
    let playerOne, playerTwo, game, activePlayer;

    const handleSubmit = (e) => {
        let playerOneName = document.getElementById('playerOne').value
        let playerTwoName = document.getElementById('playerTwo').value
        if (!playerOneName || !playerTwoName) return;
        playerOne = createPlayer(playerOneName, 1);
        playerTwo = createPlayer(playerTwoName, 2);
        game = gameController(playerOne, playerTwo);
        activePlayer = game.getActivePlayer();
        form.classList.add('hidden');
        grid.classList.remove('hidden');
        handleTurn();
    }

    submit.addEventListener('click', handleSubmit);
    

    // Grid
    const buttons = document.querySelectorAll('.grid button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if(!game.getEndOfGame()) {
                const [x, y] = button.getAttribute('data-index').split(" ");
                activePlayer = game.getActivePlayer();
                const token = activePlayer.getToken() == 1 ? contentX : contentO;
                button.textContent = token
                game.playRound(x, y);
                activePlayer = game.getActivePlayer();
                handleTurn();
                if(game.getEndOfGame()) handleEndOfGame();
            }
        });
    });

    const turnDiv = document.querySelector('.turn')
    const handleTurn = () => {
        turnDiv.textContent = `${activePlayer.getName()}'s Turn!`
    }

    const winnerDiv = document.querySelector('.winner')
    const handleEndOfGame = () => {
        turnDiv.classList.add('hidden')
        winnerDiv.textContent = `${game.getWinner()} Wins!`
    }
}

displayController();