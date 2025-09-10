const mode = {
  DRAW: "draw",
  ERASE: "erase",
  RECTANGLE: "rectangle",
  ELLIPSE: "ellipse",
  PICKER: "picker",
};

const $ = (selector) => document.querySelector(selector);

const $canvas = $("canvas");
const $colorPicker = $("#color-picker");
const $clearBtn = $("#clear-btn");
const $drawBtn = $("#draw-btn");
const $eraseBtn = $("#erase-btn");
const $rectangleBtn = $("#rectangle-btn");
const $ellipseBtn = $("#ellipse-btn");
const $pickerBtn = $("#picker-btn");
const ctx = $canvas.getContext("2d");

// Estado
let isDrawing = false;
let startX, startY;
let lastX = 0;
let lastY = 0;
let currentMode = mode.DRAW;
let savedImage = null; // snapshot para preview de figuras

// Eventos
$canvas.addEventListener("mousedown", startDrawing);
$canvas.addEventListener("mousemove", draw);
$canvas.addEventListener("mouseup", stopDrawing);
$canvas.addEventListener("mouseleave", stopDrawing);

$colorPicker.addEventListener("change", handleChangeColor);
$clearBtn.addEventListener("click", clearCanvas);

$drawBtn.addEventListener("click", () => setMode(mode.DRAW));
$eraseBtn.addEventListener("click", () => setMode(mode.ERASE));
$rectangleBtn.addEventListener("click", () => setMode(mode.RECTANGLE));
$ellipseBtn.addEventListener("click", () => setMode(mode.ELLIPSE));
$pickerBtn.addEventListener("click", () => setMode(mode.PICKER));

// Funciones principales
function startDrawing(event) {
  const { offsetX, offsetY } = event;
  isDrawing = true;
  [startX, startY] = [offsetX, offsetY];
  [lastX, lastY] = [offsetX, offsetY];

  if (currentMode === mode.RECTANGLE || currentMode === mode.ELLIPSE) {
    savedImage = ctx.getImageData(0, 0, $canvas.width, $canvas.height);
  }
}

function draw(event) {
  if (!isDrawing) return;
  const { offsetX, offsetY } = event;

  if (currentMode === mode.DRAW || currentMode === mode.ERASE) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    [lastX, lastY] = [offsetX, offsetY];
  } else if (currentMode === mode.RECTANGLE) {
    ctx.putImageData(savedImage, 0, 0);
    let width = offsetX - startX;
    let height = offsetY - startY;
    ctx.strokeRect(startX, startY, width, height);
  } else if (currentMode === mode.ELLIPSE) {
    ctx.putImageData(savedImage, 0, 0);
    let radiusX = (offsetX - startX) / 2;
    let radiusY = (offsetY - startY) / 2;
    let centerX = startX + radiusX;
    let centerY = startY + radiusY;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, Math.abs(radiusX), Math.abs(radiusY), 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function stopDrawing(event) {
  if (!isDrawing) return;
  isDrawing = false;

  const { offsetX, offsetY } = event;

  if (currentMode === mode.RECTANGLE) {
    ctx.putImageData(savedImage, 0, 0);
    let width = offsetX - startX;
    let height = offsetY - startY;
    ctx.strokeRect(startX, startY, width, height);
    savedImage = null;
  } else if (currentMode === mode.ELLIPSE) {
    ctx.putImageData(savedImage, 0, 0);
    let radiusX = (offsetX - startX) / 2;
    let radiusY = (offsetY - startY) / 2;
    let centerX = startX + radiusX;
    let centerY = startY + radiusY;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, Math.abs(radiusX), Math.abs(radiusY), 0, 0, Math.PI * 2);
    ctx.stroke();
    savedImage = null;
  } else if (currentMode === mode.PICKER) {
    const pixel = ctx.getImageData(offsetX, offsetY, 1, 1).data;
    const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    ctx.strokeStyle = color;
    $colorPicker.value = rgbToHex(pixel[0], pixel[1], pixel[2]);
  }
}

function handleChangeColor() {
  ctx.strokeStyle = $colorPicker.value;
}

function clearCanvas() {
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

function setMode(newMode) {
  currentMode = newMode;

  $("button.active")?.classList.remove("active");

  ctx.globalCompositeOperation = "source-over";
  ctx.lineWidth = 1;

  if (newMode === mode.DRAW) {
    $drawBtn.classList.add("active");
  } else if (newMode === mode.RECTANGLE) {
    $rectangleBtn.classList.add("active");
  } else if (newMode === mode.ELLIPSE) {
    $ellipseBtn.classList.add("active");
  } else if (newMode === mode.PICKER) {
    $pickerBtn.classList.add("active");
  } else if (newMode === mode.ERASE) {
    $eraseBtn.classList.add("active");
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 10; // tamaño fijo del borrador
  }
}

// Utilidad: convertir RGB a HEX para el picker
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// Inicializar
setMode(mode.DRAW);
