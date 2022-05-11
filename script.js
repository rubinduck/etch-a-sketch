class Color {
    constructor(red, green, blue, opacity=1){
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.opacity = opacity
    }

    toString(){
        if (this.opacity === 1)
            return `rgb(${this.red}, ${this.green}, ${this.blue})`;
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.opacity})`;
    }

    static fromString(string){
        string = string.trim();
        if (string.startsWith('rgb'))
            string = string.replace('rgb(', '');
        else
            string = string.replace('rgba(', '');
        string = string
            .replace(')', '')
            .replace(' ', '');
        const args = string.split(',');
        return new Color(...args);
    }
}

const TransparentColor = new Color(0, 0, 0, 0);
const Colors = new Map([
    ['Black', new Color(0, 0, 0)],
    ['White', new Color(255, 255, 255)],
    ['Red', new Color(255, 0, 0)],
    ['Lime', new Color(0, 255, 0)],
    ['Blue', new Color(0, 0, 255)],
    ['Yellow', new Color(255, 255, 0)],
    ['Silver', new Color(192, 192, 192)],
    ['Gray', new Color(128, 128, 128)],
    ['Maroon', new Color(128, 0, 0)],
    ['Olive', new Color(128, 128, 0)],
    ['Green', new Color(0, 128, 0)],
    ['Purple', new Color(128, 0, 128)],
    ['Teal', new Color(0, 128, 128)],
    ['Navy', new Color(0, 0, 128)],
    ['BlueViolet', new Color(138, 43, 226)],
]);


class Canvas {
    drawingColor = Colors.get('Black');
    isMouseDown = false;
    domElement;
    cellElements = [];
    constructor(document, domElement, cellsPerSide){
        document.addEventListener('mousedown', () => this.isMouseDown = true);
        document.addEventListener('mouseup', () => this.isMouseDown = false);
        this.domElement = domElement;
        this.#spawnCanvasCells(cellsPerSide);
    }

    clear(){
        this.cellElements.forEach(
            cell => setBackgroundColor(cell, TransparentColor));
    }

    resize(cellsPerSize){
        this.#spawnCanvasCells(cellsPerSize);
    }

    setDrawingColor(color){
        this.drawingColor = color;
    }

    #spawnCanvasCells(cellsPerSide){
        const cellAmount = cellsPerSide * cellsPerSide;
        const cellSizeInPercent =  100 * (1 / cellsPerSide);
        this.cellElements = this.#createCells(cellSizeInPercent, cellAmount);
        this.domElement.replaceChildren(...this.cellElements);
    }

    #createCells(cellSizeInPercent, amount){
        const cells = [];
        for (let i = 0; i < amount; i++)
            cells.push(this.#createCell(cellSizeInPercent, TransparentColor));
        return cells;
    }

    #createCell(sizeInPercent, backgroundColor){
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.height = `${sizeInPercent}%`;
        cell.style.width = `${sizeInPercent}%`;
        setBackgroundColor(cell, backgroundColor)
        cell.addEventListener('mouseover', event => this.handleMouseOverCell(event.currentTarget));
        cell.addEventListener('mousedown', event => this.drawOnCell(event.currentTarget));
        return cell;
    }

    handleMouseOverCell(cellElement){
        if (this.isMouseDown)
            this.drawOnCell(cellElement);
    }

    drawOnCell(cellElement){
        setBackgroundColor(cellElement, this.drawingColor);
    }
}


function setBackgroundColor(element, rgbColor){
    element.style.backgroundColor = rgbColor.toString();
}

function getBackgroundColor(element){
    return Color.fromString(window.getComputedStyle(element).backgroundColor);
}


function handleSizeInput(sizeView, sizeRangeElement, canvas){
    const newSize = sizeRangeElement.value;
    sizeView.textContent = `${newSize}x${newSize}`;
    canvas.resize(newSize);
}


function generateColorOptions(colors){
    const colorOptions = []
    for (let color of colors)
        colorOptions.push(createColorOptionElement(color));
    return colorOptions;
}

function createColorOptionElement(color){
    const colorElement = document.createElement('div');
    colorElement.classList.add('color');
    setBackgroundColor(colorElement, color);
    return colorElement;
}

function main(){
    const canvasElement = document.getElementById('canvas');
    const startCellsPerSideAmount = 16;
    const canvas = new Canvas(document, canvasElement, startCellsPerSideAmount);

    const clearButton = document.getElementById('clear-button');
    clearButton.addEventListener('click',(e) => canvas.clear())

    const eraserElement = document.getElementById('eraser');
    eraserElement.addEventListener('click', e =>
        canvas.setDrawingColor(TransparentColor));

    const sizeRangeElement = document.getElementById('size-range');
    const sizeView = document.getElementById('size-view');
    sizeRangeElement.addEventListener('input',
        e => handleSizeInput(sizeView, sizeRangeElement, canvas));
    sizeRangeElement.value = startCellsPerSideAmount;
    handleSizeInput(sizeView, sizeRangeElement, canvas);

    const colorPanel = document.getElementById('color-panel');
    const colorOptions = generateColorOptions(Colors.values());
    colorPanel.replaceChildren(...colorOptions);
    colorOptions.forEach(option => option.addEventListener('click', e => {
        const option = e.currentTarget;
        canvas.setDrawingColor(getBackgroundColor(option));
    } ))
}

main();