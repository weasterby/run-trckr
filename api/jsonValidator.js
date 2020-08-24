const Ajv = require('ajv');
const ajv = new Ajv();

const userUpdateSchema = {
    "type": "object",
    "properties": {
        "name": {"type": "string", "maxLength": 120},
        "email": {"type": "string", "pattern": "^\\S+@\\S+\\.\\S+$", "maxLength": 120},
        "age_requirement_met": {"type": "boolean"},
        "user_consent": {"type": "boolean"}
    },
    "additionalProperties": false,
    "require": ["name", "email"]
};

module.exports = function () {
    ajv.addSchema(userUpdateSchema, "userUpdate")

    return ajv;
};