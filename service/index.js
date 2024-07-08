const { Contact } = require("./schemas/contact");

const getAllContacts = async (userId) => {
  const contacts = await Contact.find({ owner: userId });
  console.log("Contacts from DB:", contacts);
  return contacts;
};

const getContactById = (id, userId) => {
  console.log("Getting contact by ID:", id);
  return Contact.findOne({ _id: id, owner: userId });
};

const createContact = async ({ name, email, phone, owner }) => {
  const existingContact = await Contact.findOne({ email });
  if (existingContact) {
    throw new Error("Email already in use");
  }
  const newContact = new Contact({ name, email, phone, owner });
  console.log("Creating contact:", { name, email, phone, owner });
  return await newContact.save();
};

const updateContact = (id, fields, userId) => {
  console.log("Updating contact ID:", id, "with fields:", fields);
  return Contact.findOneAndUpdate({ _id: id, owner: userId }, fields, {
    new: true,
  });
};

const removeContact = async (contactId, userId) => {
  console.log("Removing contact ID:", contactId);
  return await Contact.findByIdAndDelete({ _id: contactId, owner: userId });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
};
