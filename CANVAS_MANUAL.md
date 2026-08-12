# Canvas Drawing Studio - User Manual

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Interface Overview](#user-interface-overview)
4. [Canvas Operations](#canvas-operations)
5. [Command Reference](#command-reference)
6. [Technical Glossary](#technical-glossary)
7. [Examples and Tutorials](#examples-and-tutorials)
8. [Troubleshooting](#troubleshooting)

---

## Introduction

**Canvas Drawing Studio** is a web-based drawing application built with React that allows users to create and manipulate simple ASCII art on a rectangular canvas. The application supports drawing lines, rectangles, and filling areas with characters.

### Key Features
- Create blank canvases of custom dimensions
- Draw horizontal and vertical lines
- Draw rectangles with outlined borders
- Fill areas with bucket fill functionality (flood fill algorithm)
- Command-line interface for precise control
- Real-time visual feedback and status messages

---

## Getting Started

### Installation and Setup

1. **Navigate to the project directory:**
   ```bash
   cd canvas
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The application will automatically open in your browser at `http://localhost:3000`

### Starting Your First Canvas

1. **Set Canvas Dimensions:**
   - Enter the desired **Width** (number of columns)
   - Enter the desired **Height** (number of rows)
   - Click **"Create Canvas"** button

2. **View Your Blank Canvas:**
   - The canvas appears as a bordered rectangle with empty spaces
   - The canvas is ready for drawing operations

---

## User Interface Overview

### Main Components

#### Canvas Header
- **Title:** "Canvas Drawing Studio"
- **Subtitle:** Brief description of available features
- Provides visual context for the application

#### Creation Form
| Field | Description |
|-------|-------------|
| **Width** | Positive integer specifying canvas column count |
| **Height** | Positive integer specifying canvas row count |
| **Create Canvas** | Button to initialize a blank canvas |
| **Quit** | Button to clear canvas and reset all fields |

#### Command Input Form
- **Appears only when a canvas exists**
- **Text Field:** Accepts command strings with spaces
- **Placeholder:** Shows example command format (e.g., `L 1 2 6 2`)
- **Run Command:** Submits the command for execution
- **Auto-focus:** Input field automatically gains focus after canvas creation

#### Canvas Display Area
- **ASCII Grid:** Shows the current canvas state
- **Border Characters:** `-` for horizontal edges, `|` for vertical edges
- **Drawing Characters:** `x` for lines and rectangles, custom characters for fills
- **Empty Spaces:** Represented by blank characters (space character)

#### Status Message Area
- **Feedback Display:** Shows operation results or error messages
- **Updates Dynamically:** Changes after each command execution
- **Examples:**
  - "Canvas created: 20 x 4"
  - "Line drawn from (1, 1) to (6, 1)"
  - "Error: Unsupported command"

---

## Canvas Operations

### 1. Creating a Canvas

**Purpose:** Initialize a blank drawing area

**Steps:**
1. Enter a positive integer for Width (1-1000 recommended)
2. Enter a positive integer for Height (1-1000 recommended)
3. Click "Create Canvas" button
4. A bordered rectangular area appears with empty interior

**Coordinate System:**
- Origin (1, 1) is at the top-left corner
- X-axis runs horizontally (left to right)
- Y-axis runs vertically (top to bottom)

### 2. Drawing Lines

**Purpose:** Create horizontal or vertical lines

**Syntax:** `L x1 y1 x2 y2`

**Parameters:**
- `x1, y1`: Starting point coordinates (positive integers)
- `x2, y2`: Ending point coordinates (positive integers)
- Both points must be on the same row (y1 = y2) or column (x1 = x2)

**Character Used:** `x`

**Example:** `L 2 3 8 3` draws a horizontal line on row 3 from column 2 to column 8

**Constraints:**
- Cannot draw diagonal lines
- Coordinates must be within canvas boundaries
- Starting and ending points must align horizontally or vertically

### 3. Drawing Rectangles

**Purpose:** Create outlined rectangle shapes

**Syntax:** `R x1 y1 x2 y2`

**Parameters:**
- `x1, y1`: First corner coordinates (positive integers)
- `x2, y2`: Opposite corner coordinates (positive integers)
- Corners can be in any order (algorithm determines min/max)

**Character Used:** `x` for all edges

**Example:** `R 2 2 8 5` draws a rectangle from top-left (2,2) to bottom-right (8,5)

**What It Draws:**
- Top and bottom horizontal edges
- Left and right vertical edges
- Open interior (not filled)

**Constraints:**
- All coordinates must be within canvas boundaries
- Both x-coordinates and both y-coordinates must differ for a valid rectangle

### 4. Bucket Fill (Flood Fill)

**Purpose:** Fill connected regions with a specified character

**Syntax:** `B x y color`

**Parameters:**
- `x, y`: Starting point for fill (positive integers)
- `color`: Single character to use for filling (letter, number, symbol)

**Algorithm:** Flood Fill (4-directional)
- Fills the character at (x, y) and all adjacent cells with the same original character
- Spreads in four directions: up, down, left, right (not diagonal)
- Stops when encountering different characters or canvas boundaries

**Example:** `B 5 3 o` fills the region containing (5,3) with the character 'o'

**Constraints:**
- Fill coordinate must be within canvas boundaries
- Color must be exactly one character
- Only fills contiguous regions of identical characters

### 5. Clearing/Resetting

**Purpose:** Remove all drawings and reset canvas

**Methods:**
1. **Using Command:** `Q` (quit command)
2. **Using Button:** Click "Quit" button in the interface

**Effect:**
- Canvas state is cleared
- Width and height fields are emptied
- Ready for new canvas creation

---

## Command Reference

### Supported Commands

| Command | Syntax | Purpose | Example |
|---------|--------|---------|---------|
| **C** | `C width height` | Create/recreate canvas | `C 30 10` |
| **L** | `L x1 y1 x2 y2` | Draw line | `L 1 5 10 5` |
| **R** | `R x1 y1 x2 y2` | Draw rectangle | `R 3 2 15 8` |
| **B** | `B x y color` | Bucket fill | `B 7 4 *` |
| **Q** | `Q` | Quit/clear canvas | `Q` |

### Command Validation

The application validates each command and provides error messages:

**Common Validation Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Use: L x1 y1 x2 y2" | Incorrect argument count | Provide exactly 4 arguments for L command |
| "Line coordinates must be numbers" | Non-numeric input | Use only integers for coordinates |
| "Only horizontal or vertical lines are supported" | Diagonal line attempted | Ensure either x1=x2 or y1=y2 |
| "Coordinates must be inside the canvas" | Out-of-bounds values | Use values within canvas dimensions |
| "Color must be a single character" | Multi-character color | Provide exactly one character |
| "Unsupported command" | Invalid command letter | Use only C, L, R, B, or Q |

---

## Technical Glossary

### Canvas Architecture

**State Management**
- **Canvas State:** 2D array of characters representing the drawing surface
- **Immutability:** React creates new arrays instead of modifying existing ones
- **React Hooks:** `useState` manages width, height, canvas, command, and status

**Data Structures**

| Term | Definition |
|------|-----------|
| **2D Array** | Array of arrays; each inner array represents a row |
| **Character Grid** | Canvas represented as matrix of single characters |
| **Coordinate Pair** | (x, y) tuple where x is column, y is row |

### Drawing Algorithms

**Line Drawing**
- **Type:** Bresenham-style simplified algorithm
- **Implementation:** For horizontal/vertical lines only
- **Logic:** Iterates through all points between (x1, y1) and (x2, y2), marking each with 'x'

**Rectangle Drawing**
- **Type:** Edge-based rendering
- **Implementation:** Draws four edges independently
- **Logic:** 
  - Calculates min/max of x and y coordinates
  - Draws top edge: all points at minY from minX to maxX
  - Draws bottom edge: all points at maxY from minX to maxX
  - Draws left edge: all points at minX from minY to maxY
  - Draws right edge: all points at maxX from minY to maxY

**Flood Fill (Bucket Fill)**
- **Type:** Depth-first recursive algorithm
- **Connectivity:** 4-directional (orthogonal neighbors only)
- **Process:**
  1. Starts at seed point (x, y)
  2. Checks if point is within bounds and has original character
  3. Replaces character with fill color
  4. Recursively fills neighbors in 4 directions
- **Base Cases:** Out of bounds, different character, or already filled
- **Complexity:** O(n*m) where n and m are canvas dimensions

### Coordinate System

**Origin:** (1, 1) at top-left corner

**Axes:**
- **X-Axis:** Horizontal, increases left to right (columns)
- **Y-Axis:** Vertical, increases top to bottom (rows)

**Internal Representation:**
- Internally uses 0-based indexing: array[y-1][x-1]
- User-facing commands use 1-based indexing for intuitiveness

**Boundary Conditions:**
- Valid X: 1 ≤ x ≤ width
- Valid Y: 1 ≤ y ≤ height

### React Components

**CanvasPage Component**
- **Type:** Functional React component
- **Hook:** Uses `useState` for state management
- **Re-renders:** Whenever state changes
- **Key Methods:**
  - `handleCreate()`: Initializes canvas
  - `handleQuit()`: Clears canvas
  - `handleCommandSubmit()`: Parses and executes commands
  - `drawLine()`: Renders lines
  - `drawRectangle()`: Renders rectangles
  - `bucketFill()`: Implements flood fill
  - `renderCanvas()`: Converts 2D array to visual representation

### Display Rendering

**Canvas Visualization**
- **Format:** `<pre>` HTML element (preserves spacing)
- **Structure:**
  ```
  ----------  (top border, - repeated width+2 times)
  |xxxxxxxx|  (rows with | borders on sides)
  |        |  (empty areas shown as spaces)
  ----------  (bottom border)
  ```

**Character Encoding:**
- Space (ASCII 32): Empty canvas area
- `x` (ASCII 120): Lines and rectangle edges
- `|` (ASCII 124): Vertical borders
- `-` (ASCII 45): Horizontal borders
- Any single character: Fill results

### Input Validation

**Tokenization**
- **Method:** `split(/\s+/)` splits on one or more whitespace characters
- **Result:** Array of tokens (command + arguments)

**Type Coercion**
- **Number Conversion:** `Number(token)` converts string to numeric value
- **Validation:** `Number.isNaN()` checks for invalid conversions

**Range Validation**
- **Positive Check:** Value > 0 for dimensions
- **Bounds Check:** Coordinates within [1, width] × [1, height]

---

## Examples and Tutorials

### Tutorial 1: Creating Your First Drawing

**Goal:** Draw a simple house outline

**Steps:**

1. **Create Canvas:**
   - Width: `20`
   - Height: `10`
   - Click "Create Canvas"

2. **Draw Base (horizontal line):**
   - Command: `L 3 8 18 8`
   - Result: Foundation line

3. **Draw Roof Left Side:**
   - Command: `L 3 8 10 3`
   - Note: Diagonal lines aren't supported, so use rectangle instead

4. **Draw House Rectangle:**
   - Command: `R 3 5 18 8`
   - Result: House body outline

5. **Draw Door Rectangle:**
   - Command: `R 9 6 11 8`
   - Result: Door frame

6. **Fill Door:**
   - Command: `B 10 7 d`
   - Result: Door filled with 'd' character

### Tutorial 2: Creating a Pattern

**Goal:** Create a checkerboard-like pattern

**Steps:**

1. Create Canvas: `C 16 8`
2. Draw vertical lines every 2 spaces:
   - `L 2 1 2 8`
   - `L 4 1 4 8`
   - `L 6 1 6 8`
   - Continue pattern...
3. Draw horizontal lines every 2 spaces:
   - `L 1 2 16 2`
   - `L 1 4 16 4`
   - Continue pattern...

### Tutorial 3: Filling Shapes

**Goal:** Create and fill rectangles

**Steps:**

1. Create Canvas: `C 25 12`
2. Draw Rectangle: `R 3 2 10 5`
3. Fill Interior: `B 6 3 #`
4. Draw another Rectangle: `R 15 2 22 5`
5. Fill with different character: `B 18 3 *`

**Result:** Two rectangles filled with different patterns

---

## Troubleshooting

### Common Issues and Solutions

**Issue: "Unsupported command" message**
- **Cause:** Typo in command letter or unrecognized command
- **Solution:** 
  - Verify command is one of: C, L, R, B, Q
  - Check first character is uppercase
  - Example: `l 1 1 5 1` → Use `L 1 1 5 1`

**Issue: "Coordinates must be numbers"**
- **Cause:** Non-numeric value in coordinate positions
- **Solution:**
  - Ensure all x, y coordinates are integers
  - Remove spaces from numbers
  - Example: `L 1 1 5.5 1` → Use `L 1 1 5 1`

**Issue: "Coordinates must be inside the canvas"**
- **Cause:** Coordinates exceed canvas dimensions
- **Solution:**
  - Check canvas width and height
  - Verify x values are between 1 and width
  - Verify y values are between 1 and height
  - Example: For 20×4 canvas, `L 1 1 25 1` → Use `L 1 1 20 1`

**Issue: "Only horizontal or vertical lines are supported"**
- **Cause:** Attempted to draw diagonal line
- **Solution:**
  - Use rectangle command for diagonal-like shapes
  - Or draw separate horizontal and vertical lines
  - Example: `L 1 1 5 5` (diagonal) → Use `R 1 1 5 5` (rectangle)

**Issue: "Color must be a single character"**
- **Cause:** Fill color contains multiple characters
- **Solution:**
  - Use exactly one character for fill
  - Example: `B 5 5 fill` → Use `B 5 5 f`

**Issue: Canvas not responding to commands**
- **Cause:** Command input might not have focus
- **Solution:**
  - Click in the command input field
  - The field should have auto-focus, but manual click works
  - Try pressing Enter after typing command

**Issue: Fill operation fills entire canvas**
- **Cause:** Starting point is in a large empty area
- **Solution:**
  - This is normal behavior for flood fill
  - Fill starts at one point and expands to all connected cells
  - To fill specific area, draw boundaries first with lines or rectangles

**Issue: "No fill needed - area already has this color"**
- **Cause:** Fill color same as current character at that position
- **Solution:**
  - Use a different character for fill
  - Example: `B 5 5 x` when area already has 'x' → Use `B 5 5 o`

---

## Technical Requirements

### Browser Support
- Modern browsers supporting ES6+
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### System Requirements
- Node.js 14.0.0 or higher
- npm 6.0.0 or higher
- Minimum 50MB disk space for dependencies

### Dependencies
- React 18.2.0
- React DOM 18.2.0
- React Scripts 5.0.1

---

## Performance Considerations

### Recommended Canvas Sizes
- **Optimal:** 20-50 width, 10-25 height
- **Maximum:** 200+ (may cause slowdown on older machines)
- **Minimum:** 1×1 (though not practically useful)

### Performance Notes
- Flood fill on very large empty canvases may be slow
- Each command creates new array (immutability overhead)
- Re-rendering canvas view happens after every operation

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Submit Command | Enter or Click "Run Command" |
| Focus Command Input | Auto-focus after canvas creation |
| Create New Canvas | Alt+C (browser dependent) |

---

## Keyboard Input

- **Command Field:** Accepts alphanumeric characters and spaces
- **Width/Height Fields:** Accept positive integers
- **Auto-Capitalization:** Commands are converted to uppercase (e.g., 'l' becomes 'L')

---

## Advanced Tips

1. **Combining Shapes:** Use different characters for each fill to distinguish shapes
2. **Pattern Creation:** Create grids by drawing lines at regular intervals
3. **Complex Drawings:** Break into multiple rectangles and lines
4. **Text Art:** Use characters like `*`, `#`, `o`, `.` for creative effects
5. **Clearing Regions:** Fill with spaces to erase areas (fill with ' ')

---

## Version Information

- **Application Name:** Canvas Drawing Studio
- **Version:** 0.1.0
- **Build System:** Create React App
- **Last Updated:** 2024

---

## Support and Feedback

For issues or feature requests, refer to the project documentation or source code repository.

**Key Files:**
- `src/components/CanvasPage.js` - Main component implementation
- `src/App.js` - Application root
- `src/App.css` - Styling

---

*End of Manual*
