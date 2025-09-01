function HelperFunctions() {

    // Variable to store the canvas state before clearing
    var savedCanvasState = null;
    var canvasWasCleared = false;

    //event handler for the undo button
    select("#undoButton").mouseClicked(function() {
        undoAction();
    });

    //event handler for the redo button
    select("#redoButton").mouseClicked(function() {
        redoAction();
    });

    //event handler for the clear button event. Clears the screen
    select("#clearButton").mouseClicked(function() {
        
        if (!canvasWasCleared) {
            // Save current state before clearing
            saveState();
            
            // Clear the pixel grid
            for (let x = 0; x < gridWidth; x++) {
                for (let y = 0; y < gridHeight; y++) {
                    pixelGrid[x][y] = color(255);
                }
            }
            
            // Save the cleared state
            saveState();
            
            canvasWasCleared = true;
            select("#clearButton").html("🔄 Restore");
        } else {
            // Use undo to restore previous state
            undoAction();
            canvasWasCleared = false;
            select("#clearButton").html("🗑️ Clear");
        }
    });

    //event handler for the save image button
    select("#saveImageButton").mouseClicked(function() {
        saveCanvas("pixelArt", "png");
    });
}