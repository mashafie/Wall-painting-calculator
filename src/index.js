import inquirer from 'inquirer';
;
// List of paint brands
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
        ]
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
        ]
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
        ]
    }
];
// Function to ask for number of rooms
async function askNumberOfRooms() {
    const response = await inquirer.prompt({
        name: 'rooms',
        type: 'number',
        message: 'How many rooms do you need to paint?',
        validate: (value) => value > 0 || 'Please enter a valid number'
    });
    return response.rooms;
}
;
// Function to ask for the number of walls in a room
async function askNumberOfWalls(roomNumber) {
    const response = await inquirer.prompt({
        name: 'walls',
        type: 'number',
        message: `How many walls do you need to paint in room ${roomNumber}?`,
        validate: (value) => value > 0 || 'Please enter a valid number'
    });
    return response.walls;
}
;
// Function to calculate the area to paint for a given wall
async function calculateWallArea() {
    const wall = await inquirer.prompt([
        {
            name: 'length',
            type: 'number',
            message: 'Enter the wall length (in meters):',
            validate: (value) => value > 0 || 'Please enter a valid length'
        },
        {
            name: 'height',
            type: 'number',
            message: 'Enter the wall height (in meters):',
            validate: (value) => value > 0 || 'Please enter a valid height'
        }
    ]);
    let totalArea = wall.length * wall.height;
    let subtractArea = 0;
    let addMore = true;
    while (addMore) {
        const subtract = await inquirer.prompt({
            name: 'subtract',
            type: 'confirm',
            message: 'Do you need to subtract any area from this wall (e.g. for a window)?'
        });
        if (subtract.subtract) {
            const area = await inquirer.prompt([
                {
                    name: 'length',
                    type: 'number',
                    message: 'Enter the length of the area to subtract (in meters):',
                    validate: (value) => value > 0 || 'Please enter a valid length'
                },
                {
                    name: 'height',
                    type: 'number',
                    message: 'Enter the height of the area to subtract (in meters):',
                    validate: (value) => value > 0 || 'Please enter a valid height'
                }
            ]);
            subtractArea += area.length * area.height;
        }
        else {
            addMore = false;
        }
    }
    return totalArea - subtractArea;
}
;
async function main() {
    const area = await calculateWallArea();
    console.log(area);
}
main();
