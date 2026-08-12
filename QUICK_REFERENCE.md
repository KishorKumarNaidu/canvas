# Canvas Drawing Studio - Quick Reference Guide

## Command Summary

### Create Canvas
```
C width height
C 30 15          → Creates 30-column × 15-row canvas
```

### Draw Line
```
L x1 y1 x2 y2
L 1 5 20 5       → Horizontal line from (1,5) to (20,5)
L 10 1 10 8      → Vertical line from (10,1) to (10,8)
```

### Draw Rectangle
```
R x1 y1 x2 y2
R 2 2 18 10      → Rectangle with corners at (2,2) and (18,10)
```

### Fill Region
```
B x y color
B 10 5 #         → Fill region at (10,5) with '#' character
B 15 8 .         → Fill region at (15,8) with '.' character
```

### Quit/Clear
```
Q                → Clear canvas and reset
```

---

## Coordinate System

```
       1  2  3  4  5  (x-axis / columns)
    1  +--+--+--+--+
       |  |  |  |  |
    2  +--+--+--+--+
       |  |  |  |  |
    3  +--+--+--+--+
       |  |  |  |  |
(y-axis)
(rows)
```

- **Origin:** (1, 1) at top-left
- **X increases:** Left to right
- **Y increases:** Top to bottom
- **Valid ranges:** 1 ≤ x ≤ width, 1 ≤ y ≤ height

---

## Usage Examples

### Example 1: Simple Box
```
C 15 6              → Create 15×6 canvas
R 2 1 14 5          → Draw rectangle outline
```

### Example 2: Filled Box
```
C 15 6
R 2 1 14 5
B 7 3 *             → Fill center with '*'
```

### Example 3: Grid Pattern
```
C 20 10
L 5 1 5 10          → Vertical line
L 10 1 10 10        → Vertical line
L 1 5 20 5          → Horizontal line
```

---

## Error Messages & Fixes

| Error | Fix |
|-------|-----|
| "Use: L x1 y1 x2 y2" | Provide exactly 4 numbers for line |
| "Only horizontal or vertical lines" | Make x1=x2 or y1=y2 |
| "must be inside the canvas" | Check coordinates ≤ canvas size |
| "Color must be a single character" | Use one char only: `B 5 5 x` |
| "Enter a command" | Don't leave command field empty |
| "must be positive numbers" | Width/Height must be > 0 |

---

## Common Characters for Fills

| Character | Use | Command |
|-----------|-----|---------|
| `*` | Solid fill | `B x y *` |
| `#` | Strong fill | `B x y #` |
| `.` | Dotted | `B x y .` |
| `o` | Circles | `B x y o` |
| `c` | Custom | `B x y c` |
| ` ` (space) | Erase | `B x y ` ` |

---

## Canvas Size Guide

| Purpose | Width | Height |
|---------|-------|--------|
| Quick test | 10-15 | 5-8 |
| Small drawing | 20-30 | 10-15 |
| Medium drawing | 40-50 | 20-25 |
| Large drawing | 60-80 | 30-40 |

---

## Buttons Reference

| Button | Action |
|--------|--------|
| **Create Canvas** | Initialize blank canvas |
| **Quit** | Clear canvas & reset fields |
| **Run Command** | Execute typed command |

---

## Keyboard Tips

- **Enter key** in command field submits command
- **Auto-focus** on command input after creating canvas
- **Lowercase commands** work (converted to uppercase automatically)

---

## Quick Workflow

1. **Set Width & Height** → Click "Create Canvas"
2. **Type Command** → Press Enter or click "Run Command"
3. **Check Status** → View message below canvas
4. **Repeat** → Enter more commands to build drawing
5. **Reset** → Click "Quit" to start over

---

## Limitations

- ✗ No diagonal lines (use rectangles + lines instead)
- ✗ No filled rectangles (use `R` then `B` separately)
- ✗ No curve drawing
- ✗ No save/load functionality in UI (use browser developer tools)
- ✗ Only 1-character fills
- ✗ No undo/redo

---

## Pro Tips

1. **Layering:** Use different characters to distinguish overlapping elements
2. **Spacing:** Leave gaps between lines when drawing grids
3. **Fill Strategy:** Always draw boundaries before filling
4. **Pattern Art:** Use periodic lines to create textured backgrounds
5. **Erase:** Fill with space character: `B x y ` `

---

*Quick Reference v1.0 | Canvas Drawing Studio*
