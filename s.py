class ChessGame:
    def __init__(self):
        self.board = self.initialize_board()
        self.current_player = 'White'
        self.flags = [ ['e1', 'White', 0], ['e8', 'Black', 0] ]
        self.base =  [ ['d1', 'White', 0], ['d8', 'Black', 0] ]

    def initialize_board(self):
        # Initialize an empty 8x8 chessboard with pieces in their starting positions
        board = [[None for _ in range(8)] for _ in range(8)]
        
        # Place white pieces
        board[0] = [['♖', 'R', 'Black', 0], ['♘', 'N', 'Black', 0], ['♗', 'B', 'Black', 0], ['*', 'C', 'Black', 0], ['🏴', 'K', 'Black', 0], ['♗', 'B', 'Black', 0], ['♘', 'N', 'Black', 0], ['♖', 'R', 'Black', 0]]
        board[1] = [['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0], ['♙', 'P', 'Black', 0]]

        # Place black pieces
        board[7] = [['♜', 'r', 'White', 0], ['♞', 'n', 'White', 0], ['♝', 'b', 'White', 0], ['*', 'c', 'White', 0], ['🏳️', 'k', 'White', 0], ['♝', 'b', 'White', 0], ['♞', 'n', 'White', 0], ['♜', 'r', 'White', 0]]
        board[6] = [['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0], ['♟', 'p', 'White', 0]]

        return board

    def print_board(self):
        # Print the current state of the chessboard with positions revealed
        orange_bg = '\x1b[48;5;208m'  # Orange background
        red_bg = '\x1b[48;5;196m'     # Red background
        reset_color = '\x1b[0m'        # Reset color

        print("  +------------------------ A +")
        for row in range(8):
            row_display = f"{8 - row} |"
            for col in range(8):
                if self.board[row][col] is not None:
                    piece_symbol = self.board[row][col][0]
                else:
                    piece_symbol = ' .'
                
                # Alternate background colors
                if (row + col) % 2 == 0:
                    if self.board[row][col] is None:
                        row_display += f"{orange_bg}{piece_symbol} {reset_color}"
                        self.board[row][col] = ['.','.','.']
                    elif self.board[row][col][1].lower() == 'k':
                        row_display += f"{orange_bg}{piece_symbol} {reset_color}"
                    elif self.board[row][col][1].lower() != 'k':
                        row_display += f"{orange_bg} {piece_symbol} {reset_color}"
                else:
                    if self.board[row][col] is None:
                        row_display += f"{red_bg}{piece_symbol} {reset_color}"
                        self.board[row][col] = ['.','.','.']
                    elif self.board[row][col][1].lower() == 'k':
                        row_display += f"{red_bg}{piece_symbol} {reset_color}"
                    elif self.board[row][col][1].lower() != 'k':
                        row_display += f"{red_bg} {piece_symbol} {reset_color}"
                    
            row_display += "|"
            print(row_display)
        print("  +------------------------ a +")


    # def print_board(self):
    #     # Print the current state of the chessboard with positions revealed
    #     print("  +------------------------ A +")
    #     for row in range(8):
    #         row_display = f"{8 - row} | "
    #         for col in range(8):
    #             if self.board[row][col] is not None:
    #                 piece_symbol = self.board[row][col][0]
    #             else:
    #                 piece_symbol = '.'
    #             row_display += f" {piece_symbol} "
    #         row_display += " |"
    #         print(row_display)
    #     print("  +------------------------ a +")

    def capture_piece(self, row, col, moving_piece):
        # Remove the piece at the specified position from the board if it belongs to the opposing player
        if self.board[row][col] is not None:
            self.board[row][col] = None

    def move_piece(self, piece, start_row, start_col, end_row, end_col):
        # Move the piece from start position to end position
        if self.board[start_row][start_col][1] == piece:
            self.board[end_row][end_col] = self.board[start_row][start_col]
            self.board[start_row][start_col] = ['.', '.', '.']

    def convert_position(self, position):
        # Convert algebraic notation to array indices
        row = 8 - int(position[1])
        col = ord(position[0]) - ord('a')
        return row, col

    def is_valid_move(self, piece, start_row, start_col, end_row, end_col):
        # Check if the move is within the bounds of the board
        if not (0 <= start_row < 8 and 0 <= start_col < 8 and 0 <= end_row < 8 and 0 <= end_col < 8):
            return False
        
        # Check if there is a piece at the starting position
        if self.board[start_row][start_col] is None:
            return False

        # opponent_color = 'Black' if self.board[start_row][start_col][2] == 'White' else 'White'
        # if self.is_check(opponent_color):
        #     return False  # Move leads to opponent's king being in check
        # Check for obstruction in the path
        if piece in ['R', 'r', 'Q', 'q']:  # Rook or Queen
            if start_row == end_row:  # Horizontal move
                delta_col = 1 if end_col > start_col else -1
                for col in range(start_col + delta_col, end_col, delta_col):
                    if self.board[start_row][col] is None:
                        self.board[start_row][col] = ['.', '.', '.']
                    elif self.board[start_row][col][2] == self.board[start_row][start_col][2]:
                        return False  # Obstruction found
                    elif end_col != col and self.board[end_row][col][2] != self.board[start_row][start_col][2]:
                        return False  # Obstruction found
                    elif end_col == col and self.board[end_row][col][2] != self.board[start_row][start_col][2]:
                        return True  # Obstruction found
                return True
            elif start_col == end_col:  # Vertical move
                delta_row = 1 if end_row > start_row else -1
                for row in range(start_row + delta_row, end_row, delta_row):
                    if self.board[row][start_col] is None:
                        self.board[row][start_col] = ['.', '.', '.']
                    elif self.board[row][start_col][2] == self.board[start_row][start_col][2]:
                        return False  # Obstruction found
                    elif end_row != row and self.board[row][start_col][2] != self.board[start_row][start_col][2]:
                        return False  # Obstruction found
                    elif end_row == row and self.board[row][start_col][2] != self.board[start_row][start_col][2]:
                        return True  # Obstruction found
                return True

        if piece in ['B', 'b', 'Q', 'q']:  # Bishop or Queen
            delta_row = end_row - start_row
            delta_col = end_col - start_col
            if abs(delta_row) == abs(delta_col):  # Diagonal move
                row_step = 1 if start_row < end_row else -1
                col_step = 1 if start_col < end_col else -1
                row = (start_row + row_step) % 8
                col = (start_col + col_step) % 8
                check_row = row
                check_col = col
                while row != 7 and col != 7:
                    if self.board[row][col] is None:
                        self.board[row][col] = ['.', '.', '.']
                    elif self.board[row][col][1].lower() == 'k':
                        print("Check!")
                        return True
                    elif self.board[row][col][2] == self.board[start_row][start_col][2]:
                        row_step = 1 if start_row > end_row else -1
                        col_step = 1 if start_col > end_col else -1
                    row = abs(row + row_step) % 8
                    col = abs(col + col_step) % 8

                row_step = 1 if start_row < end_row else -1
                col_step = 1 if start_col < end_col else -1
                row = (start_row + row_step) % 8
                col = (start_col + col_step) % 8
                check_row = row
                check_col = col
                while row != end_row and col != end_col:
                    if self.board[row][col] is None:
                        self.board[row][col] = ['.', '.', '.']
                    elif self.board[row][col][2] == self.board[start_row][start_col][2]:
                        row_step = 1 if start_row > end_row else -1
                        col_step = 1 if start_col > end_col else -1
                    elif self.board[row][col][2] == self.board[start_row][start_col][2]:
                        return False  # Obstruction found
                    elif row == end_row and self.board[row][col][2] == self.board[start_row][start_col][2]:
                        return False  # Obstruction found
                    elif row != end_row and self.board[row][col][2] == self.board[start_row][start_col][2]:
                        return False  # Obstruction found
                    row = abs(row + row_step) % 8
                    col = abs(col + col_step) % 8
        # Check if there's a piece of the same color at the ending position
        if self.board[end_row][end_col] is not None and self.board[end_row][end_col][2] == self.board[start_row][start_col][2]:
            return False  # Obstruction found
        
        if piece == 'N' or piece == 'n':  # Knight
            # Check if the move is a valid knight move
            delta_row = abs(end_row - start_row)
            delta_col = abs(end_col - start_col)
            # return (delta_row == 1 and delta_col == 2) or (delta_row == 2 and delta_col == 1)
            # Check if the move is a valid knight's move or teleportation
            if delta_row == 2 and delta_col == 1:
                return True
            elif delta_row == 1 and delta_col == 2:
                return True
            elif delta_row == 1 and delta_col >= 6:
                return True
            elif delta_row >= 6 and delta_col == 1:
                return True
            else:
                return False
        
        # Allow non-pawns and the king to move around the outside of the board
        if piece in ['P', 'p', 'K', 'k']:
            # Check if the move is along the edge of the board and the destination is on the opposite side
            if (start_row == 0 and end_row == 7 and start_col == end_col) or \
            (start_row == 7 and end_row == 0 and start_col == end_col) or \
            (start_col == 0 and end_col == 7 and start_row == end_row) or \
            (start_col == 7 and end_col == 0 and start_row == end_row):
                return False
            
        # Check for piece-specific move validation
        if piece == 'P':  # Pawn
            # Pawn can move forward two squares from starting position
            if start_row == 1 and start_col == end_col and end_row - start_row == 2:
                return True
            if start_col == end_col and end_row - start_row == 1:
                return True
            # Pawn can capture diagonally
            if self.board[end_row][end_col] is not None and self.board[start_row][start_col][2] != self.board[end_row][end_col][2] and abs(start_col - end_col) == 1 and end_row - start_row == 1:
                return True
            return False
        elif piece == 'p':  # Pawn (for black)
            # Pawn can move forward two squares from starting position
            if start_row == 6 and start_col == end_col and start_row - end_row == 2:
                return True
            # Similar logic for black pawn
            if start_col == end_col and start_row - end_row == 1:
                return True
            if self.board[end_row][end_col] is not None and abs(start_col - end_col) == 1 and start_row - end_row == 1:
                return True
            return False
        elif piece == 'R' or piece == 'r':  # Rook
            # Rook moves horizontally or vertically
            return start_row == end_row or start_col == end_col
        elif piece == 'B' or piece == 'b':  # Bishop
            # Bishop moves diagonally
            return abs(end_row - start_row) == abs(end_col - start_col)
        elif piece == 'Q' or piece == 'q':  # Queen
            # Queen combines rook and bishop moves
            return (start_row == end_row or start_col == end_col) or (abs(end_row - start_row) == abs(end_col - start_col))
        elif piece == 'K' or piece == 'k':  # King
            # King moves one square in any direction
            str_temp = chr(end_col + ord('a')) + end_row
            if self.board[end_row][end_col][2] == 'White':
                self.flags[0][0] = str_temp
            elif self.board[end_row][end_col][2] == 'Black':
                self.flags[1][0] = str_temp
            return abs(end_row - start_row) <= 1 and abs(end_col - start_col) <= 1
        else:
            return False  # Default: invalid move
        # Check if there's a piece of the same color at the ending position
        if self.board[end_row][end_col] is not None and self.board[end_row][end_col][2] == self.board[start_row][start_col][2]:
            return False

        return True  # Move is valid

    def is_check(self, piece, start_row, start_col, flags_row, flags_col):
        # Check if the move is within the bounds of the board
        if not (0 <= start_row < 8 and 0 <= start_col < 8 and 0 <= end_row < 8 and 0 <= end_col < 8):
            return False
        
        # Check if there is a piece at the starting position
        if self.board[start_row][start_col] is None:
            return False

        # opponent_color = 'Black' if self.board[start_row][start_col][2] == 'White' else 'White'
        # if self.is_check(opponent_color):
        #     return False  # Move leads to opponent's king being in check
        # Check for obstruction in the path
        if piece in ['R', 'r', 'Q', 'q']:  # Rook or Queen
            if start_row == flags_row:  # Horizontal move
                for i in range(8):
                    if self.board[start_row][i] is None:
                        self.board[start_row][i] = ['.', '.', '.']
                    if self.board[start_row][i][2] != self.board[start_row][i][2] and self.board[start_row][i][1].lower() != 'k':
                        return False
                    if self.board[start_row][i][2] != self.board[start_row][i][2] and self.board[start_row][i][1].lower() == 'k':
                        return True
            elif start_col == flags_col:  # Vertical move
                for i in range(8):
                    if self.board[i][start_col] is None:
                        self.board[i][start_col] = ['.', '.', '.']
                    if self.board[i][start_col][2] != self.board[start_row][start_col][2] and self.board[i][start_col][1].lower() != 'k':
                        return False
                    if self.board[i][start_col][2] != self.board[start_row][start_col][2] and self.board[i][start_col][1].lower() == 'k':
                        return True

        if piece in ['B', 'b', 'Q', 'q']:  # Bishop or Queen
            for i in range(8):
                for j in range(8):
                    if j == i:
                        if self.board[i][j] is None:
                            self.board[i][j] = ['.', '.', '.']
                        if self.board[i][j][2] == self.board[start_row][start_col][2]:
                            break
                        if self.board[i][j][2] != self.board[start_row][start_col][2] and self.board[i][j][1].lower() != 'k':
                            break
                        if self.board[i][j][2] != self.board[start_row][start_col][2] and self.board[i][j][1].lower() == 'k':
                            return True

        if piece == 'N' or piece == 'n':  # Knight
            # Check if the move is a valid knight move
            for i in range(8):
                for j in range(8):
                    delta_row = abs(i - start_row)
                    delta_col = abs(j - start_col)
                    if (delta_row == 1 and delta_col == 2) or (delta_row == 2 and delta_col == 1):
                        if self.board[i][j] is None:
                            self.board[i][j] = ['.','.','.']
                        if self.board[i][j][2] != self.board[start_row][start_col][2] and self.board[i][j][1].lower() == 'k':
                            return True

if __name__ == "__main__":
    game = ChessGame()
    current_player = 'White'  # Start with white player
    while True:
        game.print_board()
        print(f"It's {'White' if current_player == 'White' else 'Black'}'s turn.")

        move = input("Enter your move (e.g., 'N c2 to d4'): ")
        if move.lower() == 'exit':
            break

        move_parts = move.split()
        piece = move_parts[0]
        start_position = move_parts[1]
        end_position = move_parts[3]
        start_row, start_col = game.convert_position(start_position)
        end_row, end_col = game.convert_position(end_position)

        # Check if it's the player's piece
        if game.board[start_row][start_col] is None or game.board[start_row][start_col][2] != current_player:
            print("Invalid Move! It's not your piece.")
            continue

        # if game.check_endgame_modes(current_player):
        if game.is_valid_move(piece, start_row, start_col, end_row, end_col):
            # game.check_endgame_modes(current_player)
            if game.is_check(piece, start_row, start_col, end_row, end_col):
                print("Check!")
            game.move_piece(piece, start_row, start_col, end_row, end_col)

            offset = 0
            if current_player != 'White':
                offset = 1
            king_row, king_col = game.convert_position(game.flags[offset][0])

            if game.is_check(piece, end_row, end_col, king_row, king_col):
            # if game.is_check(piece, end_row, end_col, king_row, king_col):
                print("Check!")
            
            # Switch player
            current_player = 'Black' if current_player == 'White' else 'White'
        else:
            print("Invalid Move!")
