"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLogOut } from "react-icons/fi"; // Logout icon
import { FaTable, FaTachometerAlt } from "react-icons/fa"; // Example icons

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow py-4 px-6 flex justify-between items-center">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center space-x-2">
        <img src="/logo.svg" alt="Logo" className="h-8" />
        <span className="text-xl font-bold text-primary-dark">Main Table</span>
      </Link>

      {/* Conditional Action Button */}
      <div className="flex items-center space-x-4">
        {pathname === "/dashboard" && (
          <Link href="/my-transactions">
            <button className="flex items-center space-x-1 bg-secondary py-2 px-4 text-white rounded hover:bg-secondary-dark">
              <FaTable />
              <span>My Table</span>
            </button>
          </Link>
        )}
        {pathname === "/my-transactions" && (
          <Link href="/dashboard">
            <button className="flex items-center space-x-1 bg-secondary py-2 px-4 text-white rounded hover:bg-secondary-dark">
              <FaTachometerAlt />
              <span>Dashboard</span>
            </button>
          </Link>
        )}
        {/* Logout Button */}
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-1 bg-red-500 py-2 px-4 text-white rounded hover:bg-red-600"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
