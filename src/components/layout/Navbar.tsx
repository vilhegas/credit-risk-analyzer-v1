"use client";

import React, { useEffect, useState } from "react";
import { Bell, Search, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 400);

  useEffect(() => {
    // quando digitar, manda pra tela de customers com query
    // só faz isso se tiver algo digitado
    if (!debounced.trim()) return;

    router.push(`/customers?q=${encodeURIComponent(debounced.trim())}`);
  }, [debounced, router]);

  const showSearch = true; // se quiser esconder em algumas páginas, dá pra usar pathname

  return (
    <header className="w-full border-b border-white/10 bg-[#0f172a] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
          CR
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">Credit Risk Analyzer</span>
          <span className="text-xs text-white/40">Financial Risk Dashboard</span>
        </div>
      </div>

      {showSearch && (
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-[360px]">
          <Search size={16} className="text-white/50 mr-2" />
          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/40"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
          <Bell size={18} className="text-white" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>

          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm text-white font-medium">Admin</span>
            <span className="text-xs text-white/40">Risk Analyst</span>
          </div>
        </div>
      </div>
    </header>
  );
}