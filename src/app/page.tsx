// app/page.tsx
import React from 'react';
import MasterTable, { Transaction } from '../../components/MasterTable';

const dummyData: Transaction[] = [
  {
    id: 1,
    date: '2023-01-01',
    number: 'TX-001',
    description: 'Payment received from Client A',
    debit: 0,           // No debit for a credit transaction
    credit: 1500,
    notes: 'Imported from bank statement.',
    importedAt: '2023-01-02T09:00:00Z',
    bankStatementId: 'BS-2023-01-01',
    status: 'unassigned',
    assignedTo: '',
    processedAt: '',
  },
  {
    id: 2,
    date: '2023-01-01',
    number: 'TX-002',
    description: 'Utility bill payment',
    debit: -200,        // Debit stored as a negative value
    credit: 0,
    notes: 'Imported from bank statement.',
    importedAt: '2023-01-02T09:00:00Z',
    bankStatementId: 'BS-2023-01-01',
    status: 'in_progress',
    assignedTo: 'Candice',
    processedAt: '',
  },
  {
    id: 3,
    date: '2023-01-02',
    number: 'TX-003',
    description: 'Refund issued to Customer B',
    debit: 0,
    credit: 100,
    notes: 'Imported from bank statement.',
    importedAt: '2023-01-03T09:00:00Z',
    bankStatementId: 'BS-2023-01-02',
    status: 'completed',
    assignedTo: 'Aracely',
    processedAt: '2023-01-03T10:00:00Z',
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold my-4">Master Transaction Table</h1>
      <MasterTable data={dummyData} />
    </div>
  );
}
