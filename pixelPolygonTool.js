function PixelPolygonTool() {
    this.icon = "assets/polygon.png";
    this.name = "Pixel Polygon";
    
    var self = this;
    
    // Tool modes
    this.mode = "create"; // "create" or "edit"
    
    // Vertex management
    this.vertices = [];
    this.selectedVertex = -1;
    this.isDragging = false;
    this.stateSaved = false;
    
    // Visual settings
    this.vertexSize = 8;
    this.handleSize = 6;
    
    this.draw = function() {
        // Draw preview of current polygon
        this.drawPolygonPreview();
        
        // Draw vertices
        this.drawVertices();
        
        // Handle mouse interactions
        if (mouseIsPressed) {
            this.handleMousePressed();
        } else if (this.isDragging) {
            this.isDragging = false;
            this.selectedVertex = -1;
        }
    };
    
    this.handleMousePressed = function() {
        var gridPos = getGridPos(mouseX, mouseY);
        
        if (this.mode === "create") {
            // Add new vertex if not too close to existing ones
            if (!this.isNearExistingVertex(gridPos)) {
                this.vertices.push({x: gridPos.x, y: gridPos.y});
            }
        } else if (this.mode === "edit") {
            // Check if clicking on existing vertex for dragging
            if (!this.isDragging) {
                this.selectedVertex = this.getVertexAtPosition(gridPos);
                if (this.selectedVertex !== -1) {
                    this.isDragging = true;
                }
            }
            
            // Drag selected vertex
            if (this.isDragging && this.selectedVertex !== -1) {
                this.vertices[this.selectedVertex].x = gridPos.x;
                this.vertices[this.selectedVertex].y = gridPos.y;
            }
        }
    };
    
    this.drawPolygonPreview = function() {
        if (this.vertices.length < 2) return;
        
        // Draw polygon outline with transparency
        stroke(red(colourP.selectedColour), green(colourP.selectedColour), blue(colourP.selectedColour), 128);
        strokeWeight(2);
        noFill();
        
        beginShape();
        for (var i = 0; i < this.vertices.length; i++) {
            var vertex = this.vertices[i];
            var screenX = vertex.x * pixelSize + pixelSize / 2;
            var screenY = vertex.y * pixelSize + pixelSize / 2;
            vertex(screenX, screenY);
        }
        if (this.vertices.length > 2) {
            endShape(CLOSE);
        } else {
            endShape();
        }
        
        noStroke();
    };
    
    this.drawVertices = function() {
        // Draw vertex handles
        for (var i = 0; i < this.vertices.length; i++) {
            var vertex = this.vertices[i];
            var screenX = vertex.x * pixelSize + pixelSize / 2;
            var screenY = vertex.y * pixelSize + pixelSize / 2;
            
            // Vertex handle
            if (i === this.selectedVertex) {
                fill(255, 100, 100); // Red for selected
            } else {
                fill(100, 255, 100); // Green for normal
            }
            stroke(0);
            strokeWeight(1);
            ellipse(screenX, screenY, this.handleSize, this.handleSize);
            
            // Vertex number
            fill(0);
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(8);
            text(i + 1, screenX, screenY);
        }
        
        noStroke();
    };
    
    this.isNearExistingVertex = function(pos) {
        var minDistance = 2; // Minimum grid distance between vertices
        
        for (var i = 0; i < this.vertices.length; i++) {
            var vertex = this.vertices[i];
            var distance = Math.sqrt(
                Math.pow(vertex.x - pos.x, 2) + 
                Math.pow(vertex.y - pos.y, 2)
            );
            
            if (distance < minDistance) {
                return true;
            }
        }
        return false;
    };
    
    this.getVertexAtPosition = function(pos) {
        var tolerance = 2; // Grid units tolerance for selection
        
        for (var i = 0; i < this.vertices.length; i++) {
            var vertex = this.vertices[i];
            var distance = Math.sqrt(
                Math.pow(vertex.x - pos.x, 2) + 
                Math.pow(vertex.y - pos.y, 2)
            );
            
            if (distance <= tolerance) {
                return i;
            }
        }
        return -1;
    };
    
    this.fillPolygon = function() {
        if (this.vertices.length < 3) return;
        
        // Save state before drawing
        if (!this.stateSaved) {
            saveState();
            this.stateSaved = true;
        }
        
        // Get bounding box
        var minX = Math.min(...this.vertices.map(v => v.x));
        var maxX = Math.max(...this.vertices.map(v => v.x));
        var minY = Math.min(...this.vertices.map(v => v.y));
        var maxY = Math.max(...this.vertices.map(v => v.y));
        
        // Fill pixels inside polygon using ray casting
        for (var y = minY; y <= maxY; y++) {
            for (var x = minX; x <= maxX; x++) {
                if (this.isPointInPolygon(x, y)) {
                    setPixel(x, y, colourP.selectedColour);
                }
            }
        }
        
        this.stateSaved = false;
    };
    
    this.isPointInPolygon = function(x, y) {
        var inside = false;
        var j = this.vertices.length - 1;
        
        for (var i = 0; i < this.vertices.length; i++) {
            var xi = this.vertices[i].x;
            var yi = this.vertices[i].y;
            var xj = this.vertices[j].x;
            var yj = this.vertices[j].y;
            
            if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
                inside = !inside;
            }
            j = i;
        }
        
        return inside;
    };
    
    this.switchMode = function() {
        if (this.mode === "create") {
            this.mode = "edit";
        } else {
            this.mode = "create";
        }
        this.selectedVertex = -1;
        this.isDragging = false;
    };
    
    this.clearVertices = function() {
        this.vertices = [];
        this.selectedVertex = -1;
        this.isDragging = false;
        this.stateSaved = false;
    };
    
    this.confirmShape = function() {
        if (this.vertices.length >= 3) {
            this.fillPolygon();
            this.clearVertices();
        }
    };
    
    this.populateOptions = function() {
        var optionsContainer = select('.options');
        optionsContainer.html('<h3>Polygon Tool:</h3>');
        
        // Mode toggle button
        var modeBtn = createButton(this.mode === "create" ? "📍 Create Mode" : "✏️ Edit Mode");
        modeBtn.addClass('shape-option');
        if (this.mode === "create") {
            modeBtn.addClass('selected');
        }
        modeBtn.mouseClicked(function() {
            self.switchMode();
            self.populateOptions(); // Refresh options
        });
        optionsContainer.child(modeBtn);
        
        // Clear vertices button
        var clearBtn = createButton("🗑️ Clear Vertices");
        clearBtn.addClass('shape-option');
        clearBtn.mouseClicked(function() {
            self.clearVertices();
        });
        optionsContainer.child(clearBtn);
        
        // Confirm shape button
        var confirmBtn = createButton("✅ Confirm Shape");
        confirmBtn.addClass('shape-option');
        if (this.vertices.length < 3) {
            confirmBtn.attribute('disabled', '');
        }
        confirmBtn.mouseClicked(function() {
            self.confirmShape();
        });
        optionsContainer.child(confirmBtn);
        
        // Instructions
        var instructions = createDiv();
        instructions.style('font-size', '10px');
        instructions.style('color', '#666');
        instructions.style('margin-top', '10px');
        instructions.style('line-height', '1.2');
        
        if (this.mode === "create") {
            instructions.html('Click canvas to add vertices.<br>Need 3+ vertices to create shape.');
        } else {
            instructions.html('Drag vertices to edit shape.<br>Click confirm when ready.');
        }
        
        optionsContainer.child(instructions);
    };
    
    this.unselectTool = function() {
        this.clearVertices();
        var optionsContainer = select('.options');
        optionsContainer.html('');
    };
}
