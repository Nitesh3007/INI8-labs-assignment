const db = require("../config/db");

exports.getDocuments = async (req, res) => {
  try {
    db.all("SELECT * FROM documents", [], (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error" });

      res.json(rows);
    });
  } catch (err) {
    console.error("ERROR: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
