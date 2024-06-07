import inquirer from 'inquirer';

interface Paint {
    brand: string;
    pricePerLitre: number;
    coverage: number;
    canSize: {size: number, price: number}[];
};

// List of paint brands
const paints: Paint[] = [
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
async function askNumberOfRooms(): Promise<number> {
    const response = await inquirer.prompt({
        name: 'rooms',
        type: 'number',
        message: 'How many rooms do you need to paint?',
        validate: (value) => value > 0 || 'Please enter a valid number'
    });
    return response.rooms;
};

// Function to ask for the number of walls in a room
async function askNumberOfWalls(roomNumber: number): Promise<number> {
    const response = await inquirer.prompt({
      name: 'walls',
      type: 'number',
      message: `How many walls do you need to paint in room ${roomNumber}?`,
      validate: (value) => value > 0 || 'Please enter a valid number'
    });
    return response.walls;
  }
