const Joi = require("joi");
const { contactSchema, statusSchema } = require("../schemas/contactSchemas");

const validateBody = (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: error.details[0].message,
      data: "Bad Request",
    });
  }
  next();
};

const validateStatus = (req, res, next) => {
  const { error } = statusSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: error.details[0].message,
      data: "Bad Request",
    });
  }
  next();
};

module.exports = {
  validateBody,
  validateStatus,
};
