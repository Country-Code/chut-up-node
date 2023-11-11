const reader = require("../../utils/reader")
const path = require('path');
const MOCK_PATH  = path.resolve(__dirname , '../mocks/utils/reader');

describe('YAML Reader', () => {
    test('should read YAML file and parse data', () => {
        let data = reader.yaml(`${MOCK_PATH}/data.yaml`)

        expect(data).toEqual({
            name: 'John Doe',
            age: 30,
            city: 'New York',
            isStudent: false,
            grades: [
                { subject: 'Math', score: 95 },
                { subject: 'English', score: 88 },
            ],
        });
    });

    it("should return null for not found yaml file", ()=> {
        let data = reader.yaml(`${MOCK_PATH}/notFound.yaml`)
        expect(data).toBeNull()
    })

    it("should return empty object", ()=> {
        let data = reader.yaml(`${MOCK_PATH}/empty.yaml`)

        expect(data).toEqual({})
    })

});
