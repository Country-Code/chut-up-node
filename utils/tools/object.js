const filter = (obj, fields) => {
    const extractedFields = [];
    const objects = Array.isArray(obj) ? obj : [obj];
    for (let i = 0; i < objects.length; i++) {
        let resultObject = {};
        fields.forEach((field) => {
            if (objects[i][field] !== undefined) {
                resultObject[field] = objects[i][field];
            }
        });
        extractedFields[i] =
            Object.keys(resultObject).length !== 0 ? resultObject : objects[i];
    }

    return Array.isArray(obj) ? extractedFields : extractedFields[0];
};

module.exports = { filter };
