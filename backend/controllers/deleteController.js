const fs = require("fs");
const db = require("../config/db");

exports.deleteDocument = async (req, res) => {
  try {
    const id = req.params.id;

    db.get("SELECT filepath FROM documents WHERE id = ?", [id], (err, row) => {
      if (!row) {
        return res.status(404).json({ message: "Document not found" });
      }

      fs.unlink(row.filepath, () => {
        db.run("DELETE FROM documents WHERE id = ?", id, (err) => {
          if (err) {
            return res.status(500).json({ message: "Database delete error" });
          }

          res.json({ message: "Deleted successfully" });
        });
      });
    });
  } catch (err) {
    console.error("ERROR: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
