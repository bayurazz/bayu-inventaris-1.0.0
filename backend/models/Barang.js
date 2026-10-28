// models/Barang.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Barang = db.define(
  "Barang",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    kategori_id: DataTypes.INTEGER,
    nama_barang: DataTypes.STRING(150),
    stok: DataTypes.INTEGER,
  },
  {
    tableName: "barang",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Barang;
