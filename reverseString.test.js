const { add, reverseString } = require('./reverseString')

describe('Add function suite', () => { 
    test('Should give you 2 when 1 + 1 is added', () => {
        // expected = what wass it suppose to be
        // result = what did the code receive 
        const result = add(1, 1);
        expect(result).toBe(2);
     });
     test("Should give me 12 when I pass in an 8 and 4", () => {
        const result = add(8, 4);
        expect(result).toBe(12);
     });
    
 });

 describe("Reverse string suite", () => {
    test("Should give me rac when i pass car", () => {
        const result = reverseString('car');
        expect(result).toBe('rac')
    });
    test("Should give me nworg when i pass in grown", () => {
        const result = reverseString('grown');
        expect(result).toBe('nworg');
     });
     test("Should return yay a palindrome when given a palindrome", () => {
        const result = reverseString('racecar');
        expect(result).toBe("Yay a palindrome")
     })
 })