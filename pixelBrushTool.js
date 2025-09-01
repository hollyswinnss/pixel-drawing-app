function PixelBrushTool() {
    this.icon = "assets/brush.png";
    this.name = "Pixel Brush";
    
    var isDrawing = false;

    this.draw = function() {
        if (mouseIsPressed) {
            if (!isDrawing) {
                // Save state when starting to draw
                saveState();
                isDrawing = true;
            }
            var gridPos = getGridPos(mouseX, mouseY);
            setPixel(gridPos.x, gridPos.y, colourP.selectedColour);
        } else if (isDrawing) {
            // Reset drawing flag when mouse is released
            isDrawing = false;
        }
    };
}