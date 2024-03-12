<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chess Board</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div class="chessboard" id="chessboard"></div>
    <!-- <script src="script.js"></script> -->
    <script src="s.js"></script>
    <script>     // General
        const game = new ChessGame();
        let currentPlayer = 'White'; // Initialize current player
        let activePiece = null; // Track the active piece for movement
    </script>
</body>

</html>