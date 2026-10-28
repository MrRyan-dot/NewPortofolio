
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Mengizinkan frontend mengirim request ke backend
app.use(cors());

// Membaca data JSON dari frontend
app.use(express.json());

// Tes status backend
app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "Backend Portfolio berhasil berjalan!"
  });
});

// Menerima pesan dari form Contact
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  // Validasi input
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

  // Tahap ini hanya menguji koneksi, belum menyimpan pesan
  console.log("Pesan Contact diterima:", {
    name: name.trim(),
    email: email.trim(),
    message: message.trim()
  });

  res.json({
    success: true,
    message: "Pesan berhasil diterima oleh backend!"
  });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Backend berjalan di http://localhost:${PORT}`);
});
