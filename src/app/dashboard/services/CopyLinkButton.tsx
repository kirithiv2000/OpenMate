"use client";

import { useState } from "react";

export default function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const fullLink = `${window.location.origin}${link}`;
      await navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <button 
      type="button"
      onClick={handleCopy}
      style={{ 
        color: 'var(--primary)', 
        fontSize: '0.875rem', 
        fontWeight: '500',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0
      }}
    >
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}
