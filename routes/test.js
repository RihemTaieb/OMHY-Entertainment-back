const express = require("express");
const { TestController, upload } = require("../controllers/testController");
const router = express.Router();

// Route pour récupérer tous les tests
router.get("/", TestController.getAllTests);

// Route pour créer un test avec des images
router.post("/", upload.array("photo", 5), TestController.createTest);

// Route pour récupérer un test par ID
router.get("/:id", TestController.getTestById);

// Route pour mettre à jour un test
router.put("/:id", upload.array("photo", 5), TestController.updateTest);

// Route pour supprimer un test
router.delete("/:id", TestController.deleteTest);

module.exports = router;
