import { useState } from 'react';

function CanvasPage() {
  const [width, setWidth] = useState('20');
  const [height, setHeight] = useState('4');
  const [canvas, setCanvas] = useState([]);
  const [command, setCommand] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const createBlankCanvas = (w, h) =>
    Array.from({ length: h }, () => Array.from({ length: w }, () => ' '));

  const handleCreate = (event) => {
    event.preventDefault();

    const nextWidth = Number(width);
    const nextHeight = Number(height);

    if (nextWidth > 0 && nextHeight > 0) {
      setCanvas(createBlankCanvas(nextWidth, nextHeight));
      setStatusMessage(`Canvas created: ${nextWidth} x ${nextHeight}`);
      setCommand('');
    } else {
      setStatusMessage('Width and height must be positive numbers.');
    }
  };

  const handleQuit = () => {
    setWidth('');
    setHeight('');
    setCanvas([]);
    setCommand('');
    setStatusMessage('Canvas cleared.');
  };

  const insideCanvas = (x, y) => {
    return y >= 1 && y <= canvas.length && x >= 1 && x <= (canvas[0] ? canvas[0].length : 0);
  };

  const drawLine = (x1, y1, x2, y2) => {
    if (!insideCanvas(x1, y1) || !insideCanvas(x2, y2)) {
      setStatusMessage('Line coordinates must be inside the canvas.');
      return;
    }

    const nextCanvas = canvas.map((row) => [...row]);

    if (y1 === y2) {
      const startX = Math.min(x1, x2);
      const endX = Math.max(x1, x2);
      for (let x = startX; x <= endX; x += 1) {
        nextCanvas[y1 - 1][x - 1] = 'x';
      }
    } else if (x1 === x2) {
      const startY = Math.min(y1, y2);
      const endY = Math.max(y1, y2);
      for (let y = startY; y <= endY; y += 1) {
        nextCanvas[y - 1][x1 - 1] = 'x';
      }
    } else {
      setStatusMessage('Only horizontal or vertical lines are supported.');
      return;
    }

    setCanvas(nextCanvas);
    setStatusMessage(`Line drawn from (${x1}, ${y1}) to (${x2}, ${y2}).`);
  };

  const drawRectangle = (x1, y1, x2, y2) => {
    if (!insideCanvas(x1, y1) || !insideCanvas(x2, y2)) {
      setStatusMessage('Rectangle coordinates must be inside the canvas.');
      return;
    }

    const nextCanvas = canvas.map((row) => [...row]);
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    // Draw top and bottom edges
    for (let x = minX; x <= maxX; x += 1) {
      nextCanvas[minY - 1][x - 1] = 'x';
      nextCanvas[maxY - 1][x - 1] = 'x';
    }

    // Draw left and right edges
    for (let y = minY; y <= maxY; y += 1) {
      nextCanvas[y - 1][minX - 1] = 'x';
      nextCanvas[y - 1][maxX - 1] = 'x';
    }

    setCanvas(nextCanvas);
    setStatusMessage(`Rectangle drawn from (${x1}, ${y1}) to (${x2}, ${y2}).`);
  };

  const bucketFill = (x, y, color) => {
    if (!insideCanvas(x, y)) {
      setStatusMessage('Fill coordinates must be inside the canvas.');
      return;
    }

    const nextCanvas = canvas.map((row) => [...row]);
    const originalChar = nextCanvas[y - 1][x - 1];

    if (originalChar === color) {
      setStatusMessage('No fill needed - area already has this color.');
      return;
    }

    const fill = (fillX, fillY) => {
      if (
        fillY < 1 || fillY > nextCanvas.length ||
        fillX < 1 || fillX > nextCanvas[0].length ||
        nextCanvas[fillY - 1][fillX - 1] !== originalChar
      ) {
        return;
      }

      nextCanvas[fillY - 1][fillX - 1] = color;

      // Fill in 4 directions (up, down, left, right)
      fill(fillX, fillY - 1); // up
      fill(fillX, fillY + 1); // down
      fill(fillX - 1, fillY); // left
      fill(fillX + 1, fillY); // right
    };

    fill(x, y);
    setCanvas(nextCanvas);
    setStatusMessage(`Filled area at (${x}, ${y}) with '${color}'.`);
  };

  const handleCommandSubmit = (event) => {
    event.preventDefault();

    const trimmed = command.trim();
    if (!trimmed) {
      setStatusMessage('Enter a command.');
      return;
    }

    const tokens = trimmed.split(/\s+/);
    const cmd = tokens[0].toUpperCase();

    if (cmd === 'L') {
      if (tokens.length !== 5) {
        setStatusMessage('Use: L x1 y1 x2 y2');
        return;
      }

      const x1 = Number(tokens[1]);
      const y1 = Number(tokens[2]);
      const x2 = Number(tokens[3]);
      const y2 = Number(tokens[4]);

      if ([x1, y1, x2, y2].some((value) => Number.isNaN(value))) {
        setStatusMessage('Line coordinates must be numbers.');
        return;
      }

      drawLine(x1, y1, x2, y2);
      setCommand('');
      return;
    }

    if (cmd === 'C') {
      if (tokens.length !== 3) {
        setStatusMessage('Use: C width height');
        return;
      }

      const nextWidth = Number(tokens[1]);
      const nextHeight = Number(tokens[2]);

      if (nextWidth > 0 && nextHeight > 0) {
        setWidth(String(nextWidth));
        setHeight(String(nextHeight));
        setCanvas(createBlankCanvas(nextWidth, nextHeight));
        setStatusMessage(`Canvas recreated: ${nextWidth} x ${nextHeight}`);
        setCommand('');
      } else {
        setStatusMessage('Width and height must be positive numbers.');
      }

      return;
    }

    if (cmd === 'R') {
      if (tokens.length !== 5) {
        setStatusMessage('Use: R x1 y1 x2 y2');
        return;
      }

      const x1 = Number(tokens[1]);
      const y1 = Number(tokens[2]);
      const x2 = Number(tokens[3]);
      const y2 = Number(tokens[4]);

      if ([x1, y1, x2, y2].some((value) => Number.isNaN(value))) {
        setStatusMessage('Rectangle coordinates must be numbers.');
        return;
      }

      drawRectangle(x1, y1, x2, y2);
      setCommand('');
      return;
    }

    if (cmd === 'B') {
      if (tokens.length !== 4) {
        setStatusMessage('Use: B x y color');
        return;
      }

      const x = Number(tokens[1]);
      const y = Number(tokens[2]);
      const color = tokens[3];

      if ([x, y].some((value) => Number.isNaN(value))) {
        setStatusMessage('Fill coordinates must be numbers.');
        return;
      }

      if (color.length !== 1) {
        setStatusMessage('Color must be a single character.');
        return;
      }

      bucketFill(x, y, color);
      setCommand('');
      return;
    }

    if (cmd === 'Q') {
      handleQuit();
      return;
    }

    setStatusMessage('Unsupported command. Supported commands: C, L, R, B, Q.');
  };

  const renderCanvas = () => {
    if (!canvas.length || !canvas[0]?.length) {
      return null;
    }

    const widthValue = canvas[0].length;
    const topBottom = '-'.repeat(widthValue + 2);
    const rows = [
      <div key="top" className="canvas-row">{topBottom}</div>,
      ...canvas.map((row, index) => (
        <div key={`row-${index}`} className="canvas-row">
          {'|' + row.join('') + '|'}
        </div>
      )),
      <div key="bottom" className="canvas-row">{topBottom}</div>,
    ];

    return <pre className="canvas-grid">{rows}</pre>;
  };

  return (
    <div className="canvas-page">
      <div className="canvas-header">
        <h1>Canvas Drawing Studio</h1>
        <p className="canvas-subtitle">Draw lines, rectangles, and fill areas with commands</p>
      </div>

      <form className="canvas-form" onSubmit={handleCreate}>
        <label>
          Width
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            min="1"
            required
          />
        </label>

        <label>
          Height
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min="1"
            required
          />
        </label>

        <button type="submit">Create Canvas</button>
        <button type="button" onClick={handleQuit}>Quit</button>
      </form>

      {canvas.length > 0 && (
        <form className="command-form" onSubmit={handleCommandSubmit}>
          <label>
            Enter command
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="e.g. L 1 2 6 2"
              autoFocus
            />
          </label>

          <button type="submit">Run Command</button>
        </form>
      )}

      {statusMessage ? <p className="status-message">{statusMessage}</p> : null}

      <div className="canvas-wrapper">{renderCanvas()}</div>
    </div>
  );
}

export default CanvasPage;