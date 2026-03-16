import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/db.config.js";

interface UserAttributes {
  id: number;
  providerId: string;
  email: string;
  role: "admin" | "hr";
  isActive: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "role" | "isActive"> {}

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  declare id: number;
  declare providerId: string;
  declare email: string;
  declare role: "admin" | "hr";
  declare isActive: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "hr"),
      defaultValue: "admin",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
  }
);

export default User;