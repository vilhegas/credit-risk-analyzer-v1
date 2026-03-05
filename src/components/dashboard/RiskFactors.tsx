import React from "react";
import { Card } from "@/components/ui/Card";

export type RiskFactorSeverity = "LOW" | "MEDIUM" | "HIGH";

export type RiskFactorItem = {
  id?: string;
  title: string; // ex: "Debt-to-Income alto"
  description?: string; // ex: "Sua dívida representa 42% da sua renda mensal."
  severity: RiskFactorSeverity;
  impact: number; // 0..100 (quanto impacta no score)
  value?: string; // ex: "DTI: 42%"
};

type RiskFactorsProps = {
  factors: RiskFactorItem[];
  title?: string;
};

function clamp(n: number, min = 0, max = 100) {
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
}

function severityBadge(sev: RiskFactorSeverity) {
  switch (sev) {
    case "LOW":
      return {
        text: "Baixo",
        cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      };
    case "MEDIUM":
      return {
        text: "Médio",
        cls: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      };
    case "HIGH":
      return {
        text: "Alto",
        cls: "bg-rose-500/10 text-rose-300 border-rose-500/20",
      };
  }
}

function impactColor(sev: RiskFactorSeverity) {
  // sem setar cor fixa “bonitinha” demais: só classes utilitárias
  if (sev === "LOW") return "bg-emerald-400/40";
  if (sev === "MEDIUM") return "bg-amber-400/40";
  return "bg-rose-400/40";
}

function sortByImpactDesc(a: RiskFactorItem, b: RiskFactorItem) {
  return clamp(b.impact) - clamp(a.impact);
}

export default function RiskFactors({ factors, title = "Fatores de risco" }: RiskFactorsProps) {
  const sorted = [...factors].sort(sortByImpactDesc);
  const totalImpact = sorted.reduce((acc, f) => acc + clamp(f.impact), 0);
  const top = sorted.slice(0, 6);

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white/90">{title}</h3>
          <p className="mt-1 text-xs text-white/50">
            Principais motivos que influenciaram o risco (ordenados por impacto).
          </p>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70">
          Impacto total: {Math.min(totalImpact, 999)}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {top.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            Nenhum fator disponível ainda. Rode uma análise para gerar os fatores.
          </div>
        ) : (
          top.map((f, idx) => {
            const sev = severityBadge(f.severity);
            const impact = clamp(f.impact);
            return (
              <div
                key={f.id ?? `${f.title}-${idx}`}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-white/90">{f.title}</p>

                      {f.value ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
                          {f.value}
                        </span>
                      ) : null}
                    </div>

                    {f.description ? (
                      <p className="mt-1 text-xs leading-relaxed text-white/55">
                        {f.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${sev.cls}`}>
                      {sev.text}
                    </span>

                    <span className="text-xs font-medium text-white/70">
                      {impact}/100
                    </span>
                  </div>
                </div>

                {/* barra de impacto */}
                <div className="mt-3">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-2 rounded-full ${impactColor(f.severity)}`}
                      style={{ width: `${impact}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-white/45">
                    Impacto estimado no score.
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {sorted.length > 6 ? (
        <p className="mt-3 text-xs text-white/45">
          Mostrando 6 de {sorted.length} fatores.
        </p>
      ) : null}
    </Card>
  );
}