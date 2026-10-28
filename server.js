
const express = require("express");
const cors = require("cors");
const { DatabaseSync } = require("node:sqlite");

const app = express();
const PORT = 3000;

// Koneksi ke database SQLite
const db = new DatabaseSync("portfolio.db");

// Membuat tabel jika belum tersedia
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(cors());
app.use(express.json());

// Mengecek status backend
app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "Backend dan database berhasil berjalan!"
  });
});

// Menerima dan menyimpan pesan Contact
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body || {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Nama, email, dan pesan wajib diisi."
    });
  }

  try {
    const result = db.prepare(`
      INSERT INTO contacts (name, email, message)
      VALUES (?, ?, ?)
    `).run(
      name.trim(),
      email.trim(),
      message.trim()
    );

    console.log("Pesan berhasil disimpan ke database.");

    res.status(201).json({
      success: true,
      message: "Pesan berhasil disimpan!",
      id: Number(result.lastInsertRowid)
    });
  } catch (error) {
    console.error("Gagal menyimpan pesan:", error.message);

    res.status(500).json({
      success: false,
      message: "Pesan gagal disimpan ke database."
    });
  }
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Backend berjalan di http://localhost:${PORT}`);
  console.log("Database SQLite siap digunakan.");
});
