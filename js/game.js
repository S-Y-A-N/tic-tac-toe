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
        console.log('row!')
        for (let i = 0; i < 3; i++) {
            if (board[i][0] == board[i][1] && 
                board[i][1] == board[i][2] &&
                board[i][0] != 0)
                return board[i][0];
        }

        console.log('null row')
        return null;
    }

    const checkColumns = () => {
        console.log('column!')
        for (let i = 0; i < 3; i++) {
            if (board[0][i] == board[1][i] &&
                board[1][i] == board[2][i] &&
                board[0][i] != 0)
                return board[0][i];
        }
        console.log('null column')
        return null;
    }

    const checkDiagonal = () => {

        console.log('diagonal first!')
        // Main Diagonal
        if (board[0][0] == board[1][1] &&
            board[1][1] == board[2][2] &&
            board[0][0] != 0)
            return board[0][0];

            console.log('diagonal second!')
        // Opposite Diagonal
        if (board[0][2] == board[1][1] &&
            board[1][1] == board[2][0] &&
            board[0][2] != 0)
            return board[0][2];

        console.log('null diagonal')
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
const game = (function () {
    const playerOne = createPlayer('First Player', 1)
    const playerTwo = createPlayer('Second Player', 2)

    let activePlayer = playerOne;
    let endOfGame = false;
    let winner = '';
    let round = 0;
    const maxRounds = 9;
    

    const changeTurn = () => {
        activePlayer = activePlayer == playerOne ? playerTwo : playerOne;
    }

    const startGame = () => {
        while(!endOfGame && round < maxRounds) {
            console.clear()
            gameboard.printBoard()
            const input = prompt('Choose a position (rows cols). Ex: "0 0" for cell one.');
            [x, y] = input.split(" ");
            let isUpdated = gameboard.updateBoard(activePlayer.getToken(), x, y)
            if (gameboard.checkWin() != null) {
                winner = activePlayer
                console.log(winner.getName());
                gameboard.printBoard()
                endOfGame = true;
            }
            if (isUpdated && !endOfGame) {
                changeTurn();
                round++;
            }
        }

        if (round == maxRounds) console.log('Tie!')
    }

    return { startGame }
})();

// Player factory function
function createPlayer(name, token) {
    this.name = name;
    this.token = token;

    const getName = () => name;
    const getToken = () => token;
    
    return { getName, getToken };
}

// Game initializer
function init() {
    // game.startGame()
}

init()