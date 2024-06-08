import inquirer from 'inquirer';

// List of paints
const paints = [
    { 
      brand: 'Brand A', 
      pricePerLitre: 20, 
      coverage: 10, 
      canSize: [
        { size: 10, price: 180 },
        { size: 5, price: 95 },
        { size: 2.5, price: 50 },
        { size: 1, price: 22 }
      ],
      colours: ["Blue", "Green"]
    },
    { 
      brand: 'Brand B', 
      pricePerLitre: 18, 
      coverage: 12, 
      canSize: [
        { size: 10, price: 170 },
        { size: 5, price: 90 },
        { size: 2.5, price: 48 },
        { size: 1, price: 20 }
      ],
      colours: ["Blue", "Green"]
    },
    { 
      brand: 'Brand C',  
      pricePerLitre: 25, 
      coverage: 8, 
      canSize: [
        { size: 10, price: 220 },
        { size: 5, price: 115 },
        { size: 2.5, price: 60 },
        { size: 1, price: 28 }
      ],
      colours: ["Blue", "Green"]
    }
  ];
  
// Paint interface for a specific paint object
interface Paint {
    brand: string;
    pricePerLitre: number;
    coverage: number;
    colour: string;
}

// Wall interface
interface Wall {
    totalLength: number;
    totalWidth: number;
    totalArea: number;
    areaToSubtract: number
    areaToPaint: number;
    paint: Paint;
    litresNeededToPaint: number;
};

// Room interface
interface Room {
    walls: Wall[];
};

// User interface
interface User {
    name: string;
    totalRooms: number;
    rooms: Room[];
};


// Function to validate user number input
function validateNumberInput(value: string): boolean | string {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
        return 'Please enter a valid number';
    } else if (parsedValue <= 0) {
        return 'Please enter a number greater than zero';
    } else if (!Number.isInteger(parsedValue)) {
        return 'Please enter an integer value';
    }
    return true;
};

// Function to validate yes/no input
function validateYesNoInput(value: string): boolean | string {
    const validValues = ['y', 'n', 'yes', 'no'];
    if (!validValues.includes(value.toLowerCase())) {
        return 'Please enter yes/no or y/n';
    }
    return true;
};

// Function to ask for number of rooms
async function askNumberOfRooms(): Promise<number> {
    const response = await inquirer.prompt({
        name: 'rooms',
        type: 'input',
        message: 'How many rooms do you need to paint?',
        validate: validateNumberInput
    });
    return parseInt(response.rooms, 10);
}

// Function to ask for the number of walls in a room
async function askNumberOfWalls(roomNumber: number): Promise<number> {
    const response = await inquirer.prompt({
      name: 'walls',
      type: 'input',
      message: `How many walls do you need to paint in room ${roomNumber}?`,
      validate: validateNumberInput
    });
    return parseInt(response.walls, 10);
};

async function createWall(): Promise<Wall> {
    // Ask for wall dimensions
    const wallDimensions = await inquirer.prompt([
        {
            name: 'totalLength',
            type: 'input',
            message: 'Enter the length of the wall:',
            validate: validateNumberInput
        },
        {
            name: 'totalWidth',
            type: 'input',
            message: 'Enter the width of the wall:',
            validate: validateNumberInput
        }
    ]);

    const totalLength = parseInt(wallDimensions.totalLength, 10);
    const totalWidth = parseInt(wallDimensions.totalWidth, 10);
    const totalArea = totalLength * totalWidth;

    let areaToSubtract = 0;
    let addMoreAreas = true;

    // Ask for areas to subtract (windows/doors)
    while (addMoreAreas) {
        const areaResponse = await inquirer.prompt({
            name: 'addArea',
            type: 'input',
            message: 'Do you want to add an area to subtract (e.g., window, door)? (y/n)',
            validate: validateYesNoInput
        });

        if (areaResponse.addArea.toLowerCase() === 'no' || areaResponse.addArea.toLowerCase() === 'n') {
            addMoreAreas = false;
        } else {
            const subtractDimensions = await inquirer.prompt([
                {
                    name: 'length',
                    type: 'input',
                    message: 'Enter the length of the area to subtract:',
                    validate: validateNumberInput
                },
                {
                    name: 'width',
                    type: 'input',
                    message: 'Enter the width of the area to subtract:',
                    validate: validateNumberInput
                }
            ]);

            const length = parseInt(subtractDimensions.length, 10);
            const width = parseInt(subtractDimensions.width, 10);
            areaToSubtract += length * width;
        }
    }

    const areaToPaint = totalArea - areaToSubtract;

    // Ask for paint choice
    const paintChoices = paints.map((paint, index) => ({
        name: `${paint.brand} - $${paint.pricePerLitre}/litre - ${paint.coverage}m²/litre (${paint.colours.join(", ")})`,
        value: index
    }));

    const paintResponse = await inquirer.prompt({
        name: 'paintChoice',
        type: 'list',
        message: 'Choose a paint for this wall:',
        choices: paintChoices
    });

    const chosenPaint = paints[paintResponse.paintChoice];
    const paintableArea = areaToPaint;
    const litresNeededToPaint = paintableArea / chosenPaint.coverage;

    const paintColourResponse = await inquirer.prompt({
        name: 'paintColour',
        type: 'list',
        message: 'Choose a colour:',
        choices: chosenPaint.colours
    });

    const paint: Paint = {
        brand: chosenPaint.brand,
        pricePerLitre: chosenPaint.pricePerLitre,
        coverage: chosenPaint.coverage,
        colour: paintColourResponse.paintColour
    };

    const wall: Wall = {
        totalLength,
        totalWidth,
        totalArea,
        areaToSubtract,
        areaToPaint,
        paint,
        litresNeededToPaint
    };

    return wall;
}

// main function
async function main() {
    
}

main()

