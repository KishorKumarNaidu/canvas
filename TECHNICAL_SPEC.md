# Canvas Drawing Studio - Technical Specification

## Document Information

- **Project:** Canvas Drawing Studio
- **Version:** 0.1.0
- **Platform:** React 18.2.0
- **Status:** Development
- **Date:** 2024

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Specification](#component-specification)
3. [Data Models](#data-models)
4. [Algorithm Specifications](#algorithm-specifications)
5. [API Reference](#api-reference)
6. [State Management](#state-management)
7. [Rendering Pipeline](#rendering-pipeline)
8. [Input Validation](#input-validation)
9. [Performance Metrics](#performance-metrics)
10. [Testing Strategy](#testing-strategy)

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────┐
│       Browser Environment               │
│  ┌───────────────────────────────────┐  │
│  │  React Application (App.js)       │  │
│  └───────────────────────────────────┘  │
│            ↓                             │
│  ┌───────────────────────────────────┐  │
│  │  CanvasPage Component             │  │
│  │  - State Management               │  │
│  │  - Command Processing             │  │
│  │  - Rendering Logic                │  │
│  └───────────────────────────────────┘  │
│            ↓                             │
│  ┌───────────────────────────────────┐  │
│  │  DOM (HTML/CSS)                   │  │
│  │  - Canvas Display                 │  │
│  │  - Form Elements                  │  │
│  │  - Status Messages                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Design Patterns

1. **Functional Component Pattern:** All components are functional, not class-based
2. **Hooks Pattern:** Uses `useState` for state management
3. **Command Pattern:** User input parsed and executed as commands
4. **Immutable Updates:** Creates new arrays instead of mutating existing state
5. **Pure Functions:** Rendering functions are pure (no side effects)

---

## Component Specification

### CanvasPage Component

**File Path:** `src/components/CanvasPage.js`

**Component Type:** Functional React Component

**Purpose:** Main application component handling canvas creation, drawing, and interaction

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| None | - | - | - | Component accepts no props |

### State Variables

```javascript
const [width, setWidth] = useState('20');
const [height, setHeight] = useState('4');
const [canvas, setCanvas] = useState([]);
const [command, setCommand] = useState('');
const [statusMessage, setStatusMessage] = useState('');
```

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| `width` | String | '20' | Canvas width in columns |
| `height` | String | '4' | Canvas height in rows |
| `canvas` | Array[Array[String]] | [] | 2D array of characters |
| `command` | String | '' | Current command string |
| `statusMessage` | String | '' | Feedback to user |

---

## Data Models

### Canvas Data Structure

**Type:** `Array<Array<String>>`

**Structure:**
```javascript
[
  ['x', 'x', 'x', '·', '·', '·'],  // Row 1
  ['x', ' ', 'x', '·', '·', '·'],  // Row 2
  ['x', 'x', 'x', '·', '·', '·'],  // Row 3
]
```

**Properties:**
- 2-dimensional array
- Outer array = rows (indexed 0 to height-1)
- Inner arrays = columns (indexed 0 to width-1)
- Each element is a single character string

**Access Pattern:**
```javascript
const element = canvas[y - 1][x - 1];  // Note: 1-based to 0-based conversion
```

### Coordinate System

**Definition:** 1-based indexing user-facing

```
User-Facing Coordinates (1-based):
(1,1) ... (width,1)
...       ...
(1,height) ... (width,height)

Internal Array Indexing (0-based):
[0][0] ... [0][width-1]
...       ...
[height-1][0] ... [height-1][width-1]
```

**Conversion Formulas:**
- From user to internal: `[y-1][x-1]`
- From internal to user: `[arrayY+1, arrayX+1]`

---

## Algorithm Specifications

### 1. Blank Canvas Creation

**Function:** `createBlankCanvas(w, h)`

**Input:**
- `w: number` - Width (positive integer)
- `h: number` - Height (positive integer)

**Output:**
- `Array<Array<String>>` - 2D array filled with space characters

**Algorithm:**
```
1. Create outer array with length h
2. For each row (0 to h-1):
   a. Create inner array with length w
   b. Fill each cell with space character ' '
3. Return complete 2D array
```

**Time Complexity:** O(w × h)
**Space Complexity:** O(w × h)

**Implementation:**
```javascript
Array.from({ length: h }, () => Array.from({ length: w }, () => ' '))
```

### 2. Line Drawing Algorithm

**Function:** `drawLine(x1, y1, x2, y2)`

**Constraints:**
- Only horizontal (y1 === y2) or vertical (x1 === x2) lines
- Both points must be inside canvas
- Modifies canvas state

**Horizontal Line Algorithm:**
```
1. Validate both points within canvas
2. If y1 !== y2 and x1 !== x2:
   - Error: Only horizontal/vertical lines allowed
   - Return
3. If y1 === y2 (horizontal):
   a. startX = min(x1, x2)
   b. endX = max(x1, x2)
   c. For each x from startX to endX:
      - canvas[y1-1][x-1] = 'x'
4. Else if x1 === x2 (vertical):
   a. startY = min(y1, y2)
   b. endY = max(y1, y2)
   c. For each y from startY to endY:
      - canvas[y-1][x1-1] = 'x'
```

**Time Complexity:** O(max(|x2-x1|, |y2-y1|))
**Space Complexity:** O(1) excluding output

### 3. Rectangle Drawing Algorithm

**Function:** `drawRectangle(x1, y1, x2, y2)`

**Process:**
```
1. Validate both corners within canvas
2. Calculate bounds:
   - minX = min(x1, x2)
   - maxX = max(x1, x2)
   - minY = min(y1, y2)
   - maxY = max(y1, y2)
3. Draw top edge:
   - For x from minX to maxX: canvas[minY-1][x-1] = 'x'
4. Draw bottom edge:
   - For x from minX to maxX: canvas[maxY-1][x-1] = 'x'
5. Draw left edge:
   - For y from minY to maxY: canvas[y-1][minX-1] = 'x'
6. Draw right edge:
   - For y from minY to maxY: canvas[y-1][maxX-1] = 'x'
```

**Special Case:** Single point or line rectangle draws appropriately

**Time Complexity:** O(2×(maxX-minX) + 2×(maxY-minY))
**Space Complexity:** O(1) excluding output

### 4. Flood Fill Algorithm (Bucket Fill)

**Function:** `bucketFill(x, y, color)`

**Type:** Depth-First Search (DFS) with 4-directional connectivity

**Algorithm:**
```
1. Get originalChar = canvas[y-1][x-1]
2. If originalChar === color:
   - No change needed, return
3. Define recursive fill(fillX, fillY):
   a. Boundary checks:
      - If fillY < 1 or fillY > height: return
      - If fillX < 1 or fillX > width: return
   b. Character check:
      - If canvas[fillY-1][fillX-1] ≠ originalChar: return
   c. Fill current cell:
      - canvas[fillY-1][fillX-1] = color
   d. Recursive calls (4-directional):
      - fill(fillX, fillY - 1)  // Up
      - fill(fillX, fillY + 1)  // Down
      - fill(fillX - 1, fillY)  // Left
      - fill(fillX + 1, fillY)  // Right
4. Call fill(x, y)
```

**Connectivity:** 4-directional (no diagonal)

**Time Complexity:** O(n) where n = number of connected cells
**Space Complexity:** O(h) call stack depth (worst case)

**Stack Overflow Risk:** Large empty regions may exceed call stack
**Mitigation:** Keep canvas sizes reasonable (< 200×200)

---

## API Reference

### Core Functions

#### createBlankCanvas(width, height)
- **Returns:** `Array<Array<String>>`
- **Creates:** Empty canvas with specified dimensions
- **Used by:** handleCreate, command handler for 'C'

#### drawLine(x1, y1, x2, y2)
- **Returns:** void (updates state)
- **Modifies:** canvas state
- **Validates:** Coordinate bounds, line direction
- **Updates:** statusMessage

#### drawRectangle(x1, y1, x2, y2)
- **Returns:** void (updates state)
- **Modifies:** canvas state
- **Validates:** Coordinate bounds
- **Updates:** statusMessage

#### bucketFill(x, y, color)
- **Returns:** void (updates state)
- **Modifies:** canvas state
- **Validates:** Coordinate bounds, fill color validity
- **Updates:** statusMessage
- **Side Effect:** May affect large regions

#### insideCanvas(x, y)
- **Returns:** `boolean`
- **Purpose:** Boundary validation helper
- **Logic:** Checks if (x,y) within [1,width] × [1,height]

#### renderCanvas()
- **Returns:** `JSX.Element | null`
- **Renders:** ASCII art representation
- **Format:** Bordered rectangle with content
- **Used by:** Render method

---

## State Management

### State Update Patterns

#### Immutable Array Updates
```javascript
// Correct: Creates new array
const nextCanvas = canvas.map((row) => [...row]);

// Incorrect: Mutates original
canvas[y][x] = 'x';  // Don't do this!
```

#### State Transitions

**Canvas Creation:**
```
[] → [[' ', ' ', ...], [' ', ' ', ...], ...] → Render
```

**Drawing Operation:**
```
[canvas] → [modified canvas] → Render → Update message
```

**State Reset:**
```
[full state] → ['', '', []] → Render empty
```

### State Persistence

- **Current:** State only persists during session
- **Persistence:** Could implement localStorage for save/load
- **Limitations:** No built-in save/export feature

---

## Rendering Pipeline

### Render Process Flow

```
User Action
    ↓
State Change
    ↓
Component Re-render
    ↓
renderCanvas() called
    ↓
2D array → ASCII representation
    ↓
JSX elements created
    ↓
DOM updated
    ↓
Browser displays
```

### Canvas Display Format

**Output Structure:**
```
----------        (top border)
|xxxxxxxx|        (content rows)
|        |
|      xx|
----------        (bottom border)
```

**Generation Logic:**
1. Calculate top/bottom borders: `-` repeated (width + 2) times
2. Map each row to: `'|' + row.join('') + '|'`
3. Wrap in `<pre>` tag for formatting preservation

**HTML Element:** `<pre className="canvas-grid">`

**CSS Considerations:**
- Monospace font required for alignment
- Preserve whitespace and line breaks
- Fixed font size for consistency

---

## Input Validation

### Command Parsing

**Tokenization:**
```javascript
const tokens = command.trim().split(/\s+/);
const cmd = tokens[0].toUpperCase();
```

**Token Structure:**
- `tokens[0]` = Command character (converted to uppercase)
- `tokens[1..n]` = Arguments

### Validation Strategy

**Step 1: Command Recognition**
- Check if tokens[0] is in ['C', 'L', 'R', 'B', 'Q']
- Error if unknown command

**Step 2: Argument Count Validation**
- 'C': Requires exactly 2 arguments
- 'L': Requires exactly 4 arguments
- 'R': Requires exactly 4 arguments
- 'B': Requires exactly 3 arguments
- 'Q': Requires 0 arguments

**Step 3: Type Validation**
- Numeric arguments: `Number(token)` → check `!Number.isNaN()`
- String arguments: No validation (accepted as-is)

**Step 4: Range Validation**
- Width/Height: Must be positive (> 0)
- Coordinates: Must be within canvas bounds
- Color: Must be single character (`.length === 1`)

**Step 5: Semantic Validation**
- Line: x1=x2 or y1=y2 (no diagonal)
- Fill: Original char ≠ fill color (avoid no-op)

### Error Handling

**Pattern:** Validate → Error on failure → Return (no state change)

**Error Messages Provided:**
```javascript
'Use: [Command Syntax]'
'[Parameter] must be [constraint]'
'[Action] coordinates must be inside the canvas'
'Only horizontal or vertical lines are supported'
'Unsupported command. Supported commands: C, L, R, B, Q.'
```

---

## Performance Metrics

### Benchmarks

**Operation Timing (estimated, on modern browser):**

| Operation | Canvas Size | Time | Notes |
|-----------|-------------|------|-------|
| Create blank | 50×25 | < 1ms | Array allocation |
| Draw line | 50×25 | < 1ms | Linear iteration |
| Draw rectangle | 50×25 | < 1ms | Fixed edge count |
| Fill (small) | 50×25, 5 cells | < 1ms | Small region |
| Fill (large) | 50×25, 500 cells | 1-5ms | Depends on shape |
| Fill (full) | 50×25 | 5-10ms | All cells identical |
| Render | 50×25 | < 2ms | String + JSX creation |

### Scalability

**Recommended Limits:**
- Canvas Size: 200×200 (40K cells)
- Fill Region: < 10K cells
- Total Operations: ~100 before performance degradation

**Bottlenecks:**
1. **Stack overflow risk** in flood fill for very large empty regions
2. **Array copying overhead** in immutable updates
3. **React re-render cost** proportional to canvas size

### Optimization Opportunities

1. **Memoization:** Use `useMemo` for canvas rendering
2. **Canvas Element:** Use HTML5 `<canvas>` instead of ASCII
3. **Virtual Scrolling:** For very large canvases
4. **Iterative Fill:** Replace recursive flood fill with queue-based approach

---

## Testing Strategy

### Unit Test Categories

#### 1. Canvas Creation Tests
```
✓ Create valid canvas with positive dimensions
✓ Reject invalid dimensions (0, negative)
✓ Verify correct dimensions (width, height)
✓ Verify all cells filled with space character
```

#### 2. Line Drawing Tests
```
✓ Horizontal lines draw correctly
✓ Vertical lines draw correctly
✓ Diagonal lines rejected with error
✓ Lines outside canvas bounds rejected
✓ Single-cell lines work
```

#### 3. Rectangle Drawing Tests
```
✓ Rectangle draws correct outline
✓ Interior not filled
✓ Rectangle with swapped corners works
✓ Rectangle coordinates outside canvas rejected
✓ Single-row/column rectangles work
```

#### 4. Flood Fill Tests
```
✓ Fill connected region with new color
✓ Fill respects boundaries
✓ Fill respects different characters
✓ No-op fill when already same color
✓ Fill single cell
✓ Large region fill within reasonable time
```

#### 5. Validation Tests
```
✓ Invalid command rejected
✓ Wrong argument count rejected
✓ Non-numeric coordinates rejected
✓ Out-of-bounds coordinates rejected
✓ Multi-character color rejected
```

#### 6. State Management Tests
```
✓ State immutability (no mutations)
✓ Each operation creates new state
✓ Status messages update correctly
✓ Multiple operations sequence correctly
```

### Integration Tests

#### User Workflow Tests
```
1. Create canvas → Draw line → Check result
2. Create canvas → Draw rectangle → Fill → Verify
3. Multiple commands in sequence
4. Error recovery (invalid command then valid)
```

#### Edge Cases
```
✓ Empty command handling
✓ Whitespace-only command
✓ Very long command string
✓ Special characters in fill
✓ Maximum canvas size
```

### Test Tools
- **Framework:** Jest (via Create React App)
- **Library:** React Testing Library
- **Command:** `npm test`

---

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Features
- ES6 (arrow functions, destructuring, template literals)
- React 18+ support
- Modern DOM API
- Monospace font rendering

### Polyfills
- Array.from (IE11 - not officially supported)
- String.prototype.split (all modern browsers)

---

## Build and Deployment

### Build Process
```bash
npm run build
```

**Output:** Optimized production bundle in `build/` directory

**Optimizations:**
- Minified JavaScript
- CSS optimization
- Asset hashing for cache busting
- Webpack bundling

### Deployment Considerations
- Static site (no backend required)
- Can deploy to any static hosting (Netlify, Vercel, GitHub Pages)
- No server-side dependencies
- No database required

---

## Security Considerations

### Potential Issues
1. **XSS:** User input in fill color → Sanitized by React
2. **ReDoS:** Regex split with `/\s+/` → Safe (no backtracking)
3. **DoS:** Large canvas + fill → Mitigated by array limits

### Security Measures
- React escapes all rendered content
- No eval() or dangerous operations
- Input validation prevents injection
- No external API calls

---

## Future Enhancement Roadmap

### Phase 1 (Current)
- [x] Basic drawing (lines, rectangles)
- [x] Bucket fill
- [x] Command interface

### Phase 2 (Proposed)
- [ ] Undo/Redo functionality
- [ ] Save/Load canvas
- [ ] More shape types (circles, triangles)
- [ ] Color palette selector
- [ ] Brush/pen tools
- [ ] Keyboard shortcuts

### Phase 3 (Future)
- [ ] Multi-layer support
- [ ] Export to image (PNG/SVG)
- [ ] Animation/playback
- [ ] Collaborative drawing
- [ ] Touch/mobile support
- [ ] Performance optimization with Canvas API

---

## Maintenance Notes

### Known Limitations
1. Stack overflow on flood fill in 200×200+ empty region
2. No keyboard shortcuts for commands
3. No undo/redo functionality
4. Cannot undo fills (requires repaint)
5. Limited to ASCII characters

### Code Quality
- No ESLint errors
- Follows React best practices
- Functional components (modern approach)
- Clean code structure

### Dependencies
- React: Core framework (stable, well-maintained)
- React Scripts: Build tooling (CRA managed)
- Testing libraries: Built-in with CRA

---

## Glossary of Technical Terms

| Term | Definition |
|------|-----------|
| **2D Array** | Array containing arrays; simulates 2-dimensional data |
| **Flood Fill** | Algorithm that fills connected regions with same character |
| **Immutable** | Data structure that doesn't change; creates new copy |
| **DFS** | Depth-First Search; explores recursively in one direction |
| **Tokenization** | Breaking string into tokens (words/numbers) |
| **Coordinate System** | Mathematical grid for positioning (x, y) |
| **State** | Data managed by React component |
| **JSX** | Syntax extension for React components |
| **Hook** | React function for managing component state |
| **Re-render** | Process of React updating DOM with new data |
| **Monospace Font** | Font where all characters have equal width |
| **ASCII Art** | Image made with text characters |

---

*Technical Specification Version 1.0*
*Last Updated: 2024*
