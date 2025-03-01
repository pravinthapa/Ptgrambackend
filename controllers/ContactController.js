const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.find({user_id:req.user.id});
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found.");
  }
 
  res.status(200).json(contact);
});

const createContact = asyncHandler(async (req, res) => {            
  const { name, email, contact } = req.body;
  if (!name || !email || !contact) {
    res.status(400);
    throw new Error("All fields  are required.");
  }
  const contacts = await Contact.create({
    name,
    email,
    contact,
    user_id: req.user.id,
  });
  res.status(201).json(contacts);
});
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found.");
  }
  await Contact.findByIdAndDelete(req.params.id);
  res.status(200).json(contact);
});

const putContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found.");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

module.exports = {
  getContact,
  createContact,
  deleteContact,
  putContact,
};
