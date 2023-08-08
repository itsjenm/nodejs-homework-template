const Contacts = require("../models/contacts");

const contactsController = {
  async getContacts(req, res) {
    try {
      const data = await Contacts.find();
      res.json(data);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  async createContact(req, res) {
    try {
      const newContact = await Contacts.create(req.body);
      res.json(newContact);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  async getSingleContact(req, res) {
    try {
      const singleContact = await Contacts.findOne({ _id: req.params.id });
      res.json(singleContact);
    } catch (error) {
      console.log(error);
      res.json({ message: `${req.params.id} is not a valid ID` });
    }
  },
  async deleteContact(req, res) {
    try {
      await Contacts.findOneAndDelete({ _id: req.params.id });
      res.json("Employee was deleted");
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  async updateContact(req, res) {
    try {
      const updatedContact = await Contacts.findOneAndUpdate(
        // where we are updating
        { _id: req.params.id },
        // what is the new data
        { $set: req.body }, //checks if this exists, if it does it overrides the value
        // always return the latest value/change
        { new: true } // will always send us the new version
      );
      res.json(updatedContact);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  async updateFavorites(req, res) {
    try {
      const favoriteContacts = await Contacts.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      if (req.body === '') {
        res.status(400).json({ message: "missing field favorite"})
      }
      res.json(favoriteContacts)
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: "Not found"});
    }
  },
};

module.exports = contactsController;
