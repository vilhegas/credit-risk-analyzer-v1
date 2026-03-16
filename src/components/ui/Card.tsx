import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-[#0f172a] border border-white/10 rounded-xl shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 py-4 border-b border-white/10 text-white font-medium">
      {children}
    </div>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-5">
      {children}
    </div>
  );
}