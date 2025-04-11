// app/api/transactions/route.ts
import { NextResponse } from "next/server";
import Transaction from "../../../models/Transaction";
import { User } from "@/models/index";
import { Op } from "sequelize";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    let whereClause = {};

    // If both month and year are provided, filter transactions
    if (monthParam && yearParam) {
      const month = parseInt(monthParam, 10);
      const year = parseInt(yearParam, 10);

      // Calculate start and end dates in UTC for the given month
      const startDate = new Date(Date.UTC(year, month - 1, 1)); // start of month
      const endDate = new Date(Date.UTC(year, month, 1)); // start of next month

      // Adjust the field name ('createdAt' in this example) to your actual date field if needed
      whereClause = {
        date: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      };
    }

    const transactions = await Transaction.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
      include: [
        {
          model: User,
          as: "assignee", // This alias should match your association
          attributes: ["user_firstname", "user_lastname", "id"],
        },
      ],
    });

    // Convert each transaction to a plain object.
    const plainTransactions = transactions.map((t) => t.get({ plain: true }));

    return NextResponse.json({ transactions: plainTransactions });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
