"use client";
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Disclosure } from '@headlessui/react';

export type Transaction = {
  id: number;
  date: string;             // Date of transaction
  number: string;           // Transaction reference/number
  description: string;      // Description of the transaction
  debit: number;            // Debit amount (negative values stored as negatives)
  credit: number;           // Credit amount
  notes: string;            // Read-only imported notes
  // Extra details (not always shown)
  importedAt: string;       // Timestamp when imported
  bankStatementId: string;  // Identifier linking to the bank statement
  processedAt?: string;     // Timestamp when the transaction was completed (optional)
  status: string;           // Workflow status (e.g., "unassigned", "in_progress", "completed")
  assignedTo?: string;      // User assigned to this transaction
};

type MasterTableProps = {
  data: Transaction[];
};

const MasterTable: React.FC<MasterTableProps> = ({ data }) => {
  // Initialize local state with the passed-in data
  const [tableData, setTableData] = React.useState<Transaction[]>(data);

  // Simulate the current logged-in user
  const currentUser = "Candice";

  // Handler for "Grabbing" a transaction
  const handleGrab = (id: number) => {
    setTableData((prevData) =>
      prevData.map((tx) =>
        tx.id === id
          ? { ...tx, status: "in_progress", assignedTo: currentUser }
          : tx
      )
    );
  };

  // Define columns. Notice we add a custom "Actions" column for grabbing transactions.
  const columns = React.useMemo<ColumnDef<Transaction, unknown>[]>(
    () => [
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
        header: 'Notes',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'assignedTo',
        header: 'Assigned To',
      },
      {
        // Actions column: displays a "Grab Transaction" button if unassigned.
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const transaction = row.original;
          if (transaction.status === "unassigned") {
            return (
              <button
                onClick={() => handleGrab(transaction.id)}
                className="text-green-600 underline text-sm"
              >
                Grab Transaction
              </button>
            );
          } else if (transaction.assignedTo === currentUser) {
            return (
              <span className="text-blue-600 text-sm">
                You grabbed this
              </span>
            );
          } else {
            return (
              <span className="text-gray-500 text-sm">
                Assigned to {transaction.assignedTo}
              </span>
            );
          }
        },
      },
      {
        // Details column: toggles extra details (Imported At, Bank Statement, Processed At)
        id: 'details',
        header: 'Details',
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <Disclosure>
              {({ open }) => (
                <div>
                  <Disclosure.Button className="text-blue-600 underline text-sm">
                    {open ? 'Hide Details' : 'Show Details'}
                  </Disclosure.Button>
                  <Disclosure.Panel className="mt-2 text-xs text-gray-500">
                    <div>
                      <strong>Imported At:</strong> {transaction.importedAt}
                    </div>
                    <div>
                      <strong>Bank Statement:</strong> {transaction.bankStatementId}
                    </div>
                    <div>
                      <strong>Processed At:</strong> {transaction.processedAt || 'N/A'}
                    </div>
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          );
        },
      },
    ],
    [currentUser]
  );

  // Create the table instance using TanStack Table
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
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

export default MasterTable;
