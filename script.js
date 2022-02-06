function genGridCells(gridElement, cellsPerSide){
    const cellAmount = cellsPerSide * cellsPerSide;
    const gridSideSize = gridElement.clientHeight;
    const cellSize = gridSideSize / cellsPerSide;
    const cells = createCells(cellSize, cellAmount);
    cells.forEach(cell => gridElement.appendChild(cell))
}

// retruns cell elements array
function createCells(cellSizePx, amount){
    const cells = [];
    for (let i = 0; i < amount; i++)
        cells.push(createCell(cellSizePx));
    cells.forEach(cell =>
        cell.addEventListener('mouseover',
            (e) => e.currentTarget.classList.add('black')));
    return cells;
}

function createCell(sizePx){
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.style.height = `${sizePx}px`;
    cell.style.width = `${sizePx}px`;
    return cell;
}

function main(){
    const gridElement = document.getElementById('cells-grid');
    const startCellsPerSideAmount = 4;
    genGridCells(gridElement, startCellsPerSideAmount);
}

main();