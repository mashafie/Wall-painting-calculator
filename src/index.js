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
        brand: 'Leyland',
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
        brand: 'GoodHome',
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
;
;
;
// Function to validate user number input
function validateNumberInput(value) {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
        return 'Please enter a valid number';
    }
    else if (parsedValue <= 0) {
        return 'Please enter a number greater than zero';
    }
    else if (!Number.isInteger(parsedValue)) {
        return 'Please enter an integer value';
    }
    return true;
}
;
function validateStringInput(value) {
    if (typeof value !== 'string') {
        return 'Please enter a valid string';
    }
    else if (value.trim() === '') {
        return 'Please enter a non-empty string';
    }
    else if (value.length < 3) {
        return 'Please enter a string with at least 3 characters';
    }
    else if (value.length > 50) {
        return 'Please enter a string with no more than 50 characters';
    }
    return true;
}
;
// Function to validate yes/no input
function validateYesNoInput(value) {
    const validValues = ['y', 'n', 'yes', 'no'];
    if (!validValues.includes(value.toLowerCase())) {
        return 'Please enter yes/no or y/n';
    }
    return true;
}
;
// Ask user for there name
async function askUserName() {
    const response = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Welcome! What is your name?',
        validate: validateStringInput
    });
    return response.name;
}
// Function to ask for number of rooms
async function askNumberOfRooms() {
    const response = await inquirer.prompt({
        name: 'rooms',
        type: 'input',
        message: 'How many rooms do you need to paint?',
        validate: validateNumberInput
    });
    return parseInt(response.rooms, 10);
}
// Function to ask for the number of walls in a room
async function askNumberOfWalls(roomNumber) {
    const response = await inquirer.prompt({
        name: 'walls',
        type: 'input',
        message: `How many walls do you need to paint in room ${roomNumber}?`,
        validate: validateNumberInput
    });
    return parseInt(response.walls, 10);
}
;
async function createWall() {
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
        }
        else {
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
    const paint = {
        brand: chosenPaint.brand,
        pricePerLitre: chosenPaint.pricePerLitre,
        coverage: chosenPaint.coverage,
        colour: paintColourResponse.paintColour
    };
    const wall = {
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
;
// Function to calculate total litres from User object
function calculateTotalLitres(user) {
    // Object to store total litres for each brand and color combination
    const totalLitres = {};
    // Loop through each room in the User's rooms array
    for (let i = 0; i < user.rooms.length; i++) {
        const room = user.rooms[i];
        // Loop through each wall in the current room
        for (let j = 0; j < room.walls.length; j++) {
            const wall = room.walls[j];
            const brand = wall.paint.brand;
            const color = wall.paint.colour;
            const key = `${brand} ${color}`;
            // If the brand and color combination is not already in totalLitres, initialize it to 0
            if (!totalLitres[key]) {
                totalLitres[key] = 0;
            }
            // Add the litres needed to paint the current wall to the total for the current brand and color combination
            totalLitres[key] += wall.litresNeededToPaint;
        }
    }
    return totalLitres;
}
;
// Recommendation function
function recommendation(totalLitres) {
    const recommendations = {};
    let totalAmount = 0;
    for (const key in totalLitres) {
        const [brand, ...colourParts] = key.split(' ');
        const colour = colourParts.join(' ');
        const litresNeeded = totalLitres[key];
        // Find the corresponding paint object
        const paint = paints.find(p => p.brand === brand);
        if (!paint) {
            console.error(`Paint brand ${brand} not found`);
            continue;
        }
        // Sort can sizes from largest to smallest
        const sortedCanSizes = paint.canSize.sort((a, b) => b.size - a.size);
        let remainingLitres = litresNeeded;
        const cans = [];
        // Calculate the optimal cans needed
        for (const can of sortedCanSizes) {
            while (remainingLitres > 0 && remainingLitres >= can.size) {
                cans.push([can.size, can.price]);
                totalAmount += can.price;
                remainingLitres -= can.size;
            }
        }
        // If there are still remaining litres, add the smallest can available
        if (remainingLitres > 0) {
            const smallestCan = sortedCanSizes[sortedCanSizes.length - 1];
            cans.push([smallestCan.size, smallestCan.price]);
            totalAmount += smallestCan.price;
        }
        recommendations[key] = cans;
    }
    return { recommendations, totalAmount };
}
// Main function
async function main() {
    // Step 1: Ask the user for their name and generate user object
    const userName = await askUserName();
    // Step 2: Ask the user the number of rooms they need to paint
    const numberOfRooms = await askNumberOfRooms();
    // Array to hold the rooms
    const rooms = [];
    // Step 3: For each room, ask the number of walls
    for (let i = 1; i <= numberOfRooms; i++) {
        const numberOfWalls = await askNumberOfWalls(i);
        // Array to hold the walls
        const walls = [];
        // Step 4: Create each wall using the createWall function and add it to the wall array
        for (let j = 1; j <= numberOfWalls; j++) {
            const wall = await createWall();
            walls.push(wall);
        }
        // Add walls objects to the room object
        const room = {
            walls
        };
        rooms.push(room);
    }
    // Create the user object with all rooms
    const user = {
        name: userName,
        totalRooms: numberOfRooms,
        // Calculates the total number of walls in the rooms array using
        totalWall: rooms.reduce((total, room) => total + room.walls.length, 0),
        rooms: rooms
    };
    // Calculate total litres needed for each brand
    const totalLitres = calculateTotalLitres(user);
    // Recommendation and total amount
    const { recommendations, totalAmount } = recommendation(totalLitres);
}
// Run the main function
main();
