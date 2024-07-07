const express = require("express");
const router = express.Router();
const ctrlContact = require("../controller/index");
const ctrlUser = require("../controller/user");

router.get("/contacts", ctrlContact.get);
router.get("/contacts/:id", ctrlContact.getById);
router.post("/contacts", ctrlContact.create);
router.put("/contacts/:id", ctrlContact.update);
router.patch("/contacts/:id/favorite", ctrlContact.updateStatus);
router.delete("/contacts/:id", ctrlContact.remove);

router.post("/users/signup", ctrlUser.signup);
router.post("/users/login", ctrlUser.login);
router.delete("/users/logout", ctrlUser.auth, ctrlUser.logout);
router.get("/users/current", ctrlUser.auth, ctrlUser.current);

module.exports = router;
