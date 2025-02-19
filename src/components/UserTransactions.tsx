"use client";
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Disclosure } from '@headlessui/react';
import NoteCell from './NoteCell';

export type Transaction = {
  id: number;
  date: string; // ISO date string
  number: string;
  description: string;
  debit: number;    // For display/calculation purposes, you may want to use numbers here
  credit: number;
  notes: string;
  importedAt: string;
  bankStatementId: string;
  processedAt?: string;
  status: 'unassigned' | 'in_progress' | 'completed';
  assignedTo?: string;
  userNotes?: string;
};

type UserTransactionsProps = {
  data: Transaction[];
  // Callback for updating notes on a transaction.
  onNoteChange: (id: number, note: string) => void;
  // Callback for marking a transaction as complete.
  onMarkCompleted: (id: number) => void;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const UserTransactions: React.FC<UserTransactionsProps> = ({ data, onNoteChange, onMarkCompleted }) => {
  // Define columns for the table
  const columns = React.useMemo<ColumnDef<Transaction, unknown>[]>(() => [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ getValue }) => formatDate(getValue() as string),
    },
    { accessorKey: 'number', header: 'Number' },
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'debit',
      header: 'Debit',
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return value ? `($${value})` : '-';
      },
    },
    {
      accessorKey: 'credit',
      header: 'Credit',
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return value ? `$${value}` : '-';
      },
    },
    { accessorKey: 'notes', header: 'Imported Notes' },
    {
      accessorKey: 'userNotes',
      header: 'Your Notes',
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <NoteCell
            transactionId={transaction.id}
            initialNote={transaction.userNotes}
            onUpdate={onNoteChange}
          />
        );
      },
    },
    { accessorKey: 'status', header: 'Status' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const transaction = row.original;
        // Only show the "Mark Completed" button if not already complete.
        if (transaction.status !== 'completed') {
          return (
            <button
              onClick={() => onMarkCompleted(transaction.id)}
              className="text-green-600 underline text-sm"
            >
              Mark Completed
            </button>
          );
        } else {
          return <span className="text-gray-500 text-sm">Completed</span>;
        }
      },
    },
    {
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
                    <strong>Imported At:</strong> {formatDate(transaction.importedAt)}
                  </div>
                  <div>
                    <strong>Bank Statement:</strong> {transaction.bankStatementId}
                  </div>
                  <div>
                    <strong>Processed At:</strong> {transaction.processedAt ? formatDate(transaction.processedAt) : 'N/A'}
                  </div>
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        );
      },
    },
  ], [onNoteChange, onMarkCompleted]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
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

export default UserTransactions;