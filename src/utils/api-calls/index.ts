export async function updateTransaction(transactionId: number, updates: Partial<Record<"assignedTo" | "status" | "userNotes" | "processedAt", string>>) {
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }
      const data = await response.json();
      console.log("Updated transaction:", data.transaction);
      return data.transaction;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  }
  