import inquirer from 'inquirer';

// List of paints
const paints = [
    { 
      brand: 'Dulux', 
      pricePerLitre: 6.8, 
      coverage: 13, 
      canSize: [
        { size: 10, price: 68 },
        { size: 5, price: 34 },
        { size: 2.5, price: 17 },
        { size: 1, price: 6.8 }
      ],
      colours: ["White", "Egyptian cotton", "Stonewashed Blue", "Grey"]
    },
    { 
      brand: 'Annie Sloan', 
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
    coverage: number; // m² per litre of paint
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
    totalWall: number;
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

function validateStringInput(value: string): boolean | string {
    if (typeof value !== 'string') {
        return 'Please enter a valid string';
    } else if (value.trim() === '') {
        return 'Please enter a non-empty string';
    } else if (value.length < 3) {
        return 'Please enter a string with at least 3 characters';
    } else if (value.length > 50) {
        return 'Please enter a string with no more than 50 characters';
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

// Ask user for there name
async function askUserName(): Promise<string> {
    const response = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Welcome! What is your name?',
        validate: validateStringInput
    });
    return response.name
}

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
    let firstTime = true;

    // Ask for areas to subtract (windows/doors)
    while (addMoreAreas) {
        const areaResponse = await inquirer.prompt({
            name: 'addArea',
            type: 'input',
            message: firstTime ? 'Do you want to add an area to subtract (e.g., window, door)? (yes/no)' : 'Do you want to add another area to subtract? (yes/no)',
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
        firstTime = false;
    }

    const areaToPaint = totalArea - areaToSubtract;

    // Ask for paint choice
    const paintChoices = paints.map((paint, index) => ({
        name: `Brand: ${paint.brand} - Price/litre: £${paint.pricePerLitre} - Coverage: ${paint.coverage}m²/litre - Available Colours: ${paint.colours.join(", ")}`,
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
};

// Function to calculate total litres from User object
function calculateTotalLitres(user: User) {
    // Object to storie total litres for each brand
    const totalLitres : { [brand: string]: number } = {};

    // Loop through each room in the User's rooms array
    for (let i = 0; i < user.rooms.length; i++) {
        const room = user.rooms[i];

        // Loop through each wall in the curren room
        for (let j = 0; j < room.walls.length; j++) {
            const wall = room.walls[j];
            const brand = wall.paint.brand

            // If the brand is not already in totalLitres, initialise it to 0
            if (!totalLitres[brand]) {
                totalLitres[brand] = 0;
            }

            // Add the litres needed to paint the current wall to the total for the current brand
            totalLitres[brand] += wall.litresNeededToPaint;
        }
    }

    return totalLitres;
}

// Main function
async function main() {
    // Step 1: Ask the user for their name and generate user object
    const userName = await askUserName();

    // Step 2: Ask the user the number of rooms they need to paint
    const numberOfRooms = await askNumberOfRooms();

    // Array to hold the rooms
    const rooms: Room[] = [];

    // Step 3: For each room, ask the number of walls
    for (let i=1; i <= numberOfRooms; i++) {
        const numberOfWalls = await askNumberOfWalls(i);

        // Array to hold the walls
        const walls: Wall[] = [];

        // Step 4: Create each wall using the createWall function and add it to the wall array
        for (let j = 1; j <= numberOfWalls; j++) {
            const wall = await createWall();
            walls.push(wall);
        }

        // Add walls objects to the room object
        const room: Room = {
            walls
        };
        rooms.push(room);
    }

    // Create the user object with all rooms
    const user: User = {
        name: userName,
        totalRooms: numberOfRooms,
        // Calculates the total number of walls in the rooms array using
        totalWall: rooms.reduce((total, room) => total + room.walls.length, 0),
        rooms: rooms
    };
}

// Run the main function
main();
