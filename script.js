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



class Grid {
    cellDefaultColor = RGB.White;
    drawingColor = RGB.Black;
    isMouseDown = false;
    gridElement;
    cellElements = [];
    sideSizePx;
    constructor(gridElement, cellsPerSide){
        this.gridElement = gridElement;
        this.sideSizePx = gridElement.clientHeight;
        this.#spawnGridCells(cellsPerSide);
    }

    clear(){
        this.cellElements.forEach(
            cell => setBackgroundColor(cell, this.cellDefaultColor));
    }

    resize(cellsPerSize){
        this.#spawnGridCells(cellsPerSize);
    }

    #spawnGridCells(cellsPerSide){
        const cellAmount = cellsPerSide * cellsPerSide;
        const cellSizeInPercent =  100 * (1 / cellsPerSide);
        this.cellElements = this.#createCells(cellSizeInPercent, cellAmount);
        this.gridElement.replaceChildren(...this.cellElements);
    }

    #createCells(cellSizeInPercent, amount){
        const cells = [];
        for (let i = 0; i < amount; i++)
            cells.push(this.#createCell(cellSizeInPercent));
        cells.forEach(cell => {
            cell.addEventListener('mouseover',
                (event) => this.handleMouseOverCell(event.currentTarget));
            cell.addEventListener('mousedown',
                (event) => {
                    this.isMouseDown = true;
                    this.handleMouseOverCell(event.currentTarget)
                });
            setBackgroundColor(cell, this.cellDefaultColor)
        });
        return cells;
    }

    #createCell(sizeInPercent){
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.height = `${sizeInPercent}%`;
        cell.style.width = `${sizeInPercent}%`;
        return cell;
    }

    handleMouseOverCell(cellElement){
        if (!this.isMouseDown) return;
        const currentColor = getBackgroundColor(cellElement);
        const newColor = RGB.average(currentColor, RGB.Black);
        setBackgroundColor(cellElement, newColor)
    }
}


function setBackgroundColor(element, rgbColor){
    element.style.backgroundColor = rgbColor.toString();
}

function getBackgroundColor(element){
    return RGB.fromString(window.getComputedStyle(element).backgroundColor);
}

function fitlerNotInts(event){
    if (!event.data)
        return;
    const newData = event.data;
    const target = event.currentTarget;
    if (!isInt(newData))
        target.value = target.value.replace(newData, '');

    function isInt(string){
        for (let char of string){
            if (char < '0' || char > '9')
                return false;
        }
        return true;
    }
}

function handleResizeButton(grid, gridSizeElement){
    const newSideSize = Number.parseInt(gridSizeElement.value);
    if (newSideSize < 2 || newSideSize > 100){
        alert('Side must be between 2 and 100');
        return;
    }
    grid.resize(newSideSize)
}

function main(){
    const gridElement = document.getElementById('cells-grid');
    const startCellsPerSideAmount = 16;
    const grid = new Grid(gridElement, startCellsPerSideAmount);

    document.addEventListener('mousedown', () => grid.isMouseDown = true);
    document.addEventListener('mouseup', () => grid.isMouseDown = false);

    const clearButton = document.getElementById('clear-button');
    clearButton.addEventListener('click',(e) => grid.clear())

    const gridSideSizeElement = document.getElementById('side-size-input');
    gridSideSizeElement.addEventListener('input', fitlerNotInts)
    gridSideSizeElement.value = startCellsPerSideAmount;

    const resizeButton = document.getElementById('resize-button');
    resizeButton.addEventListener('click', (e) => handleResizeButton(grid, gridSideSizeElement));
}

main();