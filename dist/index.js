import { askUserName, askNumberOfRooms, askNumberOfWalls, createWall } from './userInput.js';
import { calculateTotalLitres, recommendation, createTables } from './paintCalculations.js';
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
        // Step 4: Create each wall object using the createWall function and add it to the wall array
        for (let j = 1; j <= numberOfWalls; j++) {
            const wall = await createWall(j);
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
        // Calculates the total number of walls in the rooms array
        totalWall: rooms.reduce((total, room) => total + room.walls.length, 0),
        rooms: rooms
    };
    // Step 5:  Calculate total litres needed for each brand
    const totalLitres = calculateTotalLitres(user);
    // Step 6: Recommendation for cans to buy and total amount
    const { recommendations, totalAmount } = recommendation(totalLitres);
    // Step 7: Turn recommendations into a table
    createTables(totalLitres, recommendations, totalAmount);
}
// Run the main function
main();
