const express = require("express");
const router = express.Router();

const { uploadDocument } = require("../controllers/uploadController");
const { getDocuments } = require("../controllers/listController");
const { downloadDocument } = require("../controllers/downloadController");
const { deleteDocument } = require("../controllers/deleteController");

router.post("/upload", uploadDocument);
router.get("/", getDocuments);
router.get("/:id", downloadDocument);
router.delete("/:id", deleteDocument);

module.exports = router;
