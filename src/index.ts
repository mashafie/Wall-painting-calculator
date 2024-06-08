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
    canSize: {
      size: number;
      price: number;
    };
    colour: string;
}

// Wall interface
interface Wall {
    wallID: number
    length: number;
    width: number;
    area: number;
    costToPaint: number;
};

// Room interface
interface Room {
    roomID: number;
    walls: Wall[];
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


// main function
async function main() {
    const rooms = await askNumberOfRooms()
    console.log(`${rooms} rooms`)
    const walls = await askNumberOfWalls(rooms)
    console.log(`${walls} walls`)
}

main()

