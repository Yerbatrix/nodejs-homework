const service = require("../service/contacts");
const { contactValidationSchema } = require("../service/schemas/contact");

const get = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const results = await service.getAllContacts(userId);
    console.log("Fetched contacts:", results);
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const result = await service.getContactById(id, userId);
    console.log("Fetched contact by ID:", result);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const create = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const userId = req.user._id;
  const { error } = contactValidationSchema.validate({ name, email, phone });
  if (error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: error.details[0].message,
      data: "Bad Request",
    });
  }
  try {
    const result = await service.createContact({
      name,
      email,
      phone,
      owner: userId,
    });
    console.log("Created contact:", result);
    res.status(201).json({
      status: "success",
      code: 201,
      data: { contact: result },
    });
  } catch (e) {
    console.error(e);
    if (e.message === "Email already in use") {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Email already in use",
        data: "Bad Request",
      });
    }
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const userId = req.user._id;
  const { error } = contactValidationSchema.validate({
    name,
    email,
    phone,
  });
  if (error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: error.details[0].message,
      data: "Bad Request",
    });
  }
  try {
    const result = await service.updateContact(
      id,
      { name, email, phone },
      userId
    );
    console.log("Updated contact:", result);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateStatus = async (req, res, next) => {
  const { id } = req.params;
  const { favorite = false } = req.body;
  const userId = req.user._id;
  const { error } = contactValidationSchema.validate({ favorite });
  if (error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: error.details[0].message,
      data: "Bad Request",
    });
  }
  try {
    const result = await service.updateContact(id, { favorite }, userId);
    console.log("Updated contact status:", result);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const result = await service.removeContact(id, userId);
    console.log("Removed contact:", result);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  updateStatus,
  remove,
};
