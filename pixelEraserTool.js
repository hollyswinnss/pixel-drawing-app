function PixelEraserTool() {
    this.icon = "assets/rubber.png";
    this.name = "Pixel Eraser";
    
    var self = this;
    var isErasing = false;
    
    // Eraser sizes
    this.eraserSize = "medium"; // small, medium, large
    
    // Define eraser patterns for different sizes
    this.eraserPatterns = {
        small: [
            [0, 0] // Just center pixel
        ],
        
        medium: [
            [-1, -1], [0, -1], [1, -1],
            [-1, 0],  [0, 0],  [1, 0],
            [-1, 1],  [0, 1],  [1, 1]
        ],
        
        large: [
            [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2],
            [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1],
            [-2, 0],  [-1, 0],  [0, 0],  [1, 0],  [2, 0],
            [-2, 1],  [-1, 1],  [0, 1],  [1, 1],  [2, 1],
            [-2, 2],  [-1, 2],  [0, 2],  [1, 2],  [2, 2]
        ]
    };

    this.draw = function() {
        if (mouseIsPressed) {
            if (!isErasing) {
                // Save state when starting to erase
                saveState();
                isErasing = true;
            }
            
            var gridPos = getGridPos(mouseX, mouseY);
            this.erasePixels(gridPos.x, gridPos.y);
        } else if (isErasing) {
            // Reset erasing flag when mouse is released
            isErasing = false;
        }
    };

    this.erasePixels = function(centerX, centerY) {
        var pattern = this.eraserPatterns[this.eraserSize];
        
        for (var i = 0; i < pattern.length; i++) {
            var pixelX = centerX + pattern[i][0];
            var pixelY = centerY + pattern[i][1];
            
            if (pixelX >= 0 && pixelX < gridWidth && pixelY >= 0 && pixelY < gridHeight) {
                setPixel(pixelX, pixelY, color(255)); // Set to white
            }
        }
    };

    this.populateOptions = function() {
        var optionsContainer = select('.options');
        optionsContainer.html('<h3>Eraser Size:</h3>');
        
        var sizes = [
            {size: 'small', name: 'Small (1x1)', icon: '🔘'},
            {size: 'medium', name: 'Medium (3x3)', icon: '⚪'},
            {size: 'large', name: 'Large (5x5)', icon: '⭕'}
        ];
        
        for (var i = 0; i < sizes.length; i++) {
            var sizeOption = sizes[i];
            var btn = createButton(sizeOption.icon + ' ' + sizeOption.name);
            btn.addClass('eraser-size-option');
            btn.attribute('data-size', sizeOption.size);
            
            if (this.eraserSize === sizeOption.size) {
                btn.addClass('selected');
            }
            
            optionsContainer.child(btn);
            
            // Create closure for click handler
            (function(size) {
                btn.mouseClicked(function() {
                    self.selectSize(size);
                });
            })(sizeOption.size);
        }
    };

    this.selectSize = function(size) {
        this.eraserSize = size;
        
        var allBtns = selectAll('.eraser-size-option');
        for (var i = 0; i < allBtns.length; i++) {
            allBtns[i].removeClass('selected');
        }
        
        var selectedBtn = select('.eraser-size-option[data-size="' + size + '"]');
        if (selectedBtn) {
            selectedBtn.addClass('selected');
        }
    };

    this.unselectTool = function() {
        var optionsContainer = select('.options');
        optionsContainer.html('');
    };
}