"use client";
import React, { useState, useEffect } from "react";

interface NoteCellProps {
  transactionId: number;
  initialNote?: string;
  onUpdate: (id: number, note: string) => void;
  setIsEditingNote: (isEditing: boolean) => void;
}

export default function NoteCell ({
  transactionId,
  initialNote = "",
  onUpdate,
  setIsEditingNote,
}: NoteCellProps) {
  const [note, setNote] = useState(initialNote);

  // Update state as user types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  // When the input loses focus, trigger update and mark editing as false
  const handleBlur = () => {
    onUpdate(transactionId, note);
    setIsEditingNote(false);
  };

  // Mark editing as true when the input is focused
  const handleFocus = () => {
    setIsEditingNote(true);
  };

  // Optionally, if you want to trigger blur on Enter key press:
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  // Keep the input in sync if the initialNote changes externally.
  useEffect(() => {
    setNote(initialNote);
  }, [initialNote]);

  return (
    <input
      type="text"
      className="border p-1 text-sm w-80"
      value={note}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      placeholder="Add your notes..."
    />
  );
};
