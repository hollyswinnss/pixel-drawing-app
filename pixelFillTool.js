function PixelFillTool() {
    this.icon = "assets/bucket.png";
    this.name = "Pixel Fill";
    
    var hasFilled = false;

    this.draw = function() {
        if (mouseIsPressed && !hasFilled) {
            // Save state before filling
            saveState();
            
            var gridPos = getGridPos(mouseX, mouseY);
            this.floodFill(gridPos.x, gridPos.y, colourP.selectedColour);
            hasFilled = true;
        } else if (!mouseIsPressed) {
            hasFilled = false;
        }
    };

    this.floodFill = function(startX, startY, newColor) {
        var targetColor = getPixel(startX, startY);
        
        // Don't fill if already the target color
        if (this.colorsEqual(targetColor, newColor)) return;
        
        var stack = [{x: startX, y: startY}];
        
        while (stack.length > 0) {
            var point = stack.pop();
            var x = point.x;
            var y = point.y;
            
            if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) continue;
            if (!this.colorsEqual(getPixel(x, y), targetColor)) continue;
            
            setPixel(x, y, newColor);
            
            // Add neighboring pixels to stack
            stack.push({x: x + 1, y: y});
            stack.push({x: x - 1, y: y});
            stack.push({x: x, y: y + 1});
            stack.push({x: x, y: y - 1});
        }
    };

    this.colorsEqual = function(c1, c2) {
        return red(c1) === red(c2) && green(c1) === green(c2) && blue(c1) === blue(c2);
    };
}