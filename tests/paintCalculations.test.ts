import { calculateTotalLitres, recommendation } from '../src/paintCalculations';
import { User, Wall, Room, Paint } from '../src/interfaces';

// Mock data for testing
const mockPaint: Paint = {
    brand: 'Dulux',
    pricePerLitre: 17.99,
    coverage: 17,
    colour: 'White'
};

const mockWall: Wall = {
    totalLength: 5,
    totalWidth: 2,
    totalArea: 10,
    areaToSubtract: 2,
    areaToPaint: 8,
    paint: mockPaint,
    litresNeededToPaint: 0.47 // 8 / 17
};

const mockRoom: Room = {
    walls: [mockWall]
};

const mockUser: User = {
    name: 'John Doe',
    totalRooms: 1,
    totalWall: 1,
    rooms: [mockRoom]
};

describe('calculateTotalLitres', () => {
    it('should calculate the total litres of paint needed for a user', () => {
        const result = calculateTotalLitres(mockUser);
        expect(result).toEqual({ 'Dulux White': 0.47 });
    });
});

describe('recommendation', () => {
    it('should provide paint can recommendations and total amount', () => {
        const totalLitres = { 'Dulux White': 0.47 };
        const result = recommendation(totalLitres);
        expect(result.recommendations).toEqual({ 'Dulux White': [[1, 17.99]] });
        expect(result.totalAmount).toBe(17.99);
    });
});