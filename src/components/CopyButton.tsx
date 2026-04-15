import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text, className = "", onBeforeCopy }: { text: string; className?: string; onBeforeCopy?: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    onBeforeCopy?.();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity active:scale-[0.97] ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy Script
        </>
      )}
    </button>
  );
}
