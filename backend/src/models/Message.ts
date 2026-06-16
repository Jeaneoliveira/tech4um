import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/connection";
import { User } from "./User";

interface MessageSender {
  username: string;
} 

interface MessageAttributes {
  id: number;
  forum_id: number;
  sender_id: number;
  receiver_id: number | null;
  content: string;
  is_private: boolean;
  created_at?: Date;
  
  sender?: MessageSender;
}

interface MessageCreationAttributes
  extends Optional<MessageAttributes, "id" | "receiver_id" | "is_private" | "created_at"> {}

export class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  public id!: number;
  public forum_id!: number;
  public sender_id!: number;
  public receiver_id!: number | null;
  public content!: string;
  public is_private!: boolean;
  public created_at?: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    forum_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "messages",
    timestamps: false,
  }
);

Message.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
});