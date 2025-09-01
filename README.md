# Pixel Drawing Application – Final Project

## Overview
This project is a fully featured pixel drawing application built using **p5.js**.  
It began as a simple template and has been extended with numerous advanced features,  
making it both a creative tool and a demonstration of modular programming, object orientation,  
and user-focused design.

**[ADD SCREENSHOT OF WELCOME SCREEN HERE]**

---

## Features

- **Undo & Redo System**  
  Allows users to revert or repeat their drawing actions. Built with a history stack  
  to track changes across tools.  
  **[ADD SCREENSHOT OF UNDO/REDO IN ACTION HERE]**

- **Export with Confetti Animation**  
  Users can export their artwork as an image. A confetti animation is triggered on save  
  for playful feedback.  
  **[ADD SCREENSHOT OF EXPORTED IMAGE + CONFETTI HERE]**

- **Theme Selector**  
  Multiple themes available (pink, blue, green, dark, and light). Colour contrast has been  
  adjusted for accessibility.  
  **[ADD SCREENSHOT OF DIFFERENT THEMES HERE]**

- **Zoom In/Out and Mini Preview Screen**  
  Zoom into detail while keeping an overview with a mini live preview of the canvas.  
  **[ADD SCREENSHOT OF ZOOM + MINI PREVIEW HERE]**

- **Pixel Tools**  
  Includes pixel brush, polygon, line, mirror draw, fill, eraser, and selection tools.  
  **[ADD SCREENSHOT OF TOOLBOX + TOOLS IN USE HERE]**

- **Stamp Tool**  
  Predefined pixel stamps such as stars, flowers, and icons for quick design elements.  
  **[ADD SCREENSHOT OF STAMP TOOL HERE]**

- **Custom Canvas Sizes**  
  Users can set their own canvas dimensions before starting a project.  
  **[ADD SCREENSHOT OF CUSTOM CANVAS SIZE SELECTION HERE]**

- **Responsive Design**  
  Application adapts to different screen sizes, ensuring usability across devices.  
  **[ADD SCREENSHOT OF APP ON DIFFERENT SCREEN SIZE HERE]**

---

## Technical Implementation
- Modular structure: each tool is coded in its own file (e.g., `pixelBrushTool.js`, `zoomTools.js`).
- Object-oriented approach: constructors and methods define tool behaviour.
- Use of arrays and stacks for undo/redo, as well as nested conditionals and loops  
  for advanced drawing logic.
- Accessibility improvements through theme design and interface responsiveness.

---

## Installation
1. Clone or download the repository.  
2. Open `index.html` in a modern web browser.  
3. Ensure the `p5.js` and `p5.dom.js` libraries are loaded from the `/lib` folder.  

---

## Usage
1. Select a tool from the toolbox.  
2. Draw directly on the canvas.  
3. Use undo/redo to manage mistakes.  
4. Export your artwork when complete (celebrate with confetti 🎉).  
5. Switch between themes and zoom levels to personalise your workflow.  

---

## Credits
- Built using **p5.js**.  
- Confetti animation adapted and refined from CodePen inspiration.  
- Guidance from p5.js documentation and community forums.  

---
