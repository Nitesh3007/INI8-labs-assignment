const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const fs = require("fs");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

// UPLOAD PDF
app.post("/documents/upload", (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const file = req.files.file;

  // PDF VALIDATION
  if (file.mimetype !== "application/pdf") {
    return res.status(400).json({ message: "Only PDF allowed" });
  }

  const uploadPath = __dirname + "/uploads/" + file.name;

  file.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);

    // Save metadata
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
});

// LIST DOCUMENTS
app.get("/documents", (req, res) => {
  db.all("SELECT * FROM documents", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// DOWNLOAD DOCUMENT
app.get("/documents/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM documents WHERE id = ?", [id], (err, row) => {
    if (err || !row) return res.status(404).json({ message: "Not found" });

    res.download(row.filepath, row.filename);
  });
});

// DELETE DOCUMENT
app.delete("/documents/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT filepath FROM documents WHERE id = ?", [id], (err, row) => {
    if (!row) return res.status(404).json({ message: "Not found" });

    fs.unlink(row.filepath, () => {
      db.run("DELETE FROM documents WHERE id = ?", id);
      res.json({ message: "Deleted successfully" });
    });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
