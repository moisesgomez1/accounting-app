// models/Transaction.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../lib/sequelize';

export interface TransactionAttributes {
  id: string;
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
  public id!: string;
  public date!: Date;
  public number!: string;
  public description!: string;
  public debit!: number;
  public credit!: number;
  public notes!: string;
  public userNotes?: string;
  public importedAt!: Date;
  public processedAt?: Date;
  public status!: 'unassigned' | 'in_progress' | 'completed';
  public assignedTo?: string;
  public bankStatementId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
      // This will be associated with User.id.
    },
    bankStatementId: {
      type: DataTypes.UUID,
      allowNull: false,
      // This references BankStatement.id.
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: true, // createdAt & updatedAt are enabled here.
  }
);

export default Transaction;
