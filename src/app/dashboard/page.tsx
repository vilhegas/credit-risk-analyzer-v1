"use client";

import React, { useMemo, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PageContainer from "@/components/layout/PageContainer";

import CustomerForm, { CustomerFormData } from "@/components/forms/CustomerForm";

import RiskScoreCard from "@/components/dashboard/RiskScoreCard";
import RiskGauge from "@/components/dashboard/RiskGauge";
import FinancialMetrics from "@/components/dashboard/FinancialMetrics";
import RiskFactors from "@/components/dashboard/RiskFactors";
import PaymentHistoryTable from "@/components/dashboard/PaymentHistoryTable";

import { useRiskAnalysis } from "@/hooks/useRiskAnalysis";
import { useCustomer } from "@/hooks/useCustomer";

export default function DashboardPage() {
  const { data: analysis, loading: analyzing, error, analyze, reset } = useRiskAnalysis();
  const {
    customers,
    selectedCustomer,
    createCustomer,
    selectCustomer,
    clearCustomer,
  } = useCustomer();

  // formulário começa com um cliente default (até você salvar/selecionar)
  const [formValues, setFormValues] = useState<CustomerFormData>({
    name: "Maria Oliveira",
    age: 28,
    monthlyIncome: 6500,
    creditScore: 680,
    outstandingDebt: 1500,
    loanAmount: 30000,
    creditUtilization: 0.42,
    creditHistoryYears: 4,
    latePayments: 1,
    employmentStatus: "FULL_TIME",
  });

  const subtitle = useMemo(() => {
    const name = selectedCustomer?.name ?? formValues.name ?? "—";

    if (!analysis) return `Cliente: ${name} · Sem análise ainda`;
    return `Cliente: ${name} · Score: ${analysis.riskScore} · PD: ${analysis.probabilityOfDefault}%`;
  }, [analysis, selectedCustomer?.name, formValues.name]);

  async function handleSave(data: CustomerFormData) {
    setFormValues(data);
    await createCustomer(data);
  }

  async function handleAnalyze(data: CustomerFormData) {
    setFormValues(data);
    await analyze(data);
  }

  function handlePickCustomer(id: string) {
    selectCustomer(id);

    const c = customers.find((x) => x.id === id);
    if (c) {
      const { id: _, ...rest } = c;
      setFormValues(rest);
      reset(); // limpa análise antiga para não confundir
    }
  }

  function handleNewCustomer() {
    clearCustomer();
    reset();
    setFormValues({
      name: "",
      age: 25,
      monthlyIncome: 0,
      creditScore: 680,
      outstandingDebt: 0,
      loanAmount: 0,
      creditUtilization: 0.3,
      creditHistoryYears: 0,
      latePayments: 0,
      employmentStatus: "FULL_TIME",
    });
  }

  return (
    <div className="flex min-h-screen bg-[#0b1220]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <PageContainer title="Dashboard" description={subtitle}>
          {/* Barra de contexto: seleção de cliente */}
          <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-white/60">Clientes salvos (local)</p>
              <p className="text-sm text-white/80">
                {customers.length === 0
                  ? "Nenhum cliente salvo ainda."
                  : `Total: ${customers.length}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {customers.length > 0 ? (
                <select
                  value={selectedCustomer?.id ?? ""}
                  onChange={(e) => handlePickCustomer(e.target.value)}
                  className="w-[240px] rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white outline-none focus:border-white/20"
                >
                  <option value="">Selecionar cliente…</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : null}

              <button
                onClick={handleNewCustomer}
                className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15"
              >
                Novo cliente
              </button>
            </div>
          </div>

          {/* Erro do backend */}
          {error ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          {/* topo: score + gauge + form */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <RiskScoreCard
              score={analysis?.riskScore ?? 0}
              riskLevel={analysis?.riskLevel ?? "LOW"}
              probabilityOfDefault={analysis?.probabilityOfDefault ?? 0}
            />

            <RiskGauge probability={analysis?.probabilityOfDefault ?? 0} />

            <CustomerForm
              defaultValues={formValues}
              onSubmit={handleSave}
              onAnalyze={handleAnalyze}
              isLoading={analyzing}
            />
          </div>

          {/* métricas */}
          <FinancialMetrics
            monthlyIncome={formValues.monthlyIncome}
            outstandingDebt={formValues.outstandingDebt}
            loanAmount={formValues.loanAmount}
            creditUtilization={formValues.creditUtilization}
            creditHistoryYears={formValues.creditHistoryYears}
            latePayments={formValues.latePayments}
          />

          {/* fatores + histórico */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RiskFactors factors={analysis?.factors ?? []} />
            <PaymentHistoryTable items={analysis?.payments ?? []} currency="BRL" />
          </div>

          {/* dica de estado */}
          {!analysis ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              Preencha os dados e clique em <span className="font-semibold">“Analisar risco”</span> para gerar a análise via API.
            </div>
          ) : null}
        </PageContainer>
      </div>
    </div>
  );
}