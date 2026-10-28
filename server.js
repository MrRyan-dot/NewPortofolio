
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

console.log("SERVER PORTOFOLIO AKTIF");

app.use(cors());
app.use(express.json());

// Website: berjalan secara lokal dari folder public.
// Di Vercel, file dalam public juga disajikan melalui CDN.
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Database dibuat hanya jika DATABASE_URL tersedia.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      max: 5
    })
  : null;

// Inisialisasi tabel dilakukan saat endpoint database dipanggil.
let databaseReady;

async function ensureDatabase() {
  if (!pool) {
    throw new Error("DATABASE_URL belum diatur.");
  }

  if (!databaseReady) {
    databaseReady = pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `).catch((error) => {
      // Izinkan percobaan ulang jika inisialisasi gagal.
      databaseReady = null;
      throw error;
    });
  }

  await databaseReady;
}

// Mengecek koneksi backend dan database.
app.get("/api/status", async (req, res) => {
  try {
    await ensureDatabase();
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

// Menyimpan pesan dari formulir Contact.
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
    await ensureDatabase();

    const result = await pool.query(
      `INSERT INTO contacts (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [name.trim(), email.trim(), message.trim()]
    );

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

// Jalankan server hanya saat dijalankan langsung dengan Node.js.
// Di Vercel, aplikasi diekspor untuk ditangani oleh platform.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Website berjalan di port ${PORT}`);
  });
}

module.exports = app;
