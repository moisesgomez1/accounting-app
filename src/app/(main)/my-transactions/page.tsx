// app/my-transactions/page.tsx
"use client";
import React from "react";
import { Transaction } from "../../../../components/UserTransactions";
import UserTransactions from "../../../../components/UserTransactions";

// Optionally, you could fetch the data for the current user here,
// e.g., via an API call or a context, and then pass it as a prop.
export const dummyUserTransactions: Transaction[] = [
    {
      id: 1,
      date: "2023-01-01",
      number: "TX-001",
      description: "Payment received from Client A",
      debit: 0,
      credit: 1500,
      notes: "Imported note: Payment received on time.",
      importedAt: "2023-01-02T09:00:00Z",
      bankStatementId: "BS-2023-01-01",
      processedAt: "",
      status: "in_progress",
      assignedTo: "Candice",
      userNotes: "Review invoice details and verify receipt.",
    },
    {
      id: 2,
      date: "2023-01-03",
      number: "TX-002",
      description: "Utility bill payment",
      debit: -200,
      credit: 0,
      notes: "Imported note: Payment due immediately.",
      importedAt: "2023-01-04T09:00:00Z",
      bankStatementId: "BS-2023-01-03",
      processedAt: "",
      status: "in_progress",
      assignedTo: "Candice",
      userNotes: "",
    },
    {
      id: 3,
      date: "2023-01-05",
      number: "TX-003",
      description: "Refund issued to Customer B",
      debit: 0,
      credit: 100,
      notes: "Imported note: Refund processed after dispute.",
      importedAt: "2023-01-06T09:00:00Z",
      bankStatementId: "BS-2023-01-05",
      processedAt: "2023-01-07T10:00:00Z",
      status: "completed",
      assignedTo: "Candice",
      userNotes: "Follow up on refund confirmation.",
    },
  ];
export default function MyTransactionsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Transactions</h1>
      <UserTransactions data={dummyUserTransactions} />
    </div>
  );
}
