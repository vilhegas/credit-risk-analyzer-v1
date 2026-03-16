import React from "react";
import { Card } from "@/components/ui/Card";

type RiskLevel = "LOW" | "MODERATE" | "HIGH";

type RiskScoreCardProps = {
  score: number;              // 0..100
  riskLevel?: RiskLevel;      // se não passar, ele calcula pelo score
  probabilityOfDefault?: number; // 0..100 (opcional)
  title?: string;
};

function clamp(n: number, min = 0, max = 100) {
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
}

function inferRiskLevel(score: number): RiskLevel {
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MODERATE";
  return "LOW";
}

function levelInfo(level: RiskLevel) {
  switch (level) {
    case "LOW":
      return {
        labelPt: "Baixo risco",
        badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
        bar: "bg-emerald-400/40",
      };
    case "MODERATE":
      return {
        labelPt: "Risco moderado",
        badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",
        bar: "bg-amber-400/40",
      };
    case "HIGH":
      return {
        labelPt: "Alto risco",
        badge: "bg-rose-500/10 text-rose-300 border-rose-500/20",
        bar: "bg-rose-400/40",
      };
  }
}

export default function RiskScoreCard({
  score,
  riskLevel,
  probabilityOfDefault,
  title = "Risk Score",
}: RiskScoreCardProps) {
  const s = clamp(score);
  const level = riskLevel ?? inferRiskLevel(s);
  const info = levelInfo(level);

  const pd = probabilityOfDefault !== undefined ? clamp(probabilityOfDefault) : undefined;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-white/60">{title}</p>
          <div className="mt-1 flex items-end gap-2">
            <p className="text-3xl font-semibold tracking-tight text-white">{s}</p>
            <span className="pb-1 text-sm text-white/50">/ 100</span>
          </div>

          <p className="mt-1 text-sm font-medium text-white/80">{info.labelPt}</p>
        </div>

        <span
          className={[
            "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium",
            info.badge,
          ].join(" ")}
        >
          {level}
        </span>
      </div>

      {/* progress bar */}
      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className={`h-2 rounded-full ${info.bar}`} style={{ width: `${s}%` }} />
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] text-white/45">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* optional PD */}
      {pd !== undefined ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/60">Probability of Default</p>
            <p className="text-sm font-semibold text-white">{pd}%</p>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-white/45">
            Estimativa de chance de inadimplência com base nos dados informados.
          </p>
        </div>
      ) : null}
    </Card>
  );
}