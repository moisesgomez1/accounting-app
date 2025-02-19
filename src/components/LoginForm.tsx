"use client";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle login (e.g., call an API route to authenticate)
    console.log("Logging in with", email, password);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col space-y-4 bg-background p-8 rounded shadow-md"
    >
      <h2 className="text-2xl font-bold text-center text-primary">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded text-foreground"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded text-foreground"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button 
        type="submit" 
        className="bg-primary text-white p-2 rounded hover:bg-primary-dark"
      >
        Sign In
      </button>
    </form>
  );
}
