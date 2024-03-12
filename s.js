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
        if (this.select == cell) {
            cell.classList.remove("selected");
            this.select = null;
            return;
        }
        else if (this.select == null) {
            this.select = cell
            cell.classList.add("selected");
        }
        else {
            var pos = this.convert_position(this.select.id)
            var pos_to = this.convert_position(cell.id)
            if (this.is_valid_move(this.board[pos[0]][pos[1]][1], pos[0], pos[1], pos_to[0], pos_to[1])) {
                this.move_piece(this.board[pos[0]][pos[1]][0], pos[0], pos[1], pos_to[0], pos_to[1])
            }
            else {
                document.getElementById(this.select.id).classList.remove("selected");
                this.select = null
            }
        }
    }

    initialize_board() {
        this.board = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));

        this.board[0] = [['♖', 'R', 'Black', 0], ['♘', 'N', 'Black', 0], ['♗', 'B', 'Black', 0], ['🎯', 'C', 'Black', 0], ['🏴', 'K', 'Black', 0], ['♗', 'B', 'Black', 0], ['♘', 'N', 'Black', 0], ['♖', 'R', 'Black', 0]];
        this.board[1] = [['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0]];

        this.board[5] = [[' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0]];
        this.board[4] = [[' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0]];
        this.board[3] = [[' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0]];
        this.board[2] = [[' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0], [' ', '.', '.', 0]];


        this.board[7] = [['♜', 'r', 'White', 0], ['♞', 'n', 'White', 0], ['♝', 'b', 'White', 0], ['🎯', 'c', 'White', 0], ['🏳️', 'k', 'White', 0], ['♝', 'b', 'White', 0], ['♞', 'n', 'White', 0], ['♜', 'r', 'White', 0]];
        this.board[6] = [['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0]];

    }

    print_board() {
        let table = document.createElement('table');
        table.setAttribute('border', '1');

        for (let row = 7; row >= 0; row--) {
            let tr = document.createElement('tr');
            for (let col = 7; col >= 0; col--) {
                let td = document.createElement('td');
                if (this.board[row][col] === undefined) {
                    this.board[row][col] = [' ', '.', '.', 0]
                }
                let pieceSymbol = this.board[row][col] ? this.board[row][col][0] : ' ';
                td.textContent = pieceSymbol;
                if (this.board[row][col][3] == 2) {
                    td.style.color = "blue!important"
                }
                if (this.board[row][col][3] == 1) {
                    td.style.color = "red!important"
                }
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

    restore_spot(end_row, end_col) {
        return String.fromCharCode(`${7 - end_row + 'a'.charCodeAt()}`) + `${7 - end_col}`;
    }

    move_piece(piece, start_row, start_col, end_row, end_col) {
        console.log(end_row);
        console.log(String.fromCharCode(`${end_row + 'a'.charCodeAt()}`) + `${(7 + end_col) % 8}`);
        document.getElementById(String.fromCharCode(`${7 - end_row + 'a'.charCodeAt()}`) + `${7 - end_col}`).textContent = piece;
        var base = document.getElementById(String.fromCharCode(`${7 - end_row + 'a'.charCodeAt()}`) + `${7 - end_col}`)
        if (this.board[end_row][end_col][1].toLowerCase() == 'c') {
            this.board[start_row][start_col][3] = (this.board[start_row][start_col][2] == this.board[end_row][end_col][2]) ? 1 : 2;
        }
        // [3] is 1 when own flag when being returned [3] is 2 when bringing back other teams
        if (base.id == 'a3' && this.board[start_row][start_col][3] == 2) {
            window.alert("White Wins!!")
            document.getElementById("chessboard").innerHTML = ""
            this.initialize_board();
            this.print_board()
        }
        else if (base.id == 'h3' && this.board[start_row][start_col][3] == 2) {
            window.alert("Black Wins!!")
            document.getElementById("chessboard").innerHTML = ""
            this.initialize_board();
            this.print_board()
        }
        else if (base.id == 'h3' && this.board[start_row][start_col][3] == 1) {
            window.alert("Black Home!!")
            document.getElementById(String.fromCharCode(`${7 - end_row + 'a'.charCodeAt()}`) + `${7 - end_col}`).textContent = ' ';
            document.getElementById('h3').textContent = '🎯'
            document.getElementById('h4').textContent = '🏳️'
        }
        else if (base.id == 'a3' && this.board[start_row][start_col][3] == 1) {
            window.alert("White Home!!")
            document.getElementById(String.fromCharCode(`${7 - end_row + 'a'.charCodeAt()}`) + `${7 - end_col}`).textContent = ' ';
            document.getElementById('a3').textContent = '🎯'
            document.getElementById('a4').textContent = '🏴'
        }
        else {
            this.board[end_row][end_col] = this.board[start_row][start_col];
            document.getElementById(this.select.id).textContent = ' ';
        }
        document.getElementById(this.select.id).classList.remove("selected");
        this.select = null
    }

    convert_position(position) {
        const col = Math.abs(7 - parseInt(position[1]));
        const row = 7 - Math.abs(position.charCodeAt(0) - 'a'.charCodeAt(0));
        return [row, col];
    }

    is_valid_move(piece, start_row, start_col, end_row, end_col) {
        if (piece.toLowerCase() == 'c' || piece.toLowerCase() == 'k')
            return false;
        // Check for obstruction in the path
        this.piece = piece
        if (this.piece === 'R' || this.piece === 'r') {
            if (start_row === end_row) { // Horizontal move
                const delta_col = end_col > start_col ? 1 : -1;
                for (let col = start_col + delta_col; col !== end_col; col += delta_col) {
                    if (this.board[start_row][col] === null) {
                        this.board[start_row][col] = [' ', '.', '.', 0];
                    }
                    if (this.board[start_row][col][1] !== '.') {
                        return false; // Obstruction found
                    }
                }
            } else if (start_col === end_col) { // Vertical move
                const delta_row = end_row > start_row ? 1 : -1;
                for (let row = start_row + delta_row; row !== end_row; row += delta_row) {
                    if (this.board[row][start_col] === null) {
                        this.board[row][start_col] = [' ', '.', '.', 0];
                    } 
                    if (this.board[row][start_col][1] !== '.') {
                        return false; // Obstruction found
                    }
                }
            }
            return true;
        }

        if (this.piece === 'P' || this.piece === 'p') { // Pawn or King
            // Check for edge cases
            if ((start_row === 0 && end_row === 7 && start_col === end_col) ||
                (start_row === 7 && end_row === 0 && start_col === end_col) ||
                (start_col === 0 && end_col === 7 && start_row === end_row) ||
                (start_col === 7 && end_col === 0 && start_row === end_row)) {
                return false;
            }
        }

        // Other piece-specific move validations
        if (this.piece === 'N' || this.piece === 'n') { // Knight
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
        }
        if (this.piece === 'P' || this.piece === 'p') { // Pawn
            // Pawn specific move validations
            if (start_row === 1 || start_row == 6 && start_col === end_col && Math.abs(end_row - start_row) === 2) {
                return true;
            }
            if (start_col === end_col && Math.abs(end_row - start_row) === 1) {
                return true;
            }
            if (this.board[end_row][end_col] !== null && this.board[start_row][start_col][2] !== this.board[end_row][end_col][2] && Math.abs(start_col - end_col) === 1 && Math.abs(end_row - start_row) === 1) {
                return true;
            }
            return false;
        } else if (this.piece === 'R' || this.piece === 'r') { // Rook
            // Rook moves horizontally or vertically
            return start_row == end_row || start_col == end_col;
        } else if (this.piece === 'B' || this.piece === 'b') { // Bishop
            // Bishop moves diagonally
            return Math.abs(end_row - start_row) === Math.abs(end_col - start_col);
        } else {
            return false; // Default: invalid move
        }
    }

    is_check(piece, start_row, start_col, flags_row, flags_col) {
        if (!(0 <= start_row < 8 && 0 <= start_col < 8 && 0 <= flags_row < 8 && 0 <= flags_col < 8)) {
            return false;
        }

        if (this.board[start_row][start_col] === null) {
            return false;
        }

        if (this.piece === 'R' || this.piece === 'r') { // Rook or Queen
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

        if (this.piece === 'B' || this.piece === 'b') { // Bishop or Queen
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

        if (this.piece === 'N' || this.piece === 'n') { // Knight
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