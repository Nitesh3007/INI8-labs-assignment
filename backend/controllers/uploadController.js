const db = require("../config/db");
const path = require("path");

exports.uploadFile = (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const file = req.files.file;

  if (file.mimetype !== "application/pdf") {
    return res.status(400).json({ message: "Only PDF allowed" });
  }

  const uploadPath = path.join(__dirname, "../uploads", file.name);

  file.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);

    db.run(
      `INSERT INTO documents (filename, filepath, filesize, created_at)
       VALUES (?, ?, ?, datetime('now'))`,
      [file.name, uploadPath, file.size],
      function (err) {
        if (err) return res.status(500).json(err);

        res.json({ message: "File uploaded", id: this.lastID });
      }
    );
  });
};
