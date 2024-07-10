const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const contact = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 70,
      required: true,
    },
    email: {
      type: String,
      minlength: 3,
      maxlength: 170,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      minlength: 3,
      maxlength: 170,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { versionKey: false, timestamps: true }
);

const contactValidationSchema = Joi.object({
  name: Joi.string().min(2).max(70).required(),
  email: Joi.string().min(3).max(170).required(),
  phone: Joi.string().min(3).max(170).required(),
  favorite: Joi.boolean(),
});

const Contact = mongoose.model("contact", contact);

module.exports = { Contact, contactValidationSchema };
