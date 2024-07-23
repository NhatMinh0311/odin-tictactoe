const gameBoard = function() {
    let boardArray = [];

    const mark = function(index, sign) {
        if(!boardArray[index]) {
            boardArray[index] = sign;
            return true;
        };
        return false;
    }

    const update = function() {
        return boardArray;
    }

    const reset = function() {
        boardArray = [];
    }

    const render = function (){
        for (let i = 0; i < 9; i++) {
            const square = document.querySelector(`#sq${i}`);
            square.textContent = boardArray[i];
        }
    }
    return {mark, update, render, reset};
}();

function Player(name, sign) {
    this.name = name;
    this.sign = sign;
    this.changeName = function (newName) {
        if (newName !== "") {
            this.name = newName;
        }
    }
}

const player1 = new Player("Player1", "X");
const player2 = new Player("Player2", "O");

const display = function() {
    const {render} = gameBoard;
    const p = document.querySelector("p");
    const displayResult = function(result) {
        p.innerText = result;
    }
    const displayTurn = function(turn){
        if (turn % 2) {
            p.innerText = `${player1.name}'s turn.`;  
        }
        else {
            p.innerText = `${player2.name}'s turn.`; 
        }
    }
    return {render, displayResult, displayTurn};
}();

const game = function() {
    let turn = 1;
    let gameEnd = false;
    display.displayTurn(turn);
    const playTurn = function(index) {
        if (gameEnd) return;
        if (turn % 2) {
            if (!gameBoard.mark(index, player1.sign)) return;
        }
        else {
            if (!gameBoard.mark(index, player2.sign)) return;
        }
        turn++;
        const winnerSign = checkResult();
        if (turn === 10 || winnerSign) gameEnd = true;
        if (gameEnd) {
            printResult(winnerSign);
        }
        else {
            display.displayTurn(turn);
        }
    }

    const checkResult = function() {
        const boardArray = gameBoard.update();
        // Check rows
        for (let i = 0; i < 9; i+=3) {
            if (boardArray[i] && boardArray[i] === boardArray[i + 1] && boardArray[i] === boardArray[i + 2]) {
                return boardArray[i];
            }
        }
        // Check columns
        for (let i = 0; i < 3; i++) {
            if (boardArray[i] && boardArray[i] === boardArray[i + 3] && boardArray[i] === boardArray[i + 6]) {
                return boardArray[i];
            }
        }
        // Check
        if (boardArray[0] && boardArray[0] === boardArray[4] && boardArray[0] === boardArray[8]) {
            return boardArray[0];
        }
        if (boardArray[2] && boardArray[2] === boardArray[4] && boardArray[2] === boardArray[6]) {
            return boardArray[2];
        }
        return undefined;
    }
    
    const printResult = function(winnerSign){
        let result;
        if (winnerSign) {
            if (winnerSign === player1.sign) {
                result = `${player1.name.toUpperCase()} WON!`;
            }
            else {
                result = `${player2.name.toUpperCase()} WON!`;
            }
        }
        else {
            result = "TIE!";
        }
        display.displayResult(result);
    }

    const reset = function() {
        turn = 1;
        gameEnd = false;
    }
    return {playTurn, reset};
}();

const board = document.querySelector("#board");
board.addEventListener('click', (event) => {
    const index = +event.target.id[2];
    if (index >= 0 && index <= 8) {
        game.playTurn(index);
        display.render();
    }
});

const button = document.querySelector("button");
button.addEventListener("click", ()=> {
    gameBoard.reset();
    game.reset();
    display.render();
    display.displayResult("");
})

const player1Name = document.querySelector("#name1");
const player2Name = document.querySelector("#name2");

player1Name.addEventListener("change", () =>  {
    player1.changeName(player1Name.value);
});

player2Name.addEventListener("change", () =>  {
    player2.changeName(player2Name.value);
});


