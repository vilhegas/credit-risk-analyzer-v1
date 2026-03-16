import React from "react";
import { Card } from "@/components/ui/Card";

type RiskGaugeProps = {
  probability: number; // 0 a 100
};

function getRiskColor(value: number) {
  if (value < 30) return "#22c55e"; // verde
  if (value < 60) return "#f59e0b"; // amarelo
  return "#ef4444"; // vermelho
}

export default function RiskGauge({ probability }: RiskGaugeProps) {
  const radius = 90;
  const circumference = Math.PI * radius;

  const value = Math.max(0, Math.min(100, probability));
  const progress = (value / 100) * circumference;

  const strokeColor = getRiskColor(value);

  return (
    <Card className="p-6 flex flex-col items-center justify-center">

      <h3 className="text-sm text-white/70 mb-4">
        Probability of Default
      </h3>

      <svg width="220" height="120" viewBox="0 0 220 120">
        {/* fundo */}
        <path
          d="M20 100 A90 90 0 0 1 200 100"
          fill="none"
          stroke="#1f2937"
          strokeWidth="14"
        />

        {/* progresso */}
        <path
          d="M20 100 A90 90 0 0 1 200 100"
          fill="none"
          stroke={strokeColor}
          strokeWidth="14"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
        />

        {/* texto */}
        <text
          x="110"
          y="90"
          textAnchor="middle"
          className="fill-white text-xl font-bold"
        >
          {value}%
        </text>
      </svg>

      <p className="text-xs text-white/50 mt-2">
        Estimated probability of loan default
      </p>

    </Card>
  );
}