"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PageContainer from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen bg-[#0b1220]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <PageContainer title="Reports" description="Relatórios e exportações (MVP).">
          <Card className="p-6">
            <p className="text-white/80">
              Em breve: relatórios em CSV/PDF + métricas consolidadas.
            </p>
          </Card>
        </PageContainer>
      </div>
    </div>
  );
}