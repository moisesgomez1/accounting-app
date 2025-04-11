"use client";
import React, { useEffect, useState } from "react";
import ExcelUploadForm from "../../../components/ExcelUploadForm";
import MasterTable, { Transaction } from "../../../components/MasterTable";
import { useSession } from "next-auth/react";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";

export default function DashboardPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<number | "">("");
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
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
            {/* Header */}
            <header className="w-full bg-white shadow">
                <div className="w-full px-6 py-4 flex flex-col md:flex-row items-center justify-between">
                    <ExcelUploadForm onSuccess={handleUploadSuccess} />
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow w-full px-6 py-8 flex flex-col">
                {/* Filter Section */}
                <section className="mb-6 w-full">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Listbox
                            value={selectedMonth}
                            onChange={setSelectedMonth}
                        >
                            <div className="relative">
                                <ListboxButton className="relative w-48 cursor-pointer rounded-lg bg-secondary py-2 pl-3 pr-10 text-left shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-dark">
                                    <span className="block truncate font-bold text-primary-dark">
                                        {selectedMonth
                                            ? months.find(
                                                  (m) =>
                                                      m.value === selectedMonth
                                              )?.label
                                            : "Select Month"}
                                    </span>
                                </ListboxButton>
                                <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <ListboxOption
                                        value=""
                                        className="cursor-pointer select-none py-2 pl-10 pr-4 hover:bg-secondary-light"
                                    >
                                        Select Month
                                    </ListboxOption>
                                    {months.map((m) => (
                                        <ListboxOption
                                            key={m.value}
                                            value={m.value}
                                            className={({ active }) =>
                                                `cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                    active
                                                        ? "bg-secondary-dark text-white"
                                                        : "text-gray-900"
                                                }`
                                            }
                                        >
                                            {m.label}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </div>
                        </Listbox>

                        <Listbox
                            value={selectedYear}
                            onChange={setSelectedYear}
                        >
                            <div className="relative">
                                <ListboxButton className="relative w-48 cursor-pointer rounded-lg bg-secondary py-2 pl-3 pr-10 text-left shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-dark">
                                    <span className="block truncate font-bold text-primary-dark">
                                        {selectedYear
                                            ? selectedYear
                                            : "Select Year"}
                                    </span>
                                </ListboxButton>
                                <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <ListboxOption
                                        value=""
                                        className="cursor-pointer select-none py-2 pl-10 pr-4 hover:bg-secondary-light"
                                    >
                                        Select Year
                                    </ListboxOption>
                                    {years.map((y) => (
                                        <ListboxOption
                                            key={y}
                                            value={y}
                                            className={({ active }) =>
                                                `cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                    active
                                                        ? "bg-secondary-dark text-white"
                                                        : "text-gray-900"
                                                }`
                                            }
                                        >
                                            {y}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    </div>
                </section>

                {/* Transactions Table */}
                <section className="flex flex-col flex-grow w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="flex-grow w-full overflow-auto p-6">
                        <MasterTable
                            data={transactions}
                            onGrab={handleGrabTransaction}
                            currentUser={userId}
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}
