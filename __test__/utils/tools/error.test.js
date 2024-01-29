const errorUtil = require("../../../utils/tools/errorUtil");

describe("Test generate error", () => {
    it("should return simple error", () => {
        let generatedError = errorUtil.generateError();

        expect(generatedError).toHaveProperty(
            "code",
            "UNEXPECTED_INTERNAL_SERVER_ERROR"
        );
        expect(generatedError).toHaveProperty("status", 500);
        expect(generatedError).toHaveProperty("message", "");
    });
    it("should return customized error message", () => {
        let generatedError = errorUtil.generateError(
            {
                message:
                    "message with {firstVar},  {secondVar} and {missedVar}.",
            },
            { firstVar: "first value", secondVar: "second value" }
        );

        expect(generatedError).toHaveProperty(
            "message",
            "message with first value,  second value and '#N/A'."
        );
    });
    it("should return customized error code", () => {
        let generatedError = errorUtil.generateError({
            code: "NTERNAL_SERVER_ERROR",
        });

        expect(generatedError).toHaveProperty("code", "NTERNAL_SERVER_ERROR");
    });
    it("should return customized error code", () => {
        let generatedError = errorUtil.generateError({ status: 404 });

        expect(generatedError).toHaveProperty("status", 404);
    });
});
