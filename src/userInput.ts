import inquirer from 'inquirer';
import { Paint, Wall, Room, User } from './interfaces.js';
import { paints } from './paintData.js';

// Function to validate user number input
export function validateNumberInput(value: string): boolean | string {
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

// Function to validate user string input
export function validateStringInput(value: string): boolean | string {
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
export function validateYesNoInput(value: string): boolean | string {
    const validValues = ['y', 'n', 'yes', 'no'];
    if (!validValues.includes(value.toLowerCase())) {
        return 'Please enter yes/no or y/n';
    }
    return true;
};

// Ask user for there name
export async function askUserName(): Promise<string> {
    const response = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Welcome! What is your name?',
        validate: validateStringInput
    });
    return response.name
};

// Function to ask for number of rooms
export async function askNumberOfRooms(): Promise<number> {
    const response = await inquirer.prompt({
        name: 'rooms',
        type: 'input',
        message: 'How many rooms do you need to paint?',
        validate: validateNumberInput
    });
    return parseInt(response.rooms, 10);
};

// Function to ask for the number of walls in a room
export async function askNumberOfWalls(roomNumber: number): Promise<number> {
    const response = await inquirer.prompt({
      name: 'walls',
      type: 'input',
      message: `How many walls do you need to paint in room ${roomNumber}?`,
      validate: validateNumberInput
    });
    return parseInt(response.walls, 10);
};

export async function createWall(wallNumber: number): Promise<Wall> {
    // Ask for wall dimensions
    const wallDimensions = await inquirer.prompt([
        {
            name: 'totalLength',
            type: 'input',
            message: `Enter the length of wall ${wallNumber} (metres):`,
            validate: validateNumberInput
        },
        {
            name: 'totalWidth',
            type: 'input',
            message: `Enter the width of wall ${wallNumber} (metres):`,
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
                    message: 'Enter the length of the area to subtract (metres):',
                    validate: validateNumberInput
                },
                {
                    name: 'width',
                    type: 'input',
                    message: 'Enter the width of the area to subtract (metres):',
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