import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection";

export const Forum = sequelize.define("Forum", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "forums",
  timestamps: false,
});
import { User } from "./User";

Forum.belongsTo(User, { foreignKey: "created_by", as: "creator" });
