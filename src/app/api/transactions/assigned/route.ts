// src/app/api/transactions/assigned/route.ts
import { NextResponse } from "next/server";
import Transaction from "../../../../models/Transaction";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required as a query parameter" },
        { status: 400 }
      );
    }

    const transactions = await Transaction.findAll({
      where: { assignedTo: userId },
      order: [['id', 'ASC']],
    });

    return NextResponse.json({ transactions });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
