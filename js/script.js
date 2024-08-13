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
    return {getScore, giveScore, getName, getId};
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
    let p1_name = "a";
    let p2_name = "b";
    let Player1 = Player(p1_name, 1);
    let Player2 = Player(p2_name, 2);
    let Players = [Player1, Player2]
    let activePlayer = Players[0];
    let turns = 0;

    const getActivePlayer = () => { return activePlayer; }
    const switchActivePlayer = () => { activePlayer = activePlayer === Players[0] ? Players[1] : Players[0]; }

    const playRound = (row, col) => {
        let winner = 0;
        let success = Gameboard.placeMarker(getActivePlayer().getId(), row, col);
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
    
    return {getActivePlayer, playRound};
})();


const ScreenController = (function(){
    const turnDiv = document.querySelector(".player-turn");
    const boardDiv = document.querySelector(".board");
    


    const updateScreen = (winner=0) => {
        if (winner === 1 || winner === 2){
            alert(`${GameController.getActivePlayer().getId()} wins!`);
            GameController.getActivePlayer().giveScore();
            Gameboard.resetBoard();
        }

        if (winner === 3){
            alert("Match Tied!");
            Gameboard.resetBoard();
        }
        
        const board = Gameboard.getBoard();
        const activePlayer = GameController.getActivePlayer().getId();

        turnDiv.textContent = `${activePlayer}'s Turn`;
        boardDiv.textContent = "";
        
        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                const cellBtn = document.createElement("button");
                cellBtn.classList.add("cell");
                cellBtn.textContent = cell.getVal() === 0 ? "" : (cell.getVal() === 1 ? "X" : "O");
                cellBtn.dataset.row = i;
                cellBtn.dataset.col = j;
                
                cellBtn.addEventListener("click", (e) => {
                    const row = e.target.dataset.row;
                    const col = e.target.dataset.col;
                    let winner = GameController.playRound(row, col);
                    updateScreen(winner);
                });

                boardDiv.appendChild(cellBtn);    
            })
        })
    }

    // initial display
    updateScreen();
})();