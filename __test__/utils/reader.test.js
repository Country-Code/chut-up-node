const { fs } = require("../../utils/tools");
const path = require("path");
const MOCK_PATH = path.resolve(__dirname, "../mocks/utils/tools");

describe.skip("YAML Reader", () => {
    test("should read YAML file and parse data", () => {
        let data = fs.read.yaml(`${MOCK_PATH}/data.yaml`);

        expect(data).toEqual({
            name: "John Doe",
            age: 30,
            city: "New York",
            isStudent: false,
            grades: [
                { subject: "Math", score: 95 },
                { subject: "English", score: 88 },
            ],
        });
    });

    it("should return null for not found yaml file", () => {
        let data = fs.read.yaml(`${MOCK_PATH}/notFound.yaml`);
        expect(data).toBeNull();
    });

    it("should return empty object", () => {
        let data = fs.read.yaml(`${MOCK_PATH}/empty.yaml`);

        expect(data).toEqual({});
    });
});
