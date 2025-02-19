"use client";
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";

export type Transaction = {
  id: number;
  date: string;
  number: string;
  description: string;
  debit: string;
  credit: string;
  notes: string;
  userNotes?: string;
  importedAt: string;
  bankStatementId: string;
  processedAt: string;
  status: string;
  assignedTo: string;
  createdAt: string;
  assignee?: {
    user_firstname: string;
    user_lastname: string;
    id: string;
  };
};

interface MasterTableProps {
  data: Transaction[];
  onGrab?: (id: number) => void;
  currentUser?: string | null;
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const MasterTable: React.FC<MasterTableProps> = ({
  data,
  onGrab,
  currentUser,
}) => {
  const columns = React.useMemo<ColumnDef<Transaction, unknown>[]>(
    () => [
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
          const value = getValue() as string;
          return value ? `($${value})` : '-';
        },
      },
      {
        accessorKey: 'credit',
        header: 'Credit',
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return value ? `$${value}` : '-';
        },
      },
      {
        id: 'notes',
        header: 'Notes',
        cell: ({ row }) => {
          const { notes, userNotes } = row.original;
          // Show both if userNotes exist; otherwise just the imported notes.
          if (userNotes && userNotes.trim()) {
            return (
              <div>
                <div>{userNotes}</div>
              </div>
            );
          }
          return <span>{notes || '-'}</span>;
        },
      },
      { accessorKey: 'status', header: 'Status' },
      {
        id: 'assignedTo',
        header: 'Assigned To',
        cell: ({ row }) => {
          const transaction = row.original;
          return transaction.assignee
            ? `${transaction.assignee.user_firstname} ${transaction.assignee.user_lastname}`
            : '';
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const transaction = row.original;
          // If the transaction is unassigned, show the grab button.
          if (transaction.status === "unassigned") {
            return (
              <button
                onClick={() => onGrab && onGrab(transaction.id)}
                className="text-green-600 underline text-sm"
              >
                Grab Transaction
              </button>
            );
          }
          // Check if the assignee exists and if the current user is the assignee.
          else if (transaction.assignee && transaction.assignee.id === currentUser) {
            return <span className="text-blue-600 text-sm">You grabbed this</span>;
          }
          // Otherwise, if the assignee exists, display the first and last name.
          else if (transaction.assignee) {
            return (
              <span className="text-gray-500 text-sm">
                Assigned to {transaction.assignee.user_firstname} {transaction.assignee.user_lastname}
              </span>
            );
          }
          // Optionally, if there's no assignee, display nothing or a fallback message.
          return null;
        },
      },
      {
        id: "details",
        header: "Details",
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <Disclosure>
              {({ open }) => (
                <div>
                  <DisclosureButton className="text-blue-600 underline text-sm">
                    {open ? "Hide Details" : "Show Details"}
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 text-xs text-gray-500">
                    <div>
                      <strong>Imported At:</strong> {transaction.importedAt}
                    </div>
                    <div>
                      <strong>Bank Statement:</strong> {transaction.bankStatementId}
                    </div>
                    <div>
                      <strong>Processed At:</strong> {transaction.processedAt || "N/A"}
                    </div>
                  </DisclosurePanel>
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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
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
        <tbody className="bg-white divide-y divide-gray-100">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"
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