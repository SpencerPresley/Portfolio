"use client";

import { useEffect, useState } from "react";
import { checkForStyleOverrides } from "@/util/style-check";

export function StyleOverrideToast() {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const hasOverrides = checkForStyleOverrides();
    setShowToast(hasOverrides);
  }, []);

  if (!showToast) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 bg-zinc-800 text-zinc-100 p-4 rounded-lg shadow-lg max-w-sm z-50 animate-fade-in"
      role="alert"
    >
      <div className="flex gap-2">
        <div className="flex-1">
          <p className="text-sm">
            Some browser extensions may affect the site's appearance. Consider disabling JSON Pretty Printer or similar styling extensions if the site looks unusual.
          </p>
        </div>
        <button 
          onClick={() => setShowToast(false)}
          className="text-zinc-400 hover:text-zinc-200"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
} 