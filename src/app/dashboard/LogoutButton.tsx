"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{
        marginTop: "0.5rem",
        padding: "0.25rem 0",
        background: "none",
        border: "none",
        color: "var(--text-secondary)",
        fontSize: "0.75rem",
        fontWeight: "500",
        cursor: "pointer",
        textAlign: "left",
        textDecoration: "underline"
      }}
    >
      Log Out
    </button>
  );
}
