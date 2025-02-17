// app/(main)/dashboard/page.tsx
"use client";
import React, { useState } from "react";
import ExcelUploadForm from "../../../../components/ExcelUploadForm";
import MasterTable, { Transaction } from "../../../../components/MasterTable";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Callback to update transactions when a new Excel file is imported.
  const handleNewTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    // Alternatively, merge with existing transactions:
    // setTransactions((prev) => [...prev, ...newTransactions]);
  };

  // Handler to "grab" (pick up) a transaction.
  const handleGrabTransaction = (id: number) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((tx) =>
        tx.id === id
          ? { ...tx, status: "in_progress", assignedTo: "Candice" }
          : tx
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {/* Import Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Import Transactions</h2>
        <ExcelUploadForm onSuccess={handleNewTransactions} />
      </section>
      
      {/* Master Table Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">Master Transaction Table</h2>
        <MasterTable
          data={transactions}
          onGrab={handleGrabTransaction}
          currentUser="Candice"
        />
      </section>
    </div>
  );
}
