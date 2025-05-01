export default function resetCanvas(id) {
  let canvasWrapper = document.getElementById(id).parentNode;
  canvasWrapper.innerHTML = `<canvas id="${id}"></canvas>`;
}
