function PixelLineTool() {
    this.icon = "assets/line.png";
    this.name = "Pixel Shapes";

    var startGridX = -1;
    var startGridY = -1;
    var drawing = false;
    var previewPixels = [];
    var stateSaved = false;
    var self = this;
    
    // Shape type selection
    this.shapeType = "line"; // line, circle, rectangle

    this.draw = function() {
        if (mouseIsPressed) {
            var gridPos = getGridPos(mouseX, mouseY);
            
            if (startGridX == -1) {
                // Save state when starting to draw shape
                if (!stateSaved) {
                    saveState();
                    stateSaved = true;
                }
                startGridX = gridPos.x;
                startGridY = gridPos.y;
                drawing = true;
            } else {
                // Clear previous preview
                this.clearPreview();
                
                // Draw preview shape based on selected type
                if (this.shapeType === "line") {
                    previewPixels = this.getLinePixels(startGridX, startGridY, gridPos.x, gridPos.y);
                } else if (this.shapeType === "circle") {
                    previewPixels = this.getCirclePixels(startGridX, startGridY, gridPos.x, gridPos.y);
                } else if (this.shapeType === "rectangle") {
                    previewPixels = this.getRectanglePixels(startGridX, startGridY, gridPos.x, gridPos.y);
                }
                
                this.drawPreview();
            }
        } else if (drawing) {
            // Finalize the shape
            for (let pixel of previewPixels) {
                setPixel(pixel.x, pixel.y, colourP.selectedColour);
            }
            
            drawing = false;
            startGridX = -1;
            startGridY = -1;
            previewPixels = [];
            stateSaved = false;
        }
    };

    this.getLinePixels = function(x0, y0, x1, y1) {
        var pixels = [];
        var dx = Math.abs(x1 - x0);
        var dy = Math.abs(y1 - y0);
        var sx = x0 < x1 ? 1 : -1;
        var sy = y0 < y1 ? 1 : -1;
        var err = dx - dy;

        var x = x0;
        var y = y0;

        while (true) {
            pixels.push({x: x, y: y});

            if (x === x1 && y === y1) break;

            var e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }

        return pixels;
    };

    this.getCirclePixels = function(centerX, centerY, edgeX, edgeY) {
        var pixels = [];
        var radius = Math.round(Math.sqrt(Math.pow(edgeX - centerX, 2) + Math.pow(edgeY - centerY, 2)));
        
        // Bresenham's circle algorithm
        var x = 0;
        var y = radius;
        var d = 3 - 2 * radius;
        
        while (y >= x) {
            // Add 8 symmetric points
            pixels.push({x: centerX + x, y: centerY + y});
            pixels.push({x: centerX - x, y: centerY + y});
            pixels.push({x: centerX + x, y: centerY - y});
            pixels.push({x: centerX - x, y: centerY - y});
            pixels.push({x: centerX + y, y: centerY + x});
            pixels.push({x: centerX - y, y: centerY + x});
            pixels.push({x: centerX + y, y: centerY - x});
            pixels.push({x: centerX - y, y: centerY - x});
            
            x++;
            if (d > 0) {
                y--;
                d = d + 4 * (x - y) + 10;
            } else {
                d = d + 4 * x + 6;
            }
        }
        
        return pixels;
    };

    this.getRectanglePixels = function(x0, y0, x1, y1) {
        var pixels = [];
        var minX = Math.min(x0, x1);
        var maxX = Math.max(x0, x1);
        var minY = Math.min(y0, y1);
        var maxY = Math.max(y0, y1);
        
        // Top and bottom edges
        for (var x = minX; x <= maxX; x++) {
            pixels.push({x: x, y: minY});
            if (minY !== maxY) {
                pixels.push({x: x, y: maxY});
            }
        }
        
        // Left and right edges
        for (var y = minY + 1; y < maxY; y++) {
            pixels.push({x: minX, y: y});
            if (minX !== maxX) {
                pixels.push({x: maxX, y: y});
            }
        }
        
        return pixels;
    };

    this.drawPreview = function() {
        // Draw preview pixels with transparency
        for (let pixel of previewPixels) {
            if (pixel.x >= 0 && pixel.x < gridWidth && pixel.y >= 0 && pixel.y < gridHeight) {
                fill(red(colourP.selectedColour), green(colourP.selectedColour), blue(colourP.selectedColour), 128);
                rect(pixel.x * pixelSize, pixel.y * pixelSize, pixelSize, pixelSize);
            }
        }
    };

    this.clearPreview = function() {
        // Preview is cleared automatically by redrawing the grid
    };

    this.populateOptions = function() {
        var optionsContainer = select('.options');
        optionsContainer.html('<h3>Shape Type:</h3>');
        
        var shapes = [
            {type: 'line', emoji: '📏', name: 'Line'},
            {type: 'circle', emoji: '⭕', name: 'Circle'},
            {type: 'rectangle', emoji: '⬜', name: 'Rectangle'}
        ];
        
        for (var i = 0; i < shapes.length; i++) {
            var shape = shapes[i];
            var btn = createButton(shape.emoji + ' ' + shape.name);
            btn.addClass('shape-option');
            btn.attribute('data-shape', shape.type);
            
            if (this.shapeType === shape.type) {
                btn.addClass('selected');
            }
            
            optionsContainer.child(btn);
            
            // Create closure for click handler
            (function(shapeType) {
                btn.mouseClicked(function() {
                    self.selectShape(shapeType);
                });
            })(shape.type);
        }
    };

    this.selectShape = function(shapeType) {
        this.shapeType = shapeType;
        
        var allBtns = selectAll('.shape-option');
        for (var i = 0; i < allBtns.length; i++) {
            allBtns[i].removeClass('selected');
        }
        
        var selectedBtn = select('.shape-option[data-shape="' + shapeType + '"]');
        if (selectedBtn) {
            selectedBtn.addClass('selected');
        }
    };

    this.unselectTool = function() {
        var optionsContainer = select('.options');
        optionsContainer.html('');
    };
}