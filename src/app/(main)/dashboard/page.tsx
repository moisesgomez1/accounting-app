"use client";
import React, { useEffect, useState } from "react";
import ExcelUploadForm from "../../../components/ExcelUploadForm";
import MasterTable, { Transaction } from "../../../components/MasterTable";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<number | "">( "");
  const [selectedYear, setSelectedYear] = useState<number | "">("");

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Build URL with query params if month and year are selected
      let url = "/api/transactions";
      if (selectedMonth && selectedYear) {
        url += `?month=${selectedMonth}&year=${selectedYear}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(); // initial fetch
    const intervalId = setInterval(fetchTransactions, 10000); // poll every 10 seconds
    return () => clearInterval(intervalId);
  }, [selectedMonth, selectedYear]);

  const handleUploadSuccess = () => {
    fetchTransactions();
  };

  // Parent handles the API call to assign the transaction
  const handleGrabTransaction = async (id: number) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignedTo: userId,
          status: "in_progress",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to grab transaction");
      }
      // Re-fetch transactions after a successful update
      fetchTransactions();
    } catch (error) {
      console.error("Error grabbing transaction:", error);
    }
  };

  // Example month and year options. You can adjust these as needed.
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = [2023, 2024, 2025, 2026]; // Adjust based on your data range

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Import Transactions</h2>
        <ExcelUploadForm onSuccess={handleUploadSuccess} />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Filter Transactions</h2>
        <div className="flex space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value, 10) : "")}
            className="border p-2 rounded"
          >
            <option value="">Select Month</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value, 10) : "")}
            className="border p-2 rounded"
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Master Transaction Table</h2>
        <MasterTable
          data={transactions}
          onGrab={handleGrabTransaction}
          currentUser={userId}
        />
      </section>
    </div>
  );
}
