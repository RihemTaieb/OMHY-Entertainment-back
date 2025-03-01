const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = require('../utils/multer'); // Make sure this file exists and is properly set up
const path = require("path");
const GroupeController = require("../controllers/groupeController");


// Routes
router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "photoCouverture", maxCount: 1 },
  ]),
  GroupeController.createGroupe
);

router.put(
  "/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "photoCouverture", maxCount: 1 },
  ]),
  GroupeController.updateGroupe
);

router.get("/", GroupeController.getAllGroupe);
router.get("/:id", GroupeController.getGroupeById);
router.delete("/:id", GroupeController.deleteGroupe);

module.exports = router;
