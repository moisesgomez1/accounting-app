// models/Transaction.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/sequelize';

export interface TransactionAttributes {
  id: number;
  date: Date;                // Transaction date (from Excel)
  number: string;            // Check number (mapped from Excel's "Check")
  description: string;       // Description
  debit: number;
  credit: number;
  notes: string;             // Read-only imported notes
  userNotes?: string;        // Editable notes by the user during processing
  importedAt: Date;
  processedAt?: Date;
  status: 'unassigned' | 'in_progress' | 'completed';
  assignedTo?: string;       // References User.id (UUID)
  bankStatementId: string;   // References BankStatement.id (UUID)
}

type TransactionCreationAttributes = Optional<
  TransactionAttributes,
  'id' | 'processedAt' | 'userNotes' | 'assignedTo'
>;

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes {
  declare id: number;
  declare date: Date;
  declare number: string;
  declare description: string;
  declare debit: number;
  declare credit: number;
  declare notes: string;
  declare userNotes?: string;
  declare importedAt: Date;
  declare processedAt?: Date;
  declare status: 'unassigned' | 'in_progress' | 'completed';
  declare assignedTo?: string;
  declare bankStatementId: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Transaction.init(
  {
    id: {
      type:  DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    debit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    credit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    userNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    importedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('unassigned', 'in_progress', 'completed'),
      allowNull: false,
      defaultValue: 'unassigned',
    },
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    bankStatementId: {
      type: DataTypes.BIGINT, // Change from DataTypes.UUID
      allowNull: false,
      // This references BankStatement.id.
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'accounting_app_bank_transactions',
    timestamps: true, // createdAt & updatedAt are enabled here.
    paranoid: true, // If you want to enable soft deletes (deletedAt field)
    underscored: true, // Use snake_case for automatically added attributes
  }
);

export default Transaction;
