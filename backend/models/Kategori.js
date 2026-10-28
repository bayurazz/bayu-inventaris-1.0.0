// models/Kategori.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Kategori = db.define(
  "Kategori",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nama_kategori: DataTypes.STRING(100),
  },
  { tableName: "kategori", timestamps: false }
);

export default Kategori;
