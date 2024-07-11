const { Contact } = require("./schemas/contact");

const getAllContacts = async (userId, page, limit) => {
  const skip = (page - 1) * limit;
  const results = await Contact.find({ owner: userId })
    .skip(skip)
    .limit(parseInt(limit));
  const totalContacts = await Contact.countDocuments();
  return {
    results,
    totalContacts,
    page: parseInt(page),
    limit: parseInt(limit),
  };
};

const getContactById = (id, userId) => {
  return Contact.findOne({ _id: id, owner: userId });
};

const createContact = async ({ name, email, phone, owner }) => {
  const existingContact = await Contact.findOne({ email });
  if (existingContact) {
    throw new Error("Email already in use");
  }
  const newContact = new Contact({ name, email, phone, owner });
  return await newContact.save();
};

const updateContact = (id, fields, userId) => {
  return Contact.findOneAndUpdate({ _id: id, owner: userId }, fields, {
    new: true,
  });
};

const removeContact = async (contactId, userId) => {
  return await Contact.findByIdAndDelete({ _id: contactId, owner: userId });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
};
