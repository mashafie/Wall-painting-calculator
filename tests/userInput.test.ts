jest.mock('inquirer', () => ({
    prompt: jest.fn()
}));

import { validateNumberInput, validateStringInput, validateYesNoInput } from '../src/userInput';
import inquirer from 'inquirer';

describe('validateNumberInput', () => {
    it('should return true for valid number input', () => {
        expect(validateNumberInput('10')).toBe(true);
    });

    it('should return an error message for invalid number input', () => {
        expect(validateNumberInput('abc')).toBe('Please enter a valid number');
    });

    it('should return an error message for non-positive number', () => {
        expect(validateNumberInput('0')).toBe('Please enter a number greater than zero');
    });
});

describe('validateStringInput', () => {
    it('should return true for valid string input', () => {
        expect(validateStringInput('John')).toBe(true);
    });

    it('should return an error message for empty string', () => {
        expect(validateStringInput('')).toBe('Please enter a non-empty string');
    });

    it('should return an error message for short string', () => {
        expect(validateStringInput('Jo')).toBe('Please enter a string with at least 3 characters');
    });

    it('should return an error message for long string', () => {
        expect(validateStringInput('a'.repeat(51))).toBe('Please enter a string with no more than 50 characters');
    });
});

describe('validateYesNoInput', () => {
    it('should return true for valid yes/no input', () => {
        expect(validateYesNoInput('yes')).toBe(true);
        expect(validateYesNoInput('no')).toBe(true);
        expect(validateYesNoInput('y')).toBe(true);
        expect(validateYesNoInput('n')).toBe(true);
    });

    it('should return an error message for invalid input', () => {
        expect(validateYesNoInput('maybe')).toBe('Please enter yes/no or y/n');
    });
});

