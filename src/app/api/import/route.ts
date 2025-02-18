// app/api/import/route.ts
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import sequelize from "../../../lib/sequelize";
import BankStatement from "../../../models/BankStatement";
import Transaction from "../../../models/Transaction";

export async function POST(req: Request) {
    try {
        // Parse the incoming form data
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json(
                { error: "File not provided" },
                { status: 400 }
            );
        }

        // Convert Blob to ArrayBuffer for XLSX to read
        const buffer = await file.arrayBuffer();

        // Read the workbook from the ArrayBuffer
        const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON using a typed generic to avoid "any"
        const jsonData: Array<Record<string, unknown>> =
            XLSX.utils.sheet_to_json(sheet, { defval: "" });

        // Validate that we have data
        if (jsonData.length === 0) {
            return NextResponse.json(
                { error: "No data found in file" },
                { status: 400 }
            );
        }

        // For demonstration, use the "Post Date" from the first row as the statement date.
        const firstRow = jsonData[0];
        const statementDate = new Date(String(firstRow["Post Date"]));
        // Retrieve file name if available (when file is a File instance)
        const fileName = file instanceof File ? file.name : "uploaded.xlsx";

        // Use a Sequelize transaction to ensure atomic writes
        const result = await sequelize.transaction(async (t) => {
            // Create a BankStatement record
            const bankStatement = await BankStatement.create(
                {
                    statementDate,
                    fileName,
                    importedAt: new Date(),
                },
                { transaction: t }
            );

            const defaultStatus = "unassigned" as const;

            // Within your sequelize.transaction() block:
            const transactionsToCreate = jsonData.map(
                (row: Record<string, unknown>) => ({
                    date: new Date(String(row["Post Date"])),
                    number: String(row["Check"]),
                    description: String(row["Description"]),
                    debit: Number(row["Debit"]) || 0,
                    credit: Number(row["Credit"]) || 0,
                    notes: "",
                    importedAt: new Date(),
                    // Omit optional fields or set them to undefined:
                    // processedAt: undefined,
                    // assignedTo: undefined,
                    status: defaultStatus,
                    bankStatementId: bankStatement.id,
                })
            );

            await Transaction.bulkCreate(
                transactionsToCreate,
                { transaction: t }
            );
        });

        // Return the newly created transactions as JSON
        return NextResponse.json({ message: "File imported successfully." });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
