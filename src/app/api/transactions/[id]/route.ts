import { NextResponse } from "next/server";
import Transaction from "../../../../models/Transaction";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params promise before using it.
  const { id } = await params;
  
  try {
    // Parse the JSON payload from the client.
    // The client can send any subset of these keys.
    const updates = await req.json();

    // Define allowed fields that can be updated.
    const allowedFields = [
      "assignedTo",
      "status",
      "userNotes",
      "processedAt",
      // Add more allowed fields if needed.
    ];

    // Find the transaction by its primary key.
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Loop through the updates and apply them if they are allowed.
    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        (transaction as any)[key] = updates[key];
      }
    });

    await transaction.save();

    return NextResponse.json({ transaction });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
