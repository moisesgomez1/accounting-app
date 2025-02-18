"use client";
import React, { useState } from "react";

interface NoteCellProps {
  transactionId: number;
  initialNote?: string;
  onUpdate: (id: number, note: string) => void;
}

const NoteCell: React.FC<NoteCellProps> = ({ transactionId, initialNote = "", onUpdate }) => {
  const [note, setNote] = useState(initialNote ?? "");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onUpdate(transactionId, note);
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <input
      type="text"
      className="border p-1 text-sm w-60"
      value={note}
      onChange={(e) => setNote(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Add your notes..."
    />
  );
};

export default NoteCell;
