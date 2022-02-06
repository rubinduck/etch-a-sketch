const defaultCellColor = 'white';
function clearGrid(gridElement){
    const cells = gridElement.querySelectorAll('.cell');
    cells.forEach(cell => cell.style.backgroundColor = defaultCellColor);
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
    cells.forEach(cell => cell.addEventListener('mouseover', handleMouseOverCell));
    return cells;
}

function handleMouseOverCell(event){
    event.currentTarget.style.backgroundColor = genRandomRGB();
}

function createCell(sizePx){
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.style.height = `${sizePx}px`;
    cell.style.width = `${sizePx}px`;
    return cell;
}

function changeGridCellAmount(gridElement, sizeElement){
    const sideSize = Number.parseInt(sizeElement.value);
    sizeElement.value = '';
    genGridCells(gridElement, sideSize);
}

function genRandomRGB(){
    const red = randomInt(0, 255);
    const green = randomInt(0, 255);
    const blue = randomInt(0, 255);
    return `rgb(${red}, ${green}, ${blue})`
}

const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);


function main(){
    const gridElement = document.getElementById('cells-grid');
    const startCellsPerSideAmount = 16;

    const clearButton = document.getElementById('clear-button');
    clearButton.addEventListener('click',(e) =>
        clearGrid(gridElement))

    const gridSideSizeElement = document.getElementById('side-size-input');
    const resizeButton = document.getElementById('resize-button');
    resizeButton.addEventListener('click', (e) =>
        changeGridCellAmount(gridElement, gridSideSizeElement));

    genGridCells(gridElement, startCellsPerSideAmount);
}

main();