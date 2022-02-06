class RGB {
    static Black = new RGB(0, 0, 0);
    static White = new RGB(255, 255, 255);

    constructor(red, green, blue){
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    toString(){
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }
    
    static genRandom(){
        return new RGB(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255))
    }

    static fromString(string){
        string = string
            .replace('rgba', '')
            .replace('rgb', '')
            .replace('(', '')
            .replace(')', '');
        const colors = string.split(',');
        return new RGB(
            Number.parseInt(colors[0]),
            Number.parseInt(colors[1]),
            Number.parseInt(colors[2]),
            
        );
    }

    static average(a, b){
        return new RGB(
            Math.round((a.red + b.red) / 2),
            Math.round((a.green + b.green) / 2),
            Math.round((a.blue + b.blue) / 2)
        )
    }
}

const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);



const defaultCellColor = RGB.White;
function clearGrid(gridElement){
    const cells = gridElement.querySelectorAll('.cell');
    cells.forEach(cell => cell.style.backgroundColor = defaultCellColor.toString());
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
    cells.forEach(cell => {
        cell.addEventListener('mouseover', handleMouseOverCell);
        cell.style.backgroundColor = defaultCellColor.toString();
    });
    return cells;
}

function handleMouseOverCell(event){
    const element = event.currentTarget;
    const currentColor = getBackgroundColor(element);
    const newColor = RGB.average(currentColor, RGB.Black);
    element.style.backgroundColor = newColor.toString();
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

function getBackgroundColor(element){
    return RGB.fromString(window.getComputedStyle(element).backgroundColor);
}


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