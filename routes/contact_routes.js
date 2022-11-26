const express = require('express');
const router = express.Router();
const debug = require("debug")('dev');
const { validateBody, ContactModel } = require("../models/contact_model");

router.post('/', async function (request, response) {
    try {
        let joiValidationResult = validateBody(request.body);
        if (joiValidationResult.error){
            console.log(request.body)
            return response.status(400)
                .json({
                    message: joiValidationResult.error
                        .details[0]
                        .message
                        .replace(/["]+/g, '')
                });
        }

        const existing_ones = await ContactModel.find()
        const new_uid = 1001 + existing_ones.length
        const contact = new ContactModel({ ...request.body, uid: new_uid })
        const inserted_data = await contact.save()
        response.status(200).json(inserted_data)
    } catch (error) {
        if (error.code && error.code === 11000)
            return response.status(400).json({ message: "Already created" })
        console.error(error)
        return response.status(500).json({ message: "Internal error" })
    }
})

router.get('/', async function (request, response) {
    try {
        const contactsList = await ContactModel.find()
        response.json(contactsList)
    } catch (e) {
        debug(e)
        response.status(500).json({ message: "Internal error" })
    }
})

router.get('/:_id', async function (request, response) {
    try {
        const contact = await ContactModel.findById(request.params._id)
        if(!contact)
            return response.status(404).json({ message: "Contact not found" })
        return response.status(200).json(contact)
    } catch (error) {
        debug(e)
        if(error.name && error.name === "CastError")
            return response.status(400).json({ message: "Invalid contact id" })
        return response.status(500).json({ message: "Internal error" })
    }
})

router.delete('/:id', async function (request, response) {
    try {

        const contact = await ContactModel.find({ _id: request.params.id })
        if(!contact)
            return response.status(404).json({ message: "contact not found" })
        await ContactModel.deleteOne({ _id: request.params.id })
        return response.status(200).json({ message: "success" })
    } catch (error) {
        console.error(error)
        return response.status(500).json({ message: "Internal error" })
    }
})

module.exports = router;