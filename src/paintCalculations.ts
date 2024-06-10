import { User, TotalLitres } from './interfaces.js';
import { paints } from './paintData.js';

// Function to calculate total litres from User object
export function calculateTotalLitres(user: User) {
    // Object to store total litres for each brand and color combination
    const totalLitres: { [key: string]: number } = {};

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
};

// Recommendation function
export function recommendation(totalLitres: { [key: string]: number }) {
    const recommendations: { [key: string]: [size: number, price: number][] } = {};
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
        const cans: [size: number, price: number][] = [];
  
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
  };

export function createTables(totalLitres: { [key: string]: number}, recommendations: { [key: string]: [size: number, price: number][] }, totalAmount: number) {
    // First table
    console.log();
    console.log("You require:");
    // Prints the resulting array of objects as a table to the console
    console.table(
        // Gets an array of all the keys in the totalLitres object and maps each key to an object with 2 properties
        Object.keys(totalLitres).map(key => ({
            "Product": key,
            // rounded to 2dp then conver from string to number
            "Required Amount (Litres)": parseFloat(totalLitres[key].toFixed(2))
        }))
    );

    // Second Table
    console.log();
    console.log("We recommend you buy:")
    const recommendationTable = [];

    for (const key in recommendations) {
        // Empty object to keey track of quanity for each can size for current brand and colour combo
        const canCounts: { [size: number]: number } = {};

        // Iterates over each recommended can value (size and price) for the current key in the array
        for (let i = 0; i < recommendations[key].length; i++) {
            const [size, price] = recommendations[key][i];
            // If can size is not already a jet in canCounts, initialise to 0
            if (!canCounts[size]) {
                canCounts[size] = 0;
            }
            // Increment count for the current can size
            canCounts[size]++;
        }

        // Iterate over the keys in canCounts to create rows for the recommendationTable
        for (const size in canCounts){
            // Each row is an object with the below 3 properties and pushed into the recommendationTable array
            recommendationTable.push({
                "Brand and Colour Combination": key,
                "Can Size (Litres)": parseFloat(size),
                "Quantity": canCounts[size]
            });
        }
    }
    // Print recommendation table
    console.table(recommendationTable);

    // Print the total cost
    console.log();
    console.log(`Total Cost: £${totalAmount.toFixed(2)}`);
  };