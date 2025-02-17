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
  date: string;
  number: string;
  description: string;
  debit: number;
  credit: number;
  notes: string;
  importedAt: string;
  bankStatementId: string;
  processedAt: string;
  status: string;
  assignedTo: string;
};

interface MasterTableProps {
  data: Transaction[];
  onGrab?: (id: number) => void;
  currentUser?: string;
}

const MasterTable: React.FC<MasterTableProps> = ({
  data,
  onGrab,
  currentUser = "Candice",
}) => {
  const columns = React.useMemo<ColumnDef<Transaction, unknown>[]>(
    () => [
      { accessorKey: 'date', header: 'Date' },
      { accessorKey: 'number', header: 'Number' },
      { accessorKey: 'description', header: 'Description' },
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
      { accessorKey: 'notes', header: 'Notes' },
      { accessorKey: 'status', header: 'Status' },
      { accessorKey: 'assignedTo', header: 'Assigned To' },
      {
        // Actions column for picking up transactions
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const transaction = row.original;
          if (transaction.status === "unassigned") {
            return (
              <button
                onClick={() => onGrab && onGrab(transaction.id)}
                className="text-green-600 underline text-sm"
              >
                Grab Transaction
              </button>
            );
          } else if (transaction.assignedTo === currentUser) {
            return (
              <span className="text-blue-600 text-sm">You grabbed this</span>
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
        // Details column to show extra information on demand.
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
    [onGrab, currentUser]
  );

  const table = useReactTable({
    data,
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
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
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
