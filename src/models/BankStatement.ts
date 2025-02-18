// models/BankStatement.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/sequelize';

interface BankStatementAttributes {
  id: number; // Changed from string to number
  statementDate: Date;
  importedAt: Date;
  fileName?: string;
}

type BankStatementCreationAttributes = Optional<BankStatementAttributes, 'id'>;

class BankStatement extends Model<BankStatementAttributes, BankStatementCreationAttributes>
  implements BankStatementAttributes {
  declare id: number;
  declare statementDate: Date;
  declare importedAt: Date;
  declare fileName?: string;
}

BankStatement.init(
  {
    id: {
      type: DataTypes.BIGINT, // or DataTypes.INTEGER if preferred
      primaryKey: true,
      autoIncrement: true,
    },
    statementDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    importedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'BankStatement',
    tableName: 'accounting_app_bank_statements',
    timestamps: false, // We don’t need createdAt/updatedAt here
    paranoid: true, // Enable soft deletes (deletedAt field)
    underscored: true,
  }
);

export default BankStatement;
