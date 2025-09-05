const Contact = require('../models/Contact');

// Get all contacts (customers/vendors) for a business
const getContacts = async (req, res) => {
    try {
        const { type, search } = req.query;
        let query = { businessId: req.user._id };

        if (type) {
            query.type = type;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const contacts = await Contact.find(query).sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new contact
const createContact = async (req, res) => {
    try {
        const { name, phone, email, address, type } = req.body;

        const contact = await Contact.create({
            name,
            phone,
            email,
            address,
            type,
            businessId: req.user._id
        });

        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a contact
const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            businessId: req.user._id
        });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        const { name, phone, email, address, type } = req.body;

        contact.name = name || contact.name;
        contact.phone = phone || contact.phone;
        contact.email = email || contact.email;
        contact.address = address || contact.address;
        contact.type = type || contact.type;

        const updatedContact = await contact.save();
        res.json(updatedContact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a contact
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            businessId: req.user._id
        });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        await Contact.deleteOne({ _id: req.params.id });
        res.json({ message: 'Contact removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getContacts, createContact, updateContact, deleteContact };