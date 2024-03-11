class ChessGame {
    constructor() {
        this.initialize_board();
        this.current_player = 'White';
        this.flags = [['e1', 'White', 0], ['e8', 'Black', 0]];
        this.base = [['d1', 'White', 0], ['d8', 'Black', 0]];
        this.piece = ' ';
        this.piece_id = ' ';
        this.select = null;
        this.print_board();
        const cells = document.querySelectorAll('#chessboard td');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                this.validate_move(cell)
            });
        });
    }

    validate_move(cell) {
        const end = this.convert_position(cell.id);
        if (this.select == cell.id) {
            cell.classList.toggle("selected");
            this.select = null
        }
        else if (this.select == null) {
            this.select = cell.id
            cell.classList.toggle("selected");
        }
        else if (this.select != null) {
            const std = document.getElementById(this.select);
            this.piece = std.textContent;
            var pos = this.convert_position(std.id)
            var pos_to = this.convert_position(cell.id)
            console.log(pos)
            console.log(pos_to)
            console.log(this.board)
            console.log(this.select)
            console.log(this.board[pos_to[0]][pos_to[1]])
            // console.log(this.is_valid_move(this.board[pos[0]][pos[1]][1], pos[0], pos[1], pos_to[0], pos_to[1]))
            if (this.is_valid_move(this.board[pos[0]][pos[1]][1], pos[0], pos[1], pos_to[0], pos_to[1])) {
                this.move_piece(this.piece, pos[0], pos[1], pos_to[0], pos_to[1])
            }
            document.getElementById(this.select).classList.toggle("selected");
            this.select = null;
        }
    }
    
    initialize_board() {
        this.board = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));

        this.board[7] = [['♖', 'R', 'Black', 0], ['♘', 'N', 'Black', 0], ['♗', 'B', 'Black', 0], ['🎯', 'C', 'Black', 0], ['🏴', 'K', 'Black', 0], ['♗', 'B', 'Black', 0], ['♘', 'N', 'Black', 0], ['♖', 'R', 'Black', 0]];
        this.board[6] = [['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0]];

        this.board[0] = [['♜', 'r', 'White', 0], ['♞', 'n', 'White', 0], ['♝', 'b', 'White', 0], ['🎯', 'c', 'White', 0], ['🏳️', 'k', 'White', 0], ['♝', 'b', 'White', 0], ['♞', 'n', 'White', 0], ['♜', 'r', 'White', 0]];
        this.board[1] = [['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0]];

    }

    print_board() {
        let table = document.createElement('table');
        table.setAttribute('border', '1');

        for (let row = 7; row >= 0; row--) {
            let tr = document.createElement('tr');
            for (let col = 7; col >= 0; col--) {
                let td = document.createElement('td');
                if (this.board[row][col] === undefined) {
                    this.board[row][col] = ['.', '.', '.', 0]
                }
                let pieceSymbol = this.board[row][col] ? this.board[row][col][0] : ' ';
                td.textContent = pieceSymbol;
                td.id = `${String.fromCharCode(row + 'a'.charCodeAt())}` + `${col}`;
                td.classList.add('start');
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        document.getElementById("chessboard").appendChild(table);
    }

    capture_piece(row, col, moving_piece) {
        if (this.board[row][col] !== null) {
            this.board[row][col] = null;
        }
    }

    move_piece(piece, start_row, start_col, end_row, end_col) {
        console.log(end_row);
        console.log(String.fromCharCode(`${end_row + 'a'.charCodeAt()}`) + `${(7 + end_col) % 8}`);
        document.getElementById(String.fromCharCode(`${7 - end_row + 'a'.charCodeAt()}`) + `${7 - end_col}`).textContent = piece;
        document.getElementById(this.select).textContent = ' ';
    }

    convert_position(position) {
        const col = Math.abs(7 - parseInt(position[1]));
        const row = 7 - Math.abs(position.charCodeAt(0) - 'a'.charCodeAt(0));
        return [row, col];
    }

    is_valid_move(piece, start_row, start_col, end_row, end_col) {
        // Check for obstruction in the path
        if (piece === 'R' || piece === 'r' || piece === 'Q' || piece === 'q') {
            if (start_row === end_row) { // Horizontal move
                const delta_col = end_col > start_col ? 1 : -1;
                for (let col = start_col + delta_col; col !== end_col; col += delta_col) {
                    if (this.board[start_row][col] === null) {
                        this.board[start_row][col] = ['.', '.', '.'];
                    } else if (this.board[start_row][col][2] === this.board[start_row][start_col][2]) {
                        return false; // Obstruction found
                    } else if (end_col !== col && this.board[end_row][col][2] !== this.board[start_row][start_col][2]) {
                        return false; // Obstruction found
                    } else if (end_col === col && this.board[end_row][col][2] !== this.board[start_row][start_col][2]) {
                        return true; // Obstruction found
                    }
                }
                return true;
            } else if (start_col === end_col) { // Vertical move
                const delta_row = end_row > start_row ? 1 : -1;
                for (let row = start_row + delta_row; row !== end_row; row += delta_row) {
                    if (this.board[row][start_col] === null) {
                        this.board[row][start_col] = ['.', '.', '.'];
                    } else if (this.board[row][start_col][2] === this.board[start_row][start_col][2]) {
                        return false; // Obstruction found
                    } else if (end_row !== row && this.board[row][start_col][2] !== this.board[start_row][start_col][2]) {
                        return false; // Obstruction found
                    } else if (end_row === row && this.board[row][start_col][2] !== this.board[start_row][start_col][2]) {
                        return true; // Obstruction found
                    }
                }
                return true;
            }
        }

        // Other piece-specific move validations
        if (piece === 'N' || piece === 'n') { // Knight
            const delta_row = Math.abs(end_row - start_row);
            const delta_col = Math.abs(end_col - start_col);
            console.log("*" + delta_col + " " + delta_row)
            if (delta_row == 2 && delta_col == 1)
                return true;
            else if (delta_row == 1 && delta_col == 2)
                return true
            else if (delta_row == 1 && delta_col >= 6)
                return true
            else if (delta_row >= 6 && delta_col == 1)
                return true
            else
                return false
        } else if (piece === 'P' || piece === 'p' || piece === 'K' || piece === 'k') { // Pawn or King
            // Check for edge cases
            if ((start_row === 0 && end_row === 7 && start_col === end_col) ||
                (start_row === 7 && end_row === 0 && start_col === end_col) ||
                (start_col === 0 && end_col === 7 && start_row === end_row) ||
                (start_col === 7 && end_col === 0 && start_row === end_row)) {
                return false;
            }
        } else if (piece === 'P' || piece === 'p') { // Pawn
            // Pawn specific move validations
            if (start_row === 1 && start_col === end_col && end_row - start_row === 2) {
                return true;
            }
            if (start_col === end_col && end_row - start_row === 1) {
                return true;
            }
            if (this.board[end_row][end_col] !== null && this.board[start_row][start_col][2] !== this.board[end_row][end_col][2] && Math.abs(start_col - end_col) === 1 && end_row - start_row === 1) {
                return true;
            }
            return false;
        } else if (piece === 'R' || piece === 'r') { // Rook
            // Rook moves horizontally or vertically
            return start_row === end_row || start_col === end_col;
        } else if (piece === 'B' || piece === 'b') { // Bishop
            // Bishop moves diagonally
            return Math.abs(end_row - start_row) === Math.abs(end_col - start_col);
        } else if (piece === 'Q' || piece === 'q') { // Queen
            // Queen combines rook and bishop moves
            return (start_row === end_row || start_col === end_col) || (Math.abs(end_row - start_row) === Math.abs(end_col - start_col));
        } else if (piece === 'K' || piece === 'k') { // King
            // King moves one square in any direction
            const str_temp = String.fromCharCode(end_col + 'a'.charCodeAt(0)) + end_row;
            if (this.board[end_row][end_col][2] === 'White') {
                this.flags[0][0] = str_temp;
            } else if (this.board[end_row][end_col][2] === 'Black') {
                this.flags[1][0] = str_temp;
            }
            return Math.abs(end_row - start_row) <= 1 && Math.abs(end_col - start_col) <= 1;
        } else {
            return false; // Default: invalid move
        }
        return true;
    }

    is_check(piece, start_row, start_col, flags_row, flags_col) {
        if (!(0 <= start_row < 8 && 0 <= start_col < 8 && 0 <= flags_row < 8 && 0 <= flags_col < 8)) {
            return false;
        }

        if (this.board[start_row][start_col] === null) {
            return false;
        }

        if (piece === 'R' || piece === 'r' || piece === 'Q' || piece === 'q') { // Rook or Queen
            if (start_row === flags_row) { // Horizontal move
                for (let i = 0; i < 8; i++) {
                    if (this.board[start_row][i] === null) {
                        this.board[start_row][i] = ['.', '.', '.'];
                    }
                    if (this.board[start_row][i][2] !== this.board[start_row][i][2] && this.board[start_row][i][1].toLowerCase() !== 'k') {
                        return false;
                    }
                    if (this.board[start_row][i][2] !== this.board[start_row][i][2] && this.board[start_row][i][1].toLowerCase() === 'k') {
                        return true;
                    }
                }
            } else if (start_col === flags_col) { // Vertical move
                for (let i = 0; i < 8; i++) {
                    if (this.board[i][start_col] === null) {
                        this.board[i][start_col] = ['.', '.', '.'];
                    }
                    if (this.board[i][start_col][2] !== this.board[start_row][start_col][2] && this.board[i][start_col][1].toLowerCase() !== 'k') {
                        return false;
                    }
                    if (this.board[i][start_col][2] !== this.board[start_row][start_col][2] && this.board[i][start_col][1].toLowerCase() === 'k') {
                        return true;
                    }
                }
            }
        }

        if (piece === 'B' || piece === 'b' || piece === 'Q' || piece === 'q') { // Bishop or Queen
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (j === i) {
                        if (this.board[i][j] === null) {
                            this.board[i][j] = ['.', '.', '.'];
                        }
                        if (this.board[i][j][2] === this.board[start_row][start_col][2]) {
                            break;
                        }
                        if (this.board[i][j][2] !== this.board[start_row][start_col][2] && this.board[i][j][1].toLowerCase() !== 'k') {
                            break;
                        }
                        if (this.board[i][j][2] !== this.board[start_row][start_col][2] && this.board[i][j][1].toLowerCase() === 'k') {
                            return true;
                        }
                    }
                }
            }
        }

        if (piece === 'N' || piece === 'n') { // Knight
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    const delta_row = Math.abs(i - start_row);
                    const delta_col = Math.abs(j - start_col);
                    if ((delta_row === 1 && delta_col === 2) || (delta_row === 2 && delta_col === 1)) {
                        if (this.board[i][j] === null) {
                            this.board[i][j] = ['.', '.', '.'];
                        }
                        if (this.board[i][j][2] !== this.board[start_row][start_col][2] && this.board[i][j][1].toLowerCase() === 'k') {
                            return true;
                        }
                    }
                }
            }
        }
    }
}