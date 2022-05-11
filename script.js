class Color {
    constructor(red, green, blue){
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    toString(){
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }
    
    // static genRandom(){
    //     return new RGB(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255))
    // }

    static fromString(string){
        string = string
            .replace('rgba', '')
            .replace('rgb', '')
            .replace('(', '')
            .replace(')', '');
        const colors = string.split(',');
        return new Color(
            Number.parseInt(colors[0]),
            Number.parseInt(colors[1]),
            Number.parseInt(colors[2]),
            
        );
    }

    // this code might be usefull later
    // static average(a, b){
    //     return new RGB(
    //         Math.round((a.red + b.red) / 2),
    //         Math.round((a.green + b.green) / 2),
    //         Math.round((a.blue + b.blue) / 2)
    //     )
    // }
}

const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);


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
    cellDefaultColor = Colors.get('White');
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
            cell => setBackgroundColor(cell, this.cellDefaultColor));
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
            cells.push(this.#createCell(cellSizeInPercent, this.cellDefaultColor));
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
        //might be usefull later
        // const currentColor = getBackgroundColor(cellElement);
        // const newColor = RGB.average(currentColor, RGB.Black);
        setBackgroundColor(cellElement, this.drawingColor);
    }
}


function setBackgroundColor(element, rgbColor){
    element.style.backgroundColor = rgbColor.toString();
}

function getBackgroundColor(element){
    return Color.fromString(window.getComputedStyle(element).backgroundColor);
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


function handleSizeInput(sizeView, sizeInput, canvas){
    const newSize = sizeInput.value;
    sizeView.textContent = `${newSize}x${newSize}`;
    canvas.resize(newSize);
}


function generateColorOptions(colors){
    const colorOptions = []
    for (color of colors)
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

    // TODO maybe rename element
    const sizeScale = document.getElementById('size-scale');
    const sizeView = document.getElementById('size-view');
    sizeScale.addEventListener('input',
        e => handleSizeInput(sizeView, sizeScale, canvas));
    sizeScale.value = startCellsPerSideAmount;
    handleSizeInput(sizeView, sizeScale, canvas);

    const colorPanel = document.getElementById('color-panel');
    const colorOptions = generateColorOptions(Colors.values());
    colorPanel.replaceChildren(...colorOptions);
    colorOptions.forEach(option => option.addEventListener('click', e => {
        const option = e.currentTarget;
        canvas.setDrawingColor(getBackgroundColor(option));
    } ))
}

main();