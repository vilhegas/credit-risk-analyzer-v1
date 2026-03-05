"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PageContainer from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-[#0b1220]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <PageContainer title="Settings" description="Preferências do sistema (MVP).">
          <Card className="p-6">
            <p className="text-white/80">
              Em breve: tema, preferências, conta e segurança.
            </p>
          </Card>
        </PageContainer>
      </div>
    </div>
  );
}