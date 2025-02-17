// models/BankStatement.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../lib/sequelize';

interface BankStatementAttributes {
  id: string;
  statementDate: Date;
  importedAt: Date;
  fileName?: string;
}

type BankStatementCreationAttributes = Optional<BankStatementAttributes, 'id'>;

class BankStatement extends Model<BankStatementAttributes, BankStatementCreationAttributes>
  implements BankStatementAttributes {
  public id!: string;
  public statementDate!: Date;
  public importedAt!: Date;
  public fileName?: string;
}

BankStatement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    tableName: 'bank_statements',
    timestamps: false, // We don’t need createdAt/updatedAt here
  }
);

export default BankStatement;
