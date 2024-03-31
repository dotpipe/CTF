class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'White';
        this.flags = [['e1', 'White', 0], ['e8', 'Black', 0]];
        this.base = [['d1', 'White', 0], ['d8', 'Black', 0]];
        this.activePiece = null;
        this.initializeChessboard();
    }

    initializeBoard() {
        let board = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));

        // Set up initial positions of pieces
        board[0] = [['♖', 'R', 'Black', 0], ['♘', 'N', 'Black', 0], ['♗', 'B', 'Black', 0], ['♕', 'Q', 'Black', 0], ['♔', 'K', 'Black', 0], ['♗', 'B', 'Black', 0], ['♘', 'N', 'Black', 0], ['♖', 'R', 'Black', 0]];
        board[1] = Array.from({ length: 8 }, () => ['♙', 'P', 'Black', 0]);
        board[6] = Array.from({ length: 8 }, () => ['♟', 'P', 'White', 0]);
        board[7] = [['♜', 'R', 'White', 0], ['♞', 'N', 'White', 0], ['♝', 'B', 'White', 0], ['♛', 'Q', 'White', 0], ['♚', 'K', 'White', 0], ['♝', 'B', 'White', 0], ['♞', 'N', 'White', 0], ['♜', 'R', 'White', 0]];

        return board;
    }

    initializeChessboard() {
        const board = document.createElement('table');
        board.classList.add('chessboard');
        board.id = 'chessboard';

        for (let row = 0; row < 8; row++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < 8; col++) {
                const td = document.createElement('td');
                td.id = `${row}-${col}`;
                td.textContent = this.board[row][col] ? this.board[row][col][0] : '';
                td.addEventListener('click', () => this.handleCellClick(row, col));
                tr.appendChild(td);
            }
            board.appendChild(tr);
        }

        document.body.appendChild(board);
    }


    printBoard() {
        const orangeBg = '\x1b[48;5;208m';  // Orange background
        const redBg = '\x1b[48;5;196m';     // Red background
        const resetColor = '\x1b[0m';        // Reset color

        console.log("  +------------------------ A +");
        for (let row = 0; row < 8; row++) {
            let rowDisplay = `${8 - row} |`;
            for (let col = 0; col < 8; col++) {
                let pieceSymbol = this.board[row][col] !== null ? this.board[row][col][0] : ' .';

                if ((row + col) % 2 === 0) {
                    if (this.board[row][col] === null) {
                        rowDisplay += `${orangeBg}${pieceSymbol} ${resetColor}`;
                        this.board[row][col] = ['.', '.', '.'];
                    } else if (this.board[row][col][1].toLowerCase() === 'k') {
                        rowDisplay += `${orangeBg}${pieceSymbol} ${resetColor}`;
                    } else {
                        rowDisplay += `${orangeBg} ${pieceSymbol} ${resetColor}`;
                    }
                } else {
                    if (this.board[row][col] === null) {
                        rowDisplay += `${redBg}${pieceSymbol} ${resetColor}`;
                        this.board[row][col] = ['.', '.', '.'];
                    } else if (this.board[row][col][1].toLowerCase() === 'k') {
                        rowDisplay += `${redBg}${pieceSymbol} ${resetColor}`;
                    } else {
                        rowDisplay += `${redBg} ${pieceSymbol} ${resetColor}`;
                    }
                }
            }
            rowDisplay += "|";
            console.log(rowDisplay);
        }
        console.log("  +------------------------ a +");
    }

    movePiece(piece, startRow, startCol, endRow, endCol) {
        if (this.board[startRow][startCol][1] === piece) {
            this.board[endRow][endCol] = this.board[startRow][startCol];
            this.board[startRow][startCol] = ['.', '.', '.'];
        }
    }

    convertPosition(position) {
        let row = 8 - parseInt(position[1]);
        let col = position.charCodeAt(0) - 'a'.charCodeAt(0);
        return [row, col];
    }

    isValidMove(piece, startRow, startCol, endRow, endCol) {
        if (!(0 <= startRow < 8 && 0 <= startCol < 8 && 0 <= endRow < 8 && 0 <= endCol < 8)) {
            return false;
        }

        if (this.board[startRow][startCol] === null) {
            return false;
        }

        // Check for obstruction in the path
        if (['R', 'r', 'Q', 'q'].includes(piece)) {
            // Rook or Queen
            if (startRow === endRow) {  // Horizontal move
                let deltaCol = endCol > startCol ? 1 : -1;
                for (let col = startCol + deltaCol; col !== endCol; col += deltaCol) {
                    if (this.board[startRow][col] === null) {
                        this.board[startRow][col] = ['.', '.', '.'];
                    } else if (this.board[startRow][col][2] === this.board[startRow][startCol][2]) {
                        return false;  // Obstruction found
                    } else if (endCol !== col && this.board[endRow][col][2] !== this.board[startRow][startCol][2]) {
                        return false;  // Obstruction found
                    } else if (endCol === col && this.board[endRow][col][2] !== this.board[startRow][startCol][2]) {
                        return true;  // Obstruction found
                    }
                }
                return true;
            } else if (startCol === endCol) {  // Vertical move
                let deltaRow = endRow > startRow ? 1 : -1;
                for (let row = startRow + deltaRow; row !== endRow; row += deltaRow) {
                    if (this.board[row][startCol] === null) {
                        this.board[row][startCol] = ['.', '.', '.'];
                    } else if (this.board[row][startCol][2] === this.board[startRow][startCol][2]) {
                        return false;  // Obstruction found
                    } else if (endRow !== row && this.board[row][startCol][2] !== this.board[startRow][startCol][2]) {
                        return false;  // Obstruction found
                    } else if (endRow === row && this.board[row][startCol][2] !== this.board[startRow][startCol][2]) {
                        return true;  // Obstruction found
                    }
                }
                return true;
            }
        }

        // Other piece-specific move validations
        // Implement the rest of the logic for other pieces if needed

        return true;  // Move is valid
    }

    isCheck(piece, startRow, startCol, flagsRow, flagsCol) {
        if (!(0 <= startRow < 8 && 0 <= startCol < 8 && 0 <= flagsRow < 8 && 0 <= flagsCol < 8)) {
            return false;
        }

        if (this.board[startRow][startCol] === null) {
            return false;
        }

        // Check for obstruction in the path
        if (['R', 'r', 'Q', 'q'].includes(piece)) {
            // Rook or Queen
            if (startRow === flagsRow) {  // Horizontal move
                for (let i = 0; i < 8; i++) {
                    if (this.board[startRow][i] === null) {
                        this.board[startRow][i] = ['.', '.', '.'];
                    }
                    if (this.board[startRow][i][2] !== this.board[startRow][i][2] && this.board[startRow][i][1].toLowerCase() !== 'k') {
                        return false;
                    }
                    if (this.board[startRow][i][2] !== this.board[startRow][i][2] && this.board[startRow][i][1].toLowerCase() === 'k') {
                        return true;
                    }
                }
            } else if (startCol === flagsCol) {  // Vertical move
                for (let i = 0; i < 8; i++) {
                    if (this.board[i][startCol] === null) {
                        this.board[i][startCol] = ['.', '.', '.'];
                    }
                    if (this.board[i][startCol][2] !== this.board[startRow][startCol][2] && this.board[i][startCol][1].toLowerCase() !== 'k') {
                        return false;
                    }
                    if (this.board[i][startCol][2] !== this.board[startRow][startCol][2] && this.board[i][startCol][1].toLowerCase() === 'k') {
                        return true;
                    }
                }
            }

            // Implement the rest of the logic for other pieces if needed

            return false;
        }
    }
    // let game = new ChessGame();
    // let currentPlayer = 'White'; // Initialize current player

    // initializeChessboard() {
    //     const board = document.createElement('table');
    //     board.classList.add('chessboard');
    //     board.id = 'chessboard';

    //     for (let row = 0; row < 8; row++) {
    //         const tr = document.createElement('tr');
    //         for (let col = 0; col < 8; col++) {
    //             const td = document.createElement('td');
    //             td.id = `${row}-${col}`;
    //             td.textContent = this.board[row][col] ? this.board[row][col][0] : '';
    //             td.addEventListener('click', () => this.handleCellClick(row, col));
    //             tr.appendChild(td);
    //         }
    //         board.appendChild(tr);
    //     }

    //     document.body.appendChild(board);
    // }

    handleCellClick(row, col) {
        const cell = document.getElementById(`${row}-${col}`);

        if (this.activePiece === null) {
            // No active piece, highlight the clicked cell if it's a valid piece
            if (this.board[row][col] !== null && this.board[row][col][2] === this.currentPlayer) {
                this.activePiece = { row, col };
                cell.classList.add('active');
            }
        } else {
            // Handle movement logic here
            if (this.isValidMove(this.board[this.activePiece.row][this.activePiece.col][1], this.activePiece.row, this.activePiece.col, row, col)) {
                // Move is valid, perform the move logic here
                if (this.isCheck(this.board[this.activePiece.row][this.activePiece.col][1], this.activePiece.row, this.activePiece.col, row, col)) {
                    console.log("Check!");
                }

                this.movePiece(this.board[this.activePiece.row][this.activePiece.col][1], this.activePiece.row, this.activePiece.col, row, col);

                let offset = this.currentPlayer !== 'White' ? 1 : 0;
                let [kingRow, kingCol] = this.convertPosition(this.flags[offset][0]);

                if (this.isCheck(this.board[this.activePiece.row][this.activePiece.col][1], row, col, kingRow, kingCol)) {
                    console.log("Check!");
                }

                this.currentPlayer = this.currentPlayer === 'White' ? 'Black' : 'White';
            } else {
                console.log("Invalid Move!");
            }

            // Reset activePiece and update board state
            this.activePiece = null;
            this.printBoard(); // Function to update the visual representation of the board
        }
    }
}


// Instantiate the ChessGame object to start the game
const game = new ChessGame();
