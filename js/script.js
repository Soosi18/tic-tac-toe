function Square(){
    let val = 0;

    const getVal = () => {return val;}

    const setVal = id => {
        val = id;
    }
    return {getVal, setVal};
}

function Player(name, id){
    name;
    id;
    let score = 0;
    
    const getScore = () => { return score; }

    const giveScore = () => { score++; }

    const getName = () => { return name; }

    const getId = () => { return id; }
    
    const resetScore = () => { score = 0; }

    return {getScore, giveScore, resetScore, getName, getId};
}

const Gameboard = (function(){
    let board = []
    for (let i = 0; i < 3; i++){
        board[i] = []
        for (let j = 0; j < 3; j++){
            board[i].push(Square());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        for (let i = 0; i < 3; i++){
            let row = "|";
            for (let j = 0; j < 3; j++){
                let val = board[i][j].getVal();
                row += (val === 0 ? " " : (val === 1 ? "X" : "O")) + "|";
            }
            console.log(row);
        }
    }

    const resetBoard = () => {
        board.map(row => row.map(cell => cell.setVal(0)));
    }

    const placeMarker = (id, row, col) => {
        if (board[row][col].getVal() === 0){
            board[row][col].setVal(id);
            console.log(`Player ${id}'s move placed on row ${row} column ${col}`);
            return true;
        }
        else {
            console.log("Invalid placement. Try Again!");
            return false;
        }
    }

    const checkWinner = () => {
        let win = false;
        let diag = [];
        let revDiag = [];
        let rowCondition, colCondition, diagCondition, revDiagCondition, winner;
        for (let i = 0; i < 3; i++){
            [rowCondition, winner] = [board[i].filter(sq => sq.getVal() === board[i][0].getVal() && board[i][0].getVal() !== 0).length === 3, board[i][0].getVal()];
            [colCondition, winner] = [board.map(row => row[i]).filter(sq => sq.getVal() === board[0][i].getVal() && board[0][i].getVal() !== 0).length === 3, board[0][i].getVal()];
            diag.push(board[i][i]);
            revDiag.push(board[i][2-i])

            if (rowCondition || colCondition){
                win = true;
                break;
            }
        }

        [diagCondition, winner] = [diag.filter(sq => sq.getVal() === diag[0].getVal() && diag[0].getVal() !== 0).length === 3, diag[0].getVal()];
        [revDiagCondition, winner] = [revDiag.filter(sq => sq.getVal() === revDiag[0].getVal() && revDiag[0].getVal() !== 0).length === 3, revDiag[0].getVal()];
        if (diagCondition || revDiagCondition){
            win = true;
        }
        return win;
    }

    return {getBoard, printBoard, resetBoard, placeMarker, checkWinner};
})();


const GameController = (function(){
    let Players = []
    let activePlayer;
    let turns = 0;

    const createPlayer = (name, id) => {
        Players.push(Player(name, id));
        if (Players.length === 1){
            activePlayer = Players[0];
        }
    }

    const getActivePlayer = () => { return activePlayer; }

    const getPlayers = () => { return Players; }

    const switchActivePlayer = () => { activePlayer = activePlayer === Players[0] ? Players[1] : Players[0]; }

    const playRound = (row, col) => {
        let winner = 0;
        Gameboard.placeMarker(getActivePlayer().getId(), row, col);
        turns++;
        let win = Gameboard.checkWinner();
        if(win){
            winner = getActivePlayer().getId();
            turns = 0;
            return winner;
        }
        else if (turns === 9){
            winner = 3;
            turns = 0;
            return winner;
        }
        switchActivePlayer();
        return winner;
    }

    const resetGame = () => {
        Gameboard.resetBoard();
        Players.forEach(player => player.resetScore());
    }
    
    return {createPlayer, getActivePlayer, getPlayers, playRound, resetGame};
})();


const ScreenController = (function(){
    const turnDiv = document.querySelector(".player-turn");
    const boardDiv = document.querySelector(".board");
    const scoreDiv = document.querySelector(".score");
    let toggleDivs = [turnDiv, scoreDiv];
    const submitBtn = document.querySelector("#submit-btn");
    const body = document.querySelector("body");
    const dialog = document.querySelector("#round-end");

    submitBtn.addEventListener("click", e => {
        e.preventDefault();
        const form = document.querySelector(".form-container");
        const nameData = new FormData(form);
        let nameOne = (nameData.get("p1-name") === "" ? "Player 1" : nameData.get("p1-name"));
        let nameTwo = (nameData.get("p2-name") === "" ? "Player 2" : nameData.get("p2-name"));
        GameController.createPlayer(nameOne, 1);
        GameController.createPlayer(nameTwo, 2);
        boardDiv.style.display = "grid";
        form.style.display = "none";
        updateScreen();
    });
    

    
    const updateScreen = (winner=0) => {
        let Players = GameController.getPlayers();
        let activePlayer = GameController.getActivePlayer();
        
        const board = Gameboard.getBoard();
        turnDiv.textContent = `${activePlayer.getName()}'s Turn`;
        boardDiv.textContent = "";
        scoreDiv.textContent = `${Players[0].getName()}'s Score: ${Players[0].getScore()}`
                                + `\n${Players[1].getName()}'s Score: ${Players[1].getScore()}`;
        
        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                const cellBtn = document.createElement("button");
                cellBtn.classList.add("cell");
                cellBtn.textContent = cell.getVal() === 0 ? "" : (cell.getVal() === 1 ? "X" : "O");
                cellBtn.dataset.row = i;
                cellBtn.dataset.col = j;
                
                if (winner === 0){
                    cellBtn.addEventListener("click", (e) => {
                        const row = e.target.dataset.row;
                        const col = e.target.dataset.col;
                        let winner = GameController.playRound(row, col)
                        updateScreen(winner);
                    });
                }
                

                boardDiv.appendChild(cellBtn);    
            })
        })

        if (winner === 1 || winner === 2){
            activePlayer.giveScore();
            body.style.backgroundColor = "rgba(0,0,0, 0.7)";
            toggleDivs.forEach(div => {
                div.style.display = "none";
            });
            if (activePlayer.getScore() === 5){
                dialog.firstChild.textContent = `${activePlayer.getName()} wins the game!`;
                GameController.resetGame();
            }
            else{
                dialog.firstChild.textContent = `${activePlayer.getName()} wins the round!`;
                Gameboard.resetBoard();
            }
            dialog.showModal();
            document.querySelector("#continue-btn").addEventListener("click", ()=>{
                dialog.close();
                body.style.backgroundColor = "white";
                toggleDivs.forEach(div => {
                    div.style.display = "grid";
                });
                updateScreen();
            });
        }
        if (winner === 3){
            turnDiv.textContent = "Match Tied!";
            Gameboard.resetBoard();
        }
    }
})();