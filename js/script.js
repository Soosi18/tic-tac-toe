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

    const placeMarker = (id, row, col) => {
        if (board[row][col].getVal() === 0){
            board[row][col].setVal(id);
            console.log(`Player ${id}'s move placed on row ${row} column ${col}`);
            return 1;
        }
        else {
            console.log("Invalid placement. Try Again!");
            return 0;
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

        //if (win){
        //    console.log(`Player ${winner} wins!`);
        //}

        return win;
    }

    return {getBoard, printBoard, placeMarker, checkWinner};
})();


const GameController = (function(){
    let p1_name = prompt("Enter Name for Player 1");
    let p2_name = prompt("Enter name for Player 2");
    let Player1 = Player(p1_name, 1);
    let Player2 = Player(p2_name, 2);
    let Players = [Player1, Player2]
    let activePlayer = Players[0];
    let turns = 0;

    const getActivePlayerId = () => { return activePlayer.getId(); }
    const switchActivePlayer = () => { activePlayer = activePlayer === Players[0] ? Players[1] : Players[0]; }
    
    const playMove = () => {
        let success = false;
        do{
            let row = prompt(`${activePlayer.getName()}, which row would you like to play in?`);
            let col = prompt(`${activePlayer.getName()}, which column would you like to play in?`);
            success = Gameboard.placeMarker(getActivePlayerId(), row, col);
        }
        while (!success)
        turns++;
    }

    const playRound = () => {
        playMove();
        Gameboard.printBoard();
        let win = Gameboard.checkWinner();
        if(win){
            console.log(`${activePlayer.getName()} Wins!`);
        }
        else if (turns === 9){
            console.log("Match Tied!");
        }
        switchActivePlayer();
        return win;
    }

    const playGame = () => {
        let win = false;
        Gameboard.printBoard();
        while(!win){
            win = playRound();
        }
    }
    
    return {getActivePlayerId, playGame};
})();


GameController.playGame();