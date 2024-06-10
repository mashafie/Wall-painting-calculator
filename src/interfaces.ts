// Paint interface for a specific paint object
export interface Paint {
    brand: string;
    pricePerLitre: number;
    coverage: number; // m² per litre of paint
    colour: string;
}

// Wall interface
export interface Wall {
    totalLength: number;
    totalWidth: number;
    totalArea: number;
    areaToSubtract: number
    areaToPaint: number;
    paint: Paint;
    litresNeededToPaint: number;
};

// Room interface
export interface Room {
    walls: Wall[];
};

// User interface
export interface User {
    name: string;
    totalRooms: number;
    totalWall: number;
    rooms: Room[];
};

// Total required litres for each product interface
export interface TotalLitres {
    [key: string]: number;
}
