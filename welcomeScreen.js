// Welcome Screen Controller
class WelcomeScreen {
  constructor() {
    this.selectedWidth = 32;
    this.selectedHeight = 32;
    this.setupEventListeners();
    this.setDefaultSelection();
  }

  setupEventListeners() {
    // Canvas preset selection
    document.querySelectorAll('.canvas-preset').forEach(preset => {
      preset.addEventListener('click', () => {
        // Remove selected class from all presets
        document.querySelectorAll('.canvas-preset').forEach(p => p.classList.remove('selected'));
        
        // Add selected class to clicked preset
        preset.classList.add('selected');
        
        // Update selected dimensions
        this.selectedWidth = parseInt(preset.dataset.width);
        this.selectedHeight = parseInt(preset.dataset.height);
        
        // Update custom inputs to match selection
        document.getElementById('customWidth').value = this.selectedWidth;
        document.getElementById('customHeight').value = this.selectedHeight;
        
        console.log(`Selected preset: ${this.selectedWidth}x${this.selectedHeight}`);
      });
    });

    // Start with preset button
    document.getElementById('startWithPreset').addEventListener('click', () => {
      console.log(`Starting with preset: ${this.selectedWidth}x${this.selectedHeight}`);
      this.startApp(this.selectedWidth, this.selectedHeight);
    });

    // Custom canvas input changes
    document.getElementById('customWidth').addEventListener('input', () => {
      this.clearPresetSelection();
      this.updateCustomDimensions();
    });
    
    document.getElementById('customHeight').addEventListener('input', () => {
      this.clearPresetSelection();
      this.updateCustomDimensions();
    });

    // Custom canvas creation
    document.getElementById('createCustomCanvas').addEventListener('click', () => {
      const width = parseInt(document.getElementById('customWidth').value);
      const height = parseInt(document.getElementById('customHeight').value);
      
      if (isNaN(width) || isNaN(height)) {
        alert('Please enter valid numbers for width and height.');
        return;
      }
      
      if (width < 8 || width > 128 || height < 8 || height > 128) {
        alert('Please enter canvas dimensions between 8 and 128 pixels.');
        return;
      }
      
      console.log(`Starting with custom: ${width}x${height}`);
      this.startApp(width, height);
    });

    // Skip welcome screen
    document.getElementById('skipWelcome').addEventListener('click', () => {
      console.log('Skipping welcome screen with default 32x32');
      this.startApp(32, 32);
    });
  }

  setDefaultSelection() {
    // Set default selection to 32x32
    const defaultPreset = document.querySelector('.canvas-preset[data-width="32"]');
    if (defaultPreset) {
      defaultPreset.classList.add('selected');
    }
    
    // Update input values
    document.getElementById('customWidth').value = this.selectedWidth;
    document.getElementById('customHeight').value = this.selectedHeight;
  }

  clearPresetSelection() {
    document.querySelectorAll('.canvas-preset').forEach(p => p.classList.remove('selected'));
  }

  updateCustomDimensions() {
    const width = parseInt(document.getElementById('customWidth').value);
    const height = parseInt(document.getElementById('customHeight').value);
    
    if (!isNaN(width) && !isNaN(height)) {
      this.selectedWidth = width;
      this.selectedHeight = height;
    }
  }

  startApp(width, height) {
    console.log(`Initializing app with canvas size: ${width}x${height}`);
    
    // Store canvas dimensions for the main app
    window.pixelCanvasWidth = width;
    window.pixelCanvasHeight = height;
    
    // Hide welcome screen with animation
    const welcomeScreen = document.getElementById('welcomeScreen');
    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.transition = 'opacity 0.3s ease-out';
    
    setTimeout(() => {
      welcomeScreen.style.display = 'none';
      
      // Initialize the main application
      this.initializeMainApp(width, height);
    }, 300);
  }

  initializeMainApp(width, height) {
    // If p5.js is available, create canvas with checkerboard background
    if (typeof createCanvas === 'function') {
      const pixelSize = 20;
      const canvas = createCanvas(width * pixelSize, height * pixelSize);
      canvas.parent('content');
      
      // Set up checkerboard background
      this.drawCheckerboard(width, height, pixelSize);
    }
    
    // Trigger any other initialization functions
    if (typeof initializeApp === 'function') {
      initializeApp(width, height);
    }
    
    console.log(`Pixel art app initialized with ${width}x${height} canvas`);
  }

  drawCheckerboard(gridWidth, gridHeight, pixelSize) {
    // Clear the canvas first
    clear();
    
    // Draw checkerboard pattern with alternating white and light gray squares
    noStroke();
    
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        // Determine if this square should be white or gray
        const isEven = (x + y) % 2 === 0;
        
        if (isEven) {
          fill(255, 255, 255); // White
        } else {
          fill(240, 240, 240); // Light gray
        }
        
        // Draw the square
        rect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }
    
    // Add subtle grid lines for pixel boundaries
    stroke(220, 220, 220);
    strokeWeight(0.5);
    
    // Draw vertical lines
    for (let x = 0; x <= gridWidth; x++) {
      line(x * pixelSize, 0, x * pixelSize, gridHeight * pixelSize);
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= gridHeight; y++) {
      line(0, y * pixelSize, gridWidth * pixelSize, y * pixelSize);
    }
  }
}

// Initialize welcome screen when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing welcome screen');
  new WelcomeScreen();
});
