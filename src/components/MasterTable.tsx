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

export default function MasterTable({ data, onGrab, currentUser }: MasterTableProps) {
  const columns = React.useMemo<ColumnDef<Transaction, unknown>[]>(() => [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-800">{formatDate(getValue() as string)}</span>
      ),
    },
    {
      accessorKey: 'number',
      header: 'Number',
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-800">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ getValue }) => (
        <span className="font-bold text-sm text-gray-800">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'debit',
      header: 'Debit',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return value ? (
          <span className="font-bold text-sm text-gray-800">{`($${value})`}</span>
        ) : (
          <span className="text-sm text-gray-800">-</span>
        );
      },
    },
    {
      accessorKey: 'credit',
      header: 'Credit',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return value ? (
          <span className="font-bold text-sm text-gray-800">{`$${value}`}</span>
        ) : (
          <span className="text-sm text-gray-800">-</span>
        );
      },
    },
    {
      id: 'notes',
      header: 'Notes',
      cell: ({ row }) => {
        const { notes, userNotes } = row.original;
        return userNotes && userNotes.trim() ? (
          <div className="text-sm text-gray-800">{userNotes}</div>
        ) : (
          <span className="text-sm text-gray-800">{notes || '-'}</span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-800">{getValue() as string}</span>
      ),
    },
    {
      id: 'assignedTo',
      header: 'Assigned To',
      cell: ({ row }) => {
        const transaction = row.original;
        return transaction.assignee ? (
          <span className="text-sm text-gray-800">
            {transaction.assignee.user_firstname} {transaction.assignee.user_lastname}
          </span>
        ) : (
          <span className="text-sm text-gray-800"></span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const transaction = row.original;
        if (transaction.status === "unassigned") {
          return (
            <button
              onClick={() => onGrab && onGrab(transaction.id)}
              className="underline text-sm text-gray-800 hover:text-gray-600"
            >
              Grab Transaction
            </button>
          );
        } else if (transaction.assignee && transaction.assignee.id === currentUser) {
          return (
            <span className="text-sm font-semibold text-gray-800">
              You grabbed this
            </span>
          );
        } else if (transaction.assignee) {
          return (
            <span className="text-sm text-gray-800">
              Assigned to {transaction.assignee.user_firstname} {transaction.assignee.user_lastname}
            </span>
          );
        }
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
                <DisclosureButton className="underline text-sm text-gray-800 hover:text-gray-600">
                  {open ? "Hide Details" : "Show Details"}
                </DisclosureButton>
                <DisclosurePanel className="mt-2 text-xs text-gray-700 space-y-1">
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
  ], [onGrab, currentUser]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto shadow rounded-lg border border-gray-300">
      <table className="min-w-full">
        <thead className="bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-semibold text-primary-dark uppercase tracking-wider"
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
            <tr key={row.id} className="hover:bg-secondary-light">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-3 whitespace-nowrap text-sm text-gray-800"
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
