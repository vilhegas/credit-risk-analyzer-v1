"use client";

import { useCallback, useState } from "react";
import type { CustomerFormData } from "@/src/components/forms/CustomerForm";
import type { RiskFactorItem } from "@/src/components/dashboard/RiskFactors";
import type { PaymentHistoryItem } from "@/src/components/dashboard/PaymentHistoryTable";

export type RiskLevel = "LOW" | "MODERATE" | "HIGH";

export type RiskAnalysisResult = {
  riskScore: number; // 0..100
  riskLevel: RiskLevel;
  probabilityOfDefault: number; // 0..100
  factors: RiskFactorItem[];
  payments: PaymentHistoryItem[];
};

type UseRiskAnalysisState = {
  data: RiskAnalysisResult | null;
  loading: boolean;
  error: string | null;
};

export function useRiskAnalysis() {
  const [state, setState] = useState<UseRiskAnalysisState>({
    data: null,
    loading: false,
    error: null,
  });

  const analyze = useCallback(async (payload: CustomerFormData) => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const res = await fetch("/api/risk/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Falha ao analisar risco.");
      }

      const json: RiskAnalysisResult = await res.json();

      setState({
        data: json,
        loading: false,
        error: null,
      });

      return json;
    } catch (err: any) {
      setState({
        data: null,
        loading: false,
        error: err?.message ?? "Erro inesperado.",
      });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    analyze,
    reset,
  };
}