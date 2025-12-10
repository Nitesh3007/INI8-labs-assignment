const db = require("../config/db");

exports.downloadDocument = async (req, res) => {
  try {
    const id = req.params.id;

    db.get("SELECT * FROM documents WHERE id = ?", [id], (err, row) => {
      if (err || !row) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.download(row.filepath, row.filename);
    });
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
