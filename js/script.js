function Square(){
    let val = 0;

    const getVal = () => {return val;}

    const setVal = id => {
        val = id;
    }

    return {getVal, setVal};
}

function Player(){
    let name = w;
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
        }
        else {
            console.log("invalid placement");
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

        if (win){
            console.log(`Player ${winner} wins!`);
        }

        return win;
    }

    return {getBoard, printBoard, placeMarker, checkWinner};
})();

Gameboard.placeMarker(2, 0, 0);
Gameboard.printBoard();
Gameboard.checkWinner();
Gameboard.placeMarker(2, 0, 1);
Gameboard.printBoard();
Gameboard.checkWinner();
Gameboard.placeMarker(2, 0, 2);
Gameboard.printBoard();
Gameboard.checkWinner();