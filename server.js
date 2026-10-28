
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

console.log("SERVER PORTOFOLIO VERSI BARU AKTIF");

// Koneksi ke PostgreSQL Supabase
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum diatur di file .env");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

// Menampilkan website dari folder public
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  console.log("ROUTE HOME TERPANGGIL");
  res.status(200).send("ROUTE HOME BERHASIL!");
});
// Membuat tabel kontak jika belum ada
async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  console.log("Tabel contacts siap digunakan.");
}

// Mengecek status backend dan database
app.get("/api/status", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      success: true,
      message: "Backend terhubung ke PostgreSQL Supabase!"
    });
  } catch (error) {
    console.error("Pemeriksaan database gagal:", error.message);

    res.status(500).json({
      success: false,
      message: "Database belum dapat dihubungi."
    });
  }
});

// Menyimpan pesan dari formulir Contact
app.post("/api/contact", async (req, res) => {
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
    const result = await pool.query(
      `INSERT INTO contacts (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [name.trim(), email.trim(), message.trim()]
    );

    console.log("Pesan berhasil disimpan ke PostgreSQL.");

    res.status(201).json({
      success: true,
      message: "Pesan berhasil disimpan!",
      id: result.rows[0].id
    });
  } catch (error) {
    console.error("Gagal menyimpan pesan:", error.message);

    res.status(500).json({
      success: false,
      message: "Pesan gagal disimpan ke database."
    });
  }
});

// Siapkan database sebelum server mulai berjalan
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Website berjalan di port ${PORT}`);
      console.log("Backend terhubung ke PostgreSQL.");
    });
  })
  .catch((error) => {
    console.error("Gagal menyiapkan database:", error.message);
    process.exit(1);
  });
