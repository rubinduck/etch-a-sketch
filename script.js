const cellsContainer = document.getElementById('cells-container');
const containerSize = cellsContainer.height;
const cellAmount = 16;
const cells = [];

for (let i = 0; i < cellAmount; i++){
    const cell = addCell(cellsContainer, containerSize / 4);
    cells.push(cell);
}

cells.forEach(cell =>
    cell.addEventListener('mouseover', (e) => e.currentTarget.classList.add('black')));

function addCell(gridElement, sizePx){
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.style.height = `${sizePx}px`;
    cell.style.width = `${sizePx}px`;
    gridElement.appendChild(cell);
    return cell;
}