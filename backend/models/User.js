import { DataTypes } from "sequelize";
import db from "../config/db.js";

const User = db.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nama: DataTypes.STRING(100),
    username: DataTypes.STRING(50),
    password: DataTypes.STRING(255),
    role: DataTypes.ENUM("admin", "user"),
  },
  { tableName: "users", timestamps: false }
);

export default User;
