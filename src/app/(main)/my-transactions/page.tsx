"use client";
import React, { useEffect, useState } from "react";
import UserTransactions, {
    Transaction,
} from "../../../components/UserTransactions";
import { useSession } from "next-auth/react";

export default function MyTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { data: session, status } = useSession();

    const userId = session?.user?.id;

    console.log (userId)
    console.log("Session:", session);

    // Fetch transactions assigned to the current user
    const fetchTransactions = async () => {
        if (!userId) return; // Ensure userId is available before fetching

        setLoading(true);
        try {
            const response = await fetch(`/api/transactions/assigned?userId=${userId}`);
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

    // Wait for userId to be defined before starting the polling
    useEffect(() => {
        if (!userId) return; // Exit early if userId is not available

        fetchTransactions(); // initial fetch
        const intervalId = setInterval(fetchTransactions, 10000);
        return () => clearInterval(intervalId);
    }, [userId]); // Depend on userId so that it runs when userId becomes available

    // Handler to update a transaction (for both note changes and marking as complete)
    const updateTransaction = async (
        id: number,
        updates: Partial<Transaction>
    ) => {
        try {
            const response = await fetch(`/api/transactions/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });
            if (!response.ok) {
                throw new Error("Failed to update transaction");
            }
            // After update, re-fetch the transactions to reflect the changes.
            fetchTransactions();
        } catch (error) {
            console.error("Error updating transaction:", error);
        }
    };

    // Handler for updating notes.
    const handleNoteChange = async (id: number, note: string) => {
        await updateTransaction(id, { userNotes: note });
    };

    // Handler for marking a transaction as complete.
    const handleMarkCompleted = async (id: number) => {
        await updateTransaction(id, {
            status: "completed",
            processedAt: new Date().toISOString(),
        });
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 text-gray-800">
          {/* Header */}
          <header className="w-full bg-white shadow">
            <div className="w-full px-6 py-4 flex items-center justify-between">
            </div>
          </header>
    
          {/* Main Content */}
          <main className="w-full flex-grow px-6 py-8">
            <UserTransactions
              data={transactions}
              onNoteChange={handleNoteChange}
              onMarkCompleted={handleMarkCompleted}
            />
          </main>
        </div>
      );
    }