"use client";
import React, { useRef, useState } from "react";
import { Button } from '@headlessui/react'
import { Transaction } from "./MasterTable";

interface ExcelUploadFormProps {
  onSuccess: (transactions: Transaction[]) => void;
}

export default function ExcelUploadForm({ onSuccess }: ExcelUploadFormProps) {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleButtonClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus("Upload successful!");
        onSuccess(data.transactions);
      } else {
        const errorData = await response.json();
        setUploadStatus(`Upload failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Upload error occurred.");
    }
  };

  return (
    <div className="relative">
      <Button
       onClick={handleButtonClick}
       className="inline-flex items-center px-4 py-2 border border-transparent text-md rounded-md shadow-sm text-primary-dark font-bold bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-dark"
       >
        Upload Excel File
       </Button>
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={hiddenFileInput}
        onChange={handleFileChange}
        className="hidden"
      />
      {uploadStatus && (
        <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>
      )}
    </div>
  );
}
