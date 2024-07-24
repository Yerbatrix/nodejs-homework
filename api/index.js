const express = require("express");
const router = new express.Router();
const ctrlContact = require("../controller/contacts");
const ctrlUser = require("../controller/user");
const passport = require("passport");

const auth = passport.authenticate("jwt", { session: false });

router.get("/contacts", auth, ctrlContact.get);
router.get("/contacts/:id", auth, ctrlContact.getById);
router.post("/contacts", auth, ctrlContact.create);
router.put("/contacts/:id", auth, ctrlContact.update);
router.patch("/contacts/:id/favorite", auth, ctrlContact.updateStatus);
router.delete("/contacts/:id", auth, ctrlContact.remove);

router.post("/users/signup", ctrlUser.signup);
router.post("/users/login", ctrlUser.login);
router.delete("/users/logout", auth, ctrlUser.logout);
router.get("/users/current", auth, ctrlUser.current);
router.get("/users/verify/:verificationToken", ctrlUser.verify);
router.post("/users/verify", ctrlUser.resendVerificationEmail);

module.exports = router;
