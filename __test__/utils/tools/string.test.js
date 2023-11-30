const string = require("../../../utils/tools/string");

describe('test string tool', () => { 
    it("should return the same string", ()=> {
        let message = "message without variables.";
        expect(string.replaceVariables(message)).toBe(message)
    });
    it("should change available variable", ()=> {
        let message = "my name is {name}.";
        let result = "my name is Soufiane.";
        expect(string.replaceVariables(message, {name: "Soufiane"})).toBe(result)
    });
    it("should change not available variable", ()=> {
        let message = "my name is {name}.";
        let result = "my name is '#N/A'.";
        expect(string.replaceVariables(message)).toBe(result)
    });
 })