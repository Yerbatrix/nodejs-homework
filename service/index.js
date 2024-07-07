const { Contact } = require("./schemas/contact");

const getAllContacts = async () => {
  const contacts = await Contact.find();
  console.log("Contacts from DB:", contacts);
  return contacts;
};

const getContactById = (id) => {
  console.log("Getting contact by ID:", id);
  return Contact.findOne({ _id: id });
};

const createContact = ({ name, email, phone }) => {
  console.log("Creating contact:", { name, email, phone });
  return Contact.create({ name, email, phone });
};

const updateContact = (id, fields) => {
  console.log("Updating contact ID:", id, "with fields:", fields);
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const removeContact = async (contactId) => {
  console.log("Removing contact ID:", contactId);
  return await Contact.findByIdAndDelete(contactId);
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
};
