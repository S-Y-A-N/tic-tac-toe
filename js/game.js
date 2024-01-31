// Gameboard module
const gameboard = (function () {
    const board = [];

    const clearBoard = () => {
        for (let i = 0; i < 3; i++) {
            board[i] = [];
            for (let j = 0; j < 3; j++) {
              board[i].push(0);
            }
        }
    };

    // initialize the board to 0's (initial state)
    clearBoard();

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

    return { getBoard, updateBoard, printBoard, clearBoard, checkWin };
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

// TODO displayController: organize code!!!!!!!!!!!!!
const displayController = (function () {
    const contentX = 'X'
    const contentO = 'O'
    const form = document.querySelector('form')
    const submit = form.querySelector('button')
    const grid = document.querySelector('.grid')
    let playerOne, playerTwo, game, activePlayer;

    // Change Turn Text
    const turnDiv = document.querySelector('.turn')

    function handleTurn() {
        turnDiv.classList.remove('hidden')
        turnDiv.textContent = `${activePlayer.getName()}'s Turn!`
    }

    // Handle End of Game
    const winnerDiv = document.querySelector('.winner')
    const restart = document.getElementById('restart')
    const reset = document.getElementById('reset')

    // TODO -- HANDLE RESTART
    function clear() {
        console.log('clearing...')
        buttons.forEach(button => button.textContent = '');
        turnDiv.textContent = ''
        winnerDiv.textContent = ''

        restart.classList.add('hidden')
        reset.classList.add('hidden')
        winnerDiv.classList.add('hidden')
        gameboard.clearBoard()
    }

    // Restart (with same players names)
    function handleRestart() {
        clear()
        handleSubmit()
    }

    // Restart (with same players names)
    function handleReset() {
        clear()
        playerOneName = undefined;
        playerTwoName = undefined;
        document.getElementById('playerOne').value = ''
        document.getElementById('playerTwo').value = ''
        grid.classList.add('hidden')
        form.classList.remove('hidden')
    }

    function handleEndOfGame() {
        winnerDiv.classList.remove('hidden')
        turnDiv.classList.add('hidden')
        restart.classList.remove('hidden')
        reset.classList.remove('hidden')
        restart.addEventListener('click', handleRestart)
        reset.addEventListener('click', handleReset)

        if (game.getWinner() != '')
            winnerDiv.textContent = `${game.getWinner()} Wins!`
        else
            winnerDiv.textContent = `It's a tie! a draw! a win and a loss ~`
    }

    // Form
    const buttons = document.querySelectorAll('.grid > button');
    let playerOneName, playerTwoName;
    function handleSubmit() {
        console.log(!playerOneName)
        if (playerOneName != undefined && playerTwoName != undefined) {
            // When replaying same game
            console.log('here')
         } else {
            playerOneName = document.getElementById('playerOne').value
            playerTwoName = document.getElementById('playerTwo').value
        }

        if (playerOneName == '' || playerTwoName == '') return;

        playerOne = createPlayer(playerOneName, 1);
        playerTwo = createPlayer(playerTwoName, 2);
        game = gameController(playerOne, playerTwo);

        console.log(`${gameboard.printBoard()}`)

        activePlayer = game.getActivePlayer();
        form.classList.add('hidden');
        grid.classList.remove('hidden');
        handleTurn();
    }

    submit.addEventListener('click', handleSubmit);

    // Grid
    function handleGame(e) {
        if(!game.getEndOfGame() || e.target.textContent != '') {
            const [x, y] = e.target.getAttribute('data-index').split(" ");
            activePlayer = game.getActivePlayer();
            const token = activePlayer.getToken() == 1 ? contentX : contentO;
            e.target.textContent = token
            game.playRound(x, y);
            activePlayer = game.getActivePlayer();
            handleTurn();
            if(game.getEndOfGame()) handleEndOfGame();
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', handleGame)
    });

})();