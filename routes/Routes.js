const express = require("express");
const router = express.Router();
const {
  getContact,
  createContact,
  deleteContact,
  putContact,
} = require("../controllers/ContactController");
const verifyToken = require("../middleware/tokenHandeler");

router.use(verifyToken);
router.route("/").get(getContact).post(createContact);
router.route("/:id").delete(deleteContact).patch(putContact);

module.exports = router;
