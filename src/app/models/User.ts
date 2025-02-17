// models/User.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../lib/sequelize';

interface UserAttributes {
  id: string;
  user_firstname: string;
  user_lastname: string;
  lae_agent_id?: string;
  department?: string;
}

// Use a type alias instead of an empty interface.
type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public user_firstname!: string;
  public user_lastname!: string;
  public lae_agent_id?: string;
  public department?: string;
  
  // Since timestamps are not needed, we omit createdAt/updatedAt.
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generate UUID if not provided
      allowNull: false,
      primaryKey: true,
    },
    user_firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lae_agent_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false, // No createdAt or updatedAt
  }
);

export default User;
