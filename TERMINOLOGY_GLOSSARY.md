# Canvas Drawing Studio - Complete Terminology & Glossary

## Overview

This document provides comprehensive definitions of all technical and operational terms used in Canvas Drawing Studio, organized by category for easy reference.

---

## Table of Contents

1. [Canvas Operations](#canvas-operations)
2. [Coordinate & Geometry Terms](#coordinate--geometry-terms)
3. [Programming Concepts](#programming-concepts)
4. [React & JavaScript Terms](#react--javascript-terms)
5. [Data Structure Terms](#data-structure-terms)
6. [Algorithm Terms](#algorithm-terms)
7. [User Interface Terms](#user-interface-terms)
8. [Drawing Concepts](#drawing-concepts)

---

## Canvas Operations

### Canvas
**Definition:** The rectangular drawing surface where all artwork is created.

**Properties:**
- Defined by width (columns) and height (rows)
- Contains individual cells, each holding one character
- Displayed with borders: `-` (top/bottom), `|` (left/right)
- Coordinates use 1-based indexing for users

**Example:**
```
---------
|xxx   x|
|x  x  x|
|xxxxxxx|
---------
```

---

## Coordinate & Geometry Terms

### Coordinate System
**Definition:** Mathematical grid system for positioning points on the canvas.

**Components:**
- **Origin (1,1):** Top-left corner
- **X-axis:** Horizontal, increases left to right
- **Y-axis:** Vertical, increases top to bottom
- **Coordinate Pair:** (x, y) notation

**Visual:**
```
     1   2   3   4
   ┌───┬───┬───┬───┐
 1 │   │   │   │   │
   ├───┼───┼───┼───┤
 2 │   │ * │   │   │  ← Point (2,2)
   ├───┼───┼───┼───┤
 3 │   │   │   │   │
   └───┴───┴───┴───┘
```

### X-Axis
**Definition:** Horizontal dimension of the coordinate system.

**Range:** 1 to canvas width
**Direction:** Left to right
**Increment:** Each step right increases x by 1

### Y-Axis
**Definition:** Vertical dimension of the coordinate system.

**Range:** 1 to canvas height
**Direction:** Top to bottom
**Increment:** Each step down increases y by 1

### Width
**Definition:** Number of columns in the canvas.

**Type:** Positive integer
**Valid Range:** 1 - theoretically unlimited (practically 1-200)
**User Input:** Form field or 'C' command parameter

### Height
**Definition:** Number of rows in the canvas.

**Type:** Positive integer
**Valid Range:** 1 - theoretically unlimited (practically 1-200)
**User Input:** Form field or 'C' command parameter

### Bounds/Boundaries
**Definition:** The limits of valid coordinates on the canvas.

**Horizontal Bounds:** 1 ≤ x ≤ width
**Vertical Bounds:** 1 ≤ y ≤ height
**Out of Bounds:** Any coordinate violating these rules
**Error Result:** Operation rejected with bounds error message

### Point
**Definition:** Single location on canvas specified by (x, y) coordinates.

**Examples:**
- (1, 1) = Top-left corner
- (10, 5) = Column 10, Row 5
- (width, height) = Bottom-right corner

### Endpoint
**Definition:** Either of the two points that define a line.

**Usage:** Line drawn from one endpoint to another
**Example:** In "L 1 2 6 2", endpoints are (1,2) and (6,2)

### Corner
**Definition:** Any of the four vertices of a rectangle.

**Rectangle Corners:**
- Top-left: (x1, y1)
- Top-right: (x2, y1)
- Bottom-left: (x1, y2)
- Bottom-right: (x2, y2)

**Note:** Rectangle command accepts any two corners; algorithm calculates the other two

---

## Drawing Operations

### Line
**Definition:** Straight path connecting two points on the canvas.

**Types Supported:**
- **Horizontal:** Points share same y-coordinate (y1 = y2)
- **Vertical:** Points share same x-coordinate (x1 = x2)
- **Diagonal:** NOT supported (will generate error)

**Drawing Character:** `x`

**Command:** `L x1 y1 x2 y2`

**Example:**
```
Horizontal:     Vertical:
L 1 3 5 3      L 3 1 3 5
  xxxxx          x
                 x
                 x
                 x
                 x
```

### Segment
**Definition:** Portion of a line between two points.

**Related:** All segments of a line drawn by command 'L' have length ≥ 1

### Rectangle
**Definition:** Four-sided polygon with right angles and opposite sides equal.

**In Canvas Studio:**
- **Edges:** All four borders drawn with 'x' character
- **Interior:** Left unfilled (empty spaces)
- **Orientation:** Axis-aligned (sides parallel to edges)
- **Command:** `R x1 y1 x2 y2`

**Visual Example:**
```
R 2 1 6 4 produces:
xxxxx
x   x
x   x
xxxxx
```

### Edges
**Definition:** The border lines of a rectangle.

**Components:**
- Top edge: horizontal line at minimum y
- Bottom edge: horizontal line at maximum y
- Left edge: vertical line at minimum x
- Right edge: vertical line at maximum x

**All edges drawn simultaneously** by rectangle command

---

## Fill Operations

### Fill/Bucket Fill
**Definition:** Operation that changes all connected cells of one character to a new character.

**Trigger:** Command `B x y color`
**Starting Point:** (x, y) coordinate
**Fill Character:** New character to replace original

**Algorithm:** Flood Fill (see below)

### Flood Fill
**Definition:** Algorithm that fills connected regions of identical characters.

**Type:** Depth-First Search (DFS)
**Connectivity:** 4-directional (orthogonal neighbors only)
**Directions:** Up, Down, Left, Right (no diagonals)
**Stop Condition:** 
- Boundary of canvas reached
- Different character encountered
- Already filled cell reached

**Example:**
```
Before Fill:        After B 2 2 o:
xxxxx              xxxxx
x   x              xooox
x   x              xooox
xxxxx              xxxxx
```

### Connected Region
**Definition:** Group of adjacent cells containing the same character.

**Adjacency:** 4-directional (up, down, left, right)
**NOT Adjacent:** Diagonal neighbors
**Extent:** Region continues until different character or boundary

**Example:**
```
Spaces in center form one connected region:
xxx
x x  ← These 3 spaces are one connected region
xxx
```

### Seed Point
**Definition:** Initial coordinate for flood fill operation.

**Purpose:** Starting location for fill algorithm
**Format:** (x, y) in command `B x y color`
**Impact:** Determines which connected region gets filled

### Color (Fill)
**Definition:** Single character used to replace original character.

**Constraints:**
- Exactly 1 character
- Can be any printable character
- Common choices: `*`, `#`, `.`, `o`, letters, numbers

**Examples:**
- `B 5 5 *` fills with asterisk
- `B 5 5 #` fills with hash
- `B 5 5 c` fills with letter c

---

## Command System

### Command
**Definition:** Text string representing an operation for the canvas.

**Format:** First character = operation, remaining = parameters
**Case:** Converted to uppercase (lowercase accepted)
**Parsing:** Tokenized by whitespace

**Example:** `L 1 2 5 2` is command 'L' with arguments [1, 2, 5, 2]

### Command Syntax
**Definition:** Format specification for each command type.

**Formats:**
- `C width height` - Create canvas
- `L x1 y1 x2 y2` - Line
- `R x1 y1 x2 y2` - Rectangle
- `B x y color` - Bucket fill
- `Q` - Quit

### Parameter/Argument
**Definition:** Numeric or string value passed to a command.

**Types:**
- **Numeric:** width, height, x, y coordinates
- **String:** fill color (single character)

**Example:** In `L 1 2 6 2`, parameters are 1, 2, 6, 2

### Tokenization
**Definition:** Process of breaking command string into tokens.

**Method:** Split on one or more whitespace characters
**Result:** Array of strings
**Regex:** `/\s+/` (one or more whitespace)

**Example:**
```
"  L   1   2   6   2  ".split(/\s+/)
→ ["L", "1", "2", "6", "2"]
```

---

## Validation Terms

### Validation
**Definition:** Process of checking if input meets requirements.

**Layers:**
1. Command recognition
2. Argument count
3. Type validation
4. Range/bounds checking
5. Semantic validation

### Constraint
**Definition:** Rule that input must satisfy.

**Examples:**
- Width must be positive
- Coordinates must be integers
- Fill color must be single character
- Line must be horizontal or vertical

### Error Message
**Definition:** Feedback explaining why operation failed.

**Categories:**
- Syntax errors: "Use: [format]"
- Type errors: "[Parameter] must be [type]"
- Range errors: "[Value] coordinates must be inside the canvas"
- Logic errors: "Only horizontal or vertical lines are supported"

---

## Programming Concepts

### State
**Definition:** Current data conditions of the application.

**State Variables in Canvas Studio:**
- `width`: Canvas width
- `height`: Canvas height
- `canvas`: 2D array of characters
- `command`: Current command input
- `statusMessage`: Feedback message

### State Management
**Definition:** Tracking and updating application state.

**Implementation:** React `useState` hook
**Pattern:** Current value + setter function

**Example:**
```javascript
const [width, setWidth] = useState('20');
```

### Immutability
**Definition:** Principle of not changing existing data; creating new copies instead.

**Practice:** When updating canvas:
```javascript
// Immutable (correct)
const nextCanvas = canvas.map(row => [...row]);

// Mutable (incorrect)
canvas[0][0] = 'x';  // Directly changes array
```

**Benefit:** React properly detects changes and re-renders

### Function
**Definition:** Reusable block of code that performs specific operation.

**Canvas Studio Functions:**
- `createBlankCanvas()` - Initialize empty canvas
- `drawLine()` - Render line
- `drawRectangle()` - Render rectangle
- `bucketFill()` - Fill algorithm
- `renderCanvas()` - Convert to display format

### Recursion
**Definition:** Function calling itself with different parameters.

**Used In:** Flood fill algorithm

**Example:**
```javascript
function fill(x, y) {
  if (outOfBounds || differentChar) return;
  canvas[y-1][x-1] = fillColor;
  fill(x, y-1);  // Recursive call
  fill(x, y+1);
  fill(x-1, y);
  fill(x+1, y);
}
```

**Risk:** Stack overflow on large empty regions

---

## React & JavaScript Terms

### Component
**Definition:** Reusable piece of UI with its own logic and state.

**In Canvas Studio:** `CanvasPage` is the main component
**Type:** Functional component (modern React approach)
**Returns:** JSX (rendered HTML)

### JSX
**Definition:** Syntax extension allowing HTML-like code in JavaScript.

**Example:**
```jsx
<form className="canvas-form">
  <input type="number" value={width} />
  <button type="submit">Create</button>
</form>
```

### Hook
**Definition:** Special function enabling state and lifecycle in functional components.

**Used Hook:** `useState`
**Purpose:** Manage component state
**Syntax:** `const [value, setValue] = useState(initialValue)`

### useState
**Definition:** React hook for managing state in functional components.

**Parameters:**
- Initial value (can be any type)

**Returns:**
- [currentValue, setterFunction]

**Example:**
```javascript
const [command, setCommand] = useState('');
// Set value: setCommand('L 1 2 5 2')
```

### Re-render
**Definition:** Process where React updates component display based on state changes.

**Trigger:** State change via setter function
**Process:** Component function called again, JSX evaluated, DOM updated
**Frequency:** Happens after every state modification

### Event Handler
**Definition:** Function responding to user interaction.

**Examples in Canvas Studio:**
- `onChange` on input fields
- `onSubmit` on forms
- `onClick` on buttons

### Form
**Definition:** Collection of input fields for user data entry.

**Canvas Studio Forms:**
1. **Creation Form:** Width, Height, Create button
2. **Command Form:** Command input, Run button

### Input Field
**Definition:** Interactive element for user to enter data.

**Types:**
- Text: General input
- Number: Numeric values only

**In Canvas:** Width, Height, Command fields

---

## Data Structure Terms

### Array
**Definition:** Ordered collection of elements accessible by index.

**1D Array:**
```javascript
['x', 'x', 'x', ' ', ' ']  // Single row
```

**2D Array:**
```javascript
[
  ['x', 'x', 'x'],
  ['x', ' ', 'x'],
  ['x', 'x', 'x']
]
```

### 2D Array
**Definition:** Array containing arrays; simulates two-dimensional table.

**Accessing Elements:**
```javascript
array[row][column]    // array[y-1][x-1] for canvas
```

**Canvas Storage:**
- Outer array: rows (indexed 0 to height-1)
- Inner arrays: columns (indexed 0 to width-1)

### Index
**Definition:** Numeric position of element in array.

**Range:** 
- **User-facing:** 1 to n (1-based)
- **Programming:** 0 to n-1 (0-based)

**Conversion:** User index = Array index + 1

### Element
**Definition:** Individual item stored in array.

**Canvas Context:** Single character at position [y-1][x-1]

### Row
**Definition:** Horizontal line of elements; inner array in 2D structure.

**Canvas Context:** Elements from x=1 to x=width at specific y
**Index:** Outer array index (0-based)

### Column
**Definition:** Vertical line of elements.

**Canvas Context:** Elements at specific x across all y values
**Index:** Inner array index (0-based)

---

## Algorithm Terms

### Algorithm
**Definition:** Step-by-step procedure for solving problem.

**Canvas Algorithms:**
1. Line Drawing
2. Rectangle Drawing
3. Flood Fill

### Line Drawing Algorithm
**Definition:** Procedure for rendering line between two points.

**Specifics:**
- **For horizontal:** Iterate x from min to max, keep y constant
- **For vertical:** Iterate y from min to max, keep x constant
- **Complexity:** Linear time O(n)

### Rectangle Drawing Algorithm
**Definition:** Procedure for rendering rectangle outline.

**Specifics:**
- Calculate min/max for x and y
- Draw 4 edges independently
- **Complexity:** O(2×width + 2×height)

### Flood Fill Algorithm
**Definition:** Algorithm filling connected region with new character.

**Type:** Depth-First Search (DFS)
**Connectivity:** 4-directional
**Base Cases:**
- Out of bounds
- Different character
- Already processed

**Recursion:** Four recursive calls (up, down, left, right)

### Depth-First Search (DFS)
**Definition:** Graph traversal algorithm exploring as far as possible along each branch.

**In Flood Fill:**
- Explores one direction completely before backtracking
- Uses function call stack for tracking
- Visits each cell once

### Boundary Validation
**Definition:** Checking if coordinate is within canvas limits.

**Logic:**
```javascript
function insideCanvas(x, y) {
  return y >= 1 && y <= height && x >= 1 && x <= width;
}
```

### Complexity
**Definition:** Measure of algorithm efficiency.

**Time Complexity:** How long algorithm takes
**Space Complexity:** How much memory algorithm uses

**Examples:**
- Create canvas: O(w × h) time
- Draw line: O(max length) time
- Flood fill: O(number of cells filled) time

---

## User Interface Terms

### Form
**Definition:** Collection of input controls for user data.

**Elements:**
- Labels (descriptive text)
- Input fields
- Buttons

### Button
**Definition:** Clickable element triggering action.

**Canvas Buttons:**
- Create Canvas
- Quit
- Run Command

### Label
**Definition:** Text describing associated input field.

**Examples:** "Width", "Height", "Enter command"

### Placeholder
**Definition:** Example text shown in empty input field.

**Canvas Example:** "e.g. L 1 2 6 2" in command field

### Status Message
**Definition:** Text feedback about operation result.

**Examples:**
- Success: "Canvas created: 20 x 4"
- Error: "Line coordinates must be inside the canvas"
- Notification: "Line drawn from (1,1) to (6,1)"

### Display Area
**Definition:** Region showing rendered canvas.

**Format:** ASCII art with borders
**Element:** `<pre>` tag with monospace font

### Pre-formatted Text
**Definition:** Text preserving spaces and line breaks as-is.

**HTML Element:** `<pre>`
**CSS:** Font-family should be monospace
**Purpose:** Enables precise ASCII art alignment

---

## Drawing Concepts

### ASCII
**Definition:** American Standard Code for Information Interchange; character encoding.

**Relevance:** Canvas uses ASCII characters for drawing
**Common Characters:** letters, numbers, punctuation
**Canvas Characters:**
- `x` for lines and rectangles
- `-` for horizontal borders
- `|` for vertical borders
- ` ` (space) for empty areas
- Any character for fills

### ASCII Art
**Definition:** Visual art created using text characters.

**Canvas Studio Application:** Creates ASCII art by drawing with characters

### Character
**Definition:** Single symbol from text encoding (letter, number, symbol, space).

**In Canvas:**
- Minimum unit of drawing
- One character per cell
- Can be changed by fill operation

### Border
**Definition:** Frame around canvas edge.

**Components:**
- Top: `-` characters
- Bottom: `-` characters
- Left: `|` character (each row)
- Right: `|` character (each row)

**Purpose:** Visual boundary indication

### Interior
**Definition:** Area inside canvas borders.

**Initial State:** Filled with space characters
**Modifiable:** Via line, rectangle, and fill operations

---

## Command-Specific Terms

### C Command (Create)
**Definition:** Initialize new blank canvas.

**Syntax:** `C width height`
**Parameters:** Two positive integers
**Effect:** Replaces any existing canvas
**Alternative:** Use form fields and button

### L Command (Line)
**Definition:** Draw straight line between two points.

**Syntax:** `L x1 y1 x2 y2`
**Constraints:** Horizontal or vertical only
**Character Used:** `x`

### R Command (Rectangle)
**Definition:** Draw rectangle outline.

**Syntax:** `R x1 y1 x2 y2`
**Interpretation:** Any two opposite corners
**Character Used:** `x` for all edges

### B Command (Bucket Fill)
**Definition:** Fill connected region with character.

**Syntax:** `B x y color`
**Algorithm:** Flood fill
**Character Used:** Specified by user

### Q Command (Quit)
**Definition:** Clear canvas and reset application.

**Syntax:** `Q`
**Effect:** Empties all state
**Alternative:** Click "Quit" button

---

## Error Concepts

### Validation Error
**Definition:** Input fails to meet specified requirements.

**Types:**
- Argument count mismatch
- Non-numeric numeric argument
- Out-of-bounds coordinate
- Invalid character

### Bounds Error
**Definition:** Coordinate outside valid canvas range.

**Message:** "[Operation] coordinates must be inside the canvas"
**Cause:** x < 1, x > width, y < 1, or y > height

### Type Error
**Definition:** Value has wrong data type.

**Example:** Text where number expected
**Message:** "[Parameter] must be numbers"

### Logic Error
**Definition:** Operation violates semantic rules.

**Example:** "Only horizontal or vertical lines are supported"
**Cause:** Diagonal line attempted

---

## Performance Terms

### Performance
**Definition:** Speed and efficiency of operations.

**Factors:**
- Canvas size (number of cells)
- Fill region size
- Browser capabilities

### Optimization
**Definition:** Techniques to improve performance.

**Opportunities:**
- Memoization of canvas rendering
- Switch from recursion to queue-based fill
- Use Canvas API instead of ASCII

### Stack Overflow
**Definition:** Error when call stack exceeds limit.

**Risk:** Large empty region fill with current recursive approach
**Mitigation:** Keep canvas sizes reasonable
**Solution:** Iterative flood fill implementation

---

## Related Concepts

### Monospace Font
**Definition:** Font where each character occupies equal width.

**Examples:** Courier New, Monaco, Menlo
**Purpose:** Ensures ASCII art alignment
**Requirement:** Essential for proper canvas display

### Grid
**Definition:** Regular pattern of horizontal and vertical lines.

**Canvas Grid:**
- Columns run vertically (x-axis)
- Rows run horizontally (y-axis)
- Each intersection is cell (x, y)

### Cell
**Definition:** Individual position in grid.

**Identification:** (x, y) coordinates
**Content:** Single character
**Modifiable:** Via drawing operations

---

## Summary by Category

### User-Level Concepts
- Canvas, Width, Height, Coordinate System
- Commands: C, L, R, B, Q
- Operations: Create, Draw Line, Draw Rectangle, Fill
- Status Messages, Error Handling

### Technical Concepts
- 2D Array, State Management, Immutability
- React Components, JSX, Hooks
- Algorithms: Line Drawing, Rectangle Drawing, Flood Fill
- Validation, Input Parsing

### Advanced Concepts
- Recursion, Call Stack
- DFS Algorithm, Connectivity
- Complexity Analysis
- Performance Optimization

---

*Terminology Guide Version 1.0*
*Complete Reference for Canvas Drawing Studio*
*Last Updated: 2024*
