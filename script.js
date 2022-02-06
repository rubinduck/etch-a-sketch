function clearGrid(gridElement){
    const cells = gridElement.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('black'));
}

function genGridCells(gridElement, cellsPerSide){
    const cellAmount = cellsPerSide * cellsPerSide;
    const gridSideSize = gridElement.clientHeight;
    const cellSize = gridSideSize / cellsPerSide;
    const newCells = createCells(cellSize, cellAmount);
    gridElement.replaceChildren(...newCells);
}

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
    const startCellsPerSideAmount = 16;

    const clearButton = document.getElementById('clear-button');
    clearButton.addEventListener('click',(e) =>
        clearGrid(gridElement))

    genGridCells(gridElement, startCellsPerSideAmount);
}

main();