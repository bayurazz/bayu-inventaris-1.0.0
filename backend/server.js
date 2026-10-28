import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./config/db.js";
import User from "./models/User.js";
import Barang from "./models/Barang.js";
import Kategori from "./models/Kategori.js";

const app = express();
app.use(cors());
app.use(express.json());

Barang.belongsTo(Kategori, { foreignKey: "kategori_id" });
Kategori.hasMany(Barang, { foreignKey: "kategori_id" });

app.get("/api/barang", async (req, res) => {
  const data = await Barang.findAll({ include: Kategori });
  res.json(data);
});

app.get("/api/kategori", async (req, res) => {
  const data = await Kategori.findAll();
  res.json(data);
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Username atau password salah" });
  }

  res.json({ id: user.id, nama: user.nama, role: user.role });
});

//ini create barang coy
app.post("/api/barang", async (req, res) => {
  try {
    const { nama_barang, kategori_id, stok } = req.body;
    const baru = await Barang.create({ nama_barang, kategori_id, stok });
    res.status(201).json(baru);
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah barang" });
  }
});

//ini update barang coy
app.put("/api/barang/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_barang, kategori_id, stok } = req.body;

    await Barang.update({ nama_barang, kategori_id, stok }, { where: { id } });
    res.json({ message: "Barang berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui barang" });
  }
});

//ini delete barang coy
app.delete("/api/barang/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Barang.destroy({ where: { id } });
    res.json({ message: "Barang berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus barang" });
  }
});

//ini create kategori
app.post("/api/kategori", async (req, res) => {
  try {
    const { nama_kategori } = req.body;
    const buat = await Kategori.create({ nama_kategori });
    res.status(201).json(buat);
  } catch (error) {
    res.status(500).json({ message: "Gagal Menambah kategori" });
  }
});

//ini update kategori coy
app.put("/api/kategori/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kategori } = req.body;
    await Kategori.update({ nama_kategori }, { where: { id } });
    res.json({ message: "barang berhasil di update" });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui kategori" });
  }
});

//ini deleter kategori coy
app.delete("/api/kategori/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Kategori.destroy({ where: { id } });
    res.json({ message: "kategori berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal Menghapus kategori" });
  }
});

db.authenticate().then(() => {
  console.log("Database terhubung");
  app.listen(process.env.PORT, () =>
    console.log("Server jalan di port " + process.env.PORT)
  );
});
