const board = document.getElementById('chessboard');
let activePiece = null;

// Function to create the chessboard
function createChessboard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = ''; // Add piece symbol here based on game state
            cell.id = `${row}-${col}`; // ID each cell with row and column
            cell.addEventListener('click', () => handleCellClick(row, col));
            board.appendChild(cell);
        }
    }
}

// Function to handle cell click
function handleCellClick(row, col) {
    const cell = document.getElementById(`${row}-${col}`);
    
    if (activePiece === null) {
        // No active piece, highlight the clicked cell
        activePiece = { row, col };
        cell.classList.add('active');
    } else {
        // Active piece exists, check if it's the same cell
        if (activePiece.row === row && activePiece.col === col) {
            // Same cell clicked, unhighlight and deselect
            cell.classList.remove('active');
            activePiece = null;
        } else {
            // Different cell clicked, coordinate the move
            if (isValidMove(activePiece.row, activePiece.col, row, col)) {
                // Move is valid, perform the move logic here
                // Implement the move logic based on the game rules
                // Reset activePiece and update board state
                activePiece = null;
            } else {
                // Invalid move, handle accordingly
                alert('Invalid Move!');
            }
        }
    }
}

// Call the function to create the chessboard
createChessboard();