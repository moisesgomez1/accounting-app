// app/api/import/route.ts
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(req: Request) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'File not provided' }, { status: 400 });
    }

    // Convert Blob to ArrayBuffer for XLSX to read
    const buffer = await file.arrayBuffer();

    // Read the workbook from the ArrayBuffer
    const workbook = XLSX.read(buffer, { type: 'array' });

    // Assume the data is in the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON using a typed generic
    const jsonData: Array<Record<string, unknown>> = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

    // Map the Excel rows to your transaction format.
    // Excel columns: Account Number, Post Date, Check, Description, Debit, Credit, Status
    const transactions = jsonData.map((row: Record<string, unknown>) => ({
      id: Date.now() + Math.random(), // For demo purposes. Replace with a proper ID in production.
      date: String(row["Post Date"]),
      number: String(row["Check"]), // "Check" column maps to "number"
      description: String(row["Description"]),
      debit: Number(row["Debit"]) || 0,
      credit: Number(row["Credit"]) || 0,
      notes: "", // Optional imported notes; adjust as needed
      importedAt: new Date().toISOString(),
      bankStatementId: String(row["Post Date"]), // Adjust as needed for your grouping
      processedAt: "",
      status: "unassigned", // Default status
      assignedTo: "",
    }));

    // In a production app, you would persist these transactions to your database.
    return NextResponse.json({ transactions });
  } catch (error: unknown) {
    // Ensure we extract a message if error is not already a string
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
