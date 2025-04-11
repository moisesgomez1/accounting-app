import { ReactNode } from "react";
import Header from "@/components/Header";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Header is rendered on all main pages */}
      <Header />
      <main className="flex-grow">{children}</main>
    </div>
  );
}
