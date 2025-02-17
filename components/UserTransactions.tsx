"use client";
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';

export type Transaction = {
  id: number;
  date: string;             // Date of transaction
  number: string;           // Transaction reference/number
  description: string;      // Description of the transaction
  debit: number;            // Debit amount (negative values stored as negatives)
  credit: number;           // Credit amount
  notes: string;            // Read-only imported notes
  importedAt: string;       // Timestamp when imported
  bankStatementId: string;  // Identifier linking to the bank statement
  processedAt?: string;     // Timestamp when the transaction was completed (optional)
  status: string;           // Workflow status (e.g., "unassigned", "in_progress", "completed")
  assignedTo?: string;      // User assigned to this transaction
  userNotes?: string;       // Editable notes added by the user (Candice)
};

type UserTransactionsProps = {
  data: Transaction[];
};

const UserTransactions: React.FC<UserTransactionsProps> = ({ data }) => {
  // Simulate the current logged-in user.
  const currentUser = "Candice";

  // Filter the incoming data to only include transactions assigned to Candice.
  const [userData, setUserData] = React.useState<Transaction[]>(() =>
    data.filter(tx => tx.assignedTo === currentUser)
  );

  // Handler to update the userNotes for a transaction.
  const handleNoteChange = (id: number, note: string) => {
    setUserData(prevData =>
      prevData.map(tx =>
        tx.id === id ? { ...tx, userNotes: note } : tx
      )
    );
  };

  // Handler to mark a transaction as completed.
  const handleMarkCompleted = (id: number) => {
    const currentTimestamp = new Date().toISOString();
    setUserData(prevData =>
      prevData.map(tx =>
        tx.id === id ? { ...tx, status: 'completed', processedAt: currentTimestamp } : tx
      )
    );
  };

  // Define the table columns.
  const columns = React.useMemo<ColumnDef<Transaction, unknown>[]>(() => [
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'number',
      header: 'Number',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'debit',
      header: 'Debit',
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return value !== 0 ? `($${Math.abs(value).toFixed(2)})` : '-';
      },
    },
    {
      accessorKey: 'credit',
      header: 'Credit',
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return value !== 0 ? `$${value.toFixed(2)}` : '-';
      },
    },
    {
      accessorKey: 'notes',
      header: 'Imported Notes',
      // This column is read-only.
    },
    {
      accessorKey: 'userNotes',
      header: 'Your Notes',
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <input
            type="text"
            className="border p-1 text-sm w-full"
            value={transaction.userNotes || ""}
            onChange={(e) => handleNoteChange(transaction.id, e.target.value)}
            placeholder="Add your notes..."
          />
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      // Actions column: allows marking a transaction as completed.
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const transaction = row.original;
        if (transaction.status !== 'completed') {
          return (
            <button
              onClick={() => handleMarkCompleted(transaction.id)}
              className="text-green-600 underline text-sm"
            >
              Mark Completed
            </button>
          );
        } else {
          return (
            <span className="text-gray-500 text-sm">Completed</span>
          );
        }
      },
    },
  ], []);

  // Create the table instance using TanStack Table.
  const table = useReactTable({
    data: userData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">My Transactions</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTransactions;
