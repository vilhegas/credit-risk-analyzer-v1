"use client";

import React, { useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PageContainer from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useCustomer } from "@/hooks/useCustomer";

export default function CustomersPage() {
  const { customers, selectCustomer } = useCustomer();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter((c) => c.name.toLowerCase().includes(term));
  }, [q, customers]);

  return (
    <div className="flex min-h-screen bg-[#0b1220]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <PageContainer title="Customers" description="Lista e busca de clientes (MVP).">
          <div className="max-w-[520px]">
            <Input
              placeholder="Buscar cliente pelo nome..."
              value={q}
              onChange={(e: any) => setQ(e.target.value)}
            />
          </div>

          <Card className="p-4">
            {filtered.length === 0 ? (
              <p className="text-sm text-white/60">Nenhum cliente encontrado.</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {filtered.map((c) => (
                  <li key={c.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-white/90 font-medium">{c.name}</p>
                      <p className="text-xs text-white/50">
                        Renda: {c.monthlyIncome} · Score: {c.creditScore}
                      </p>
                    </div>

                    <button
                      onClick={() => selectCustomer(c.id)}
                      className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15"
                    >
                      Selecionar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </PageContainer>
      </div>
    </div>
  );
}