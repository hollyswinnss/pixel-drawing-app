//global variables that will store the toolbox colour palette
//and the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;

// Pixel art specific variables
var pixelSize = 10; // Size of each pixel/cell - reduced from 20 to 10 for more pixels
var gridWidth, gridHeight;
var pixelGrid = []; // 2D array to store pixel colors

// Undo/Redo system
var undoStack = [];
var redoStack = [];
var maxUndoSteps = 20; // Limit undo history to prevent memory issues

function setup() {
    //create a canvas to fill the content div from index.html
    canvasContainer = select('#content');
    var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
    c.parent("content");

    // Calculate grid dimensions
    gridWidth = Math.floor(width / pixelSize);
    gridHeight = Math.floor(height / pixelSize);
    
    // Initialize pixel grid with white pixels
    for (let x = 0; x < gridWidth; x++) {
        pixelGrid[x] = [];
        for (let y = 0; y < gridHeight; y++) {
            pixelGrid[x][y] = color(255); // White background
        }
    }

    //create helper functions and the colour palette
    helpers = new HelperFunctions();
    colourP = new ColourPalette();

    //create a toolbox for storing the tools
    toolbox = new Toolbox();

    //add the pixel art tools to the toolbox
    toolbox.addTool(new PixelBrushTool());
    toolbox.addTool(new PixelEraserTool());
    toolbox.addTool(new PixelFillTool());
    toolbox.addTool(new PixelLineTool()); // Now supports lines, circles, and rectangles
    toolbox.addTool(new PixelStampTool());
    
    // Save initial state for undo system
    saveState();
    
    drawGrid();
}

function draw() {
    // Draw the pixel grid
    drawPixelGrid();
    
    // Draw grid lines
    drawGrid();
    
    //call the draw function from the selected tool
    if (toolbox.selectedTool != null && toolbox.selectedTool.hasOwnProperty("draw")) {
        toolbox.selectedTool.draw();
    }
}

function drawPixelGrid() {
    // Draw all pixels in the grid
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            fill(pixelGrid[x][y]);
            noStroke();
            rect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }
}

function drawGrid() {
    // Draw grid lines
    stroke(200);
    strokeWeight(1);
    
    // Vertical lines
    for (let x = 0; x <= gridWidth; x++) {
        line(x * pixelSize, 0, x * pixelSize, height);
    }
    
    // Horizontal lines
    for (let y = 0; y <= gridHeight; y++) {
        line(0, y * pixelSize, width, y * pixelSize);
    }
}

// Helper function to get grid coordinates from mouse position
function getGridPos(x, y) {
    return {
        x: Math.floor(x / pixelSize),
        y: Math.floor(y / pixelSize)
    };
}

// Helper function to set a pixel color
function setPixel(gridX, gridY, color) {
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        pixelGrid[gridX][gridY] = color;
    }
}

// Helper function to get a pixel color
function getPixel(gridX, gridY) {
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        return pixelGrid[gridX][gridY];
    }
    return color(255); // Return white if out of bounds
}

// Save current pixel grid state to undo stack
function saveState() {
    // Create a deep copy of the current pixel grid
    var state = [];
    for (let x = 0; x < gridWidth; x++) {
        state[x] = [];
        for (let y = 0; y < gridHeight; y++) {
            state[x][y] = color(red(pixelGrid[x][y]), green(pixelGrid[x][y]), blue(pixelGrid[x][y]));
        }
    }
    
    // Add to undo stack
    undoStack.push(state);
    
    // Clear redo stack when new action is performed
    redoStack = [];
    
    // Limit undo stack size
    if (undoStack.length > maxUndoSteps) {
        undoStack.shift(); // Remove oldest state
    }
    
    // Update button states
    updateUndoRedoButtons();
}

// Undo the last action
function undoAction() {
    if (undoStack.length > 1) { // Keep at least one state
        // Move current state to redo stack
        var currentState = undoStack.pop();
        redoStack.push(currentState);
        
        // Restore previous state
        var previousState = undoStack[undoStack.length - 1];
        restoreState(previousState);
        
        updateUndoRedoButtons();
    }
}

// Redo the last undone action
function redoAction() {
    if (redoStack.length > 0) {
        // Get state from redo stack
        var stateToRestore = redoStack.pop();
        undoStack.push(stateToRestore);
        
        // Restore the state
        restoreState(stateToRestore);
        
        updateUndoRedoButtons();
    }
}

// Restore a saved state to the pixel grid
function restoreState(state) {
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            if (state[x] && state[x][y]) {
                pixelGrid[x][y] = color(red(state[x][y]), green(state[x][y]), blue(state[x][y]));
            }
        }
    }
}

// Update undo/redo button states
function updateUndoRedoButtons() {
    var undoBtn = select('#undoButton');
    var redoBtn = select('#redoButton');
    
    if (undoBtn) {
        if (undoStack.length <= 1) {
            undoBtn.attribute('disabled', '');
            undoBtn.style('opacity', '0.5');
        } else {
            undoBtn.removeAttribute('disabled');
            undoBtn.style('opacity', '1');
        }
    }
    
    if (redoBtn) {
        if (redoStack.length === 0) {
            redoBtn.attribute('disabled', '');
            redoBtn.style('opacity', '0.5');
        } else {
            redoBtn.removeAttribute('disabled');
            redoBtn.style('opacity', '1');
        }
    }
}