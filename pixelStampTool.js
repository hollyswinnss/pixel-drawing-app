function PixelStampTool() {
    this.icon = "assets/stamp.png";
    this.name = "Pixel Stamp";
    
    // Current stamp type
    this.stampType = "heart";
    
    var self = this;
    var hasStamped = false;
    
    // Enhanced stamp patterns with more options
    this.patterns = {
        heart: [
            // Top curves of heart
            [-2, -2], [-1, -2], [1, -2], [2, -2],
            [-3, -1], [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [3, -1],
            // Middle wide part
            [-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0],
            // Tapering down
            [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1],
            [-1, 2], [0, 2], [1, 2],
            // Point at bottom
            [0, 3]
        ],
        
        flower: [
            // Center
            [0, 0], [-1, 0], [1, 0], [0, -1], [0, 1],
            // Petals
            [-2, -2], [-1, -2], [0, -3], [1, -2], [2, -2],
            [-3, 0], [-2, -1], [-2, 1],
            [2, -1], [3, 0], [2, 1],
            [-2, 2], [-1, 2], [0, 3], [1, 2], [2, 2],
            // Stem
            [0, 4], [0, 5]
        ],
        
        star: [
            // Top point
            [0, -4],
            [-1, -3], [0, -3], [1, -3],
            // Upper left and right arms extending outward
            [-3, -2], [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2], [3, -2],
            // Inner valley points (creating the star shape)
            [-4, -1], [-1, -1], [0, -1], [1, -1], [4, -1],
            // Center line
            [-1, 0], [0, 0], [1, 0],
            // Lower inner valley
            [-1, 1], [0, 1], [1, 1],
            // Bottom left and right points
            [-3, 2], [-2, 2], [2, 2], [3, 2],
            // Bottom inner area
            [-1, 3], [0, 3], [1, 3],
            // Bottom center point
            [0, 4]
        ],
        
        // New stamps
        diamond: [
            [0, -2],
            [-1, -1], [0, -1], [1, -1],
            [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0],
            [-1, 1], [0, 1], [1, 1],
            [0, 2]
        ],
        
        circle: [
            [-1, -2], [0, -2], [1, -2],
            [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1],
            [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0],
            [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1],
            [-1, 2], [0, 2], [1, 2]
        ],
        
        arrow: [
            [0, -3],
            [-1, -2], [0, -2], [1, -2],
            [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1],
            [0, 0], [0, 1], [0, 2], [0, 3]
        ],
        
        cross: [
            [0, -2], [0, -1], [0, 0], [0, 1], [0, 2],
            [-2, 0], [-1, 0], [1, 0], [2, 0]
        ],
        
        smiley: [
            // Face outline
            [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2],
            [-3, -1], [3, -1],
            [-3, 0], [3, 0],
            [-3, 1], [3, 1],
            [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2],
            // Eyes
            [-1, -1], [1, -1],
            // Smile
            [-1, 1], [0, 1], [1, 1]
        ]
    };

    this.draw = function() {
        if (mouseIsPressed && !hasStamped) {
            // Save state before stamping
            saveState();
            
            var gridPos = getGridPos(mouseX, mouseY);
            this.drawStamp(gridPos.x, gridPos.y);
            hasStamped = true;
        } else if (!mouseIsPressed) {
            hasStamped = false;
        }
    };

    this.drawStamp = function(centerX, centerY) {
        var pattern = this.patterns[this.stampType];
        
        for (var i = 0; i < pattern.length; i++) {
            var pixelX = centerX + pattern[i][0];
            var pixelY = centerY + pattern[i][1];
            
            if (pixelX >= 0 && pixelX < gridWidth && pixelY >= 0 && pixelY < gridHeight) {
                setPixel(pixelX, pixelY, colourP.selectedColour);
            }
        }
    };

    this.populateOptions = function() {
        var optionsContainer = select('.options');
        optionsContainer.html('<h3>Stamp Types:</h3>');
        
        var stamps = [
            {type: 'heart', emoji: '💝', name: 'Heart'},
            {type: 'flower', emoji: '🌸', name: 'Flower'},
            {type: 'star', emoji: '⭐', name: 'Star'},
            {type: 'diamond', emoji: '💎', name: 'Diamond'},
            {type: 'circle', emoji: '🔵', name: 'Circle'},
            {type: 'arrow', emoji: '⬆️', name: 'Arrow'},
            {type: 'cross', emoji: '➕', name: 'Cross'},
            {type: 'smiley', emoji: '😊', name: 'Smiley'}
        ];
        
        for (var i = 0; i < stamps.length; i++) {
            var stamp = stamps[i];
            var btn = createButton(stamp.emoji + ' ' + stamp.name);
            btn.addClass('stamp-option');
            btn.attribute('data-stamp', stamp.type);
            
            if (this.stampType === stamp.type) {
                btn.addClass('selected');
            }
            
            optionsContainer.child(btn);
            
            // Create closure for click handler
            (function(stampType) {
                btn.mouseClicked(function() {
                    self.selectStamp(stampType);
                });
            })(stamp.type);
        }
    };

    this.selectStamp = function(stampType) {
        this.stampType = stampType;
        
        var allBtns = selectAll('.stamp-option');
        for (var i = 0; i < allBtns.length; i++) {
            allBtns[i].removeClass('selected');
        }
        
        var selectedBtn = select('.stamp-option[data-stamp="' + stampType + '"]');
        if (selectedBtn) {
            selectedBtn.addClass('selected');
        }
    };

    this.unselectTool = function() {
        var optionsContainer = select('.options');
        optionsContainer.html('');
    };
}
