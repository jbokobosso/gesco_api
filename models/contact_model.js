const Joi = require('joi');
const mongoose = require("mongoose");

const contact_schema = new mongoose.Schema({
    uid: { type: Number, required: false },
    lastname: { type: String, required: true },
    firstname: { type: String, required: true },
    phone: { type: String, require: true },
    email: { type: String, require: true, unique: true }
})


const ContactModel = mongoose.model("Contact", contact_schema)

function validateBody(bodyObject) {
    const bodySchema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().required()
    })
    const validationResult = bodySchema.validate(bodyObject)
    return validationResult;
}

module.exports.validateBody = validateBody
module.exports.ContactModel = ContactModel