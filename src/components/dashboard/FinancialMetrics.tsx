import React from "react";
import { Card } from "@/components/ui/Card";

type FinancialMetricsProps = {
  monthlyIncome: number; // renda mensal
  outstandingDebt: number; // dívida total
  loanAmount: number; // valor do empréstimo solicitado
  creditUtilization: number; // 0..1 (ex: 0.42 = 42%)
  creditHistoryYears: number; // anos
  latePayments: number; // qtd
};

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  });
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function safeRatio(num: number, den: number) {
  if (!Number.isFinite(num) || !Number.isFinite(den) || den <= 0) return 0;
  return num / den;
}

function getDtiLabel(dti: number) {
  if (dti <= 0.2) return { label: "Baixo", badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" };
  if (dti <= 0.35) return { label: "Moderado", badge: "bg-amber-500/10 text-amber-300 border-amber-500/20" };
  return { label: "Alto", badge: "bg-rose-500/10 text-rose-300 border-rose-500/20" };
}

function getUtilLabel(util: number) {
  if (util <= 0.3) return { label: "Saudável", badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" };
  if (util <= 0.5) return { label: "Atenção", badge: "bg-amber-500/10 text-amber-300 border-amber-500/20" };
  return { label: "Alta", badge: "bg-rose-500/10 text-rose-300 border-rose-500/20" };
}

type MetricCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  badgeText?: string;
  badgeClassName?: string;
};

function MetricCard({ title, value, subtitle, badgeText, badgeClassName }: MetricCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-white/60">{title}</p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-white">{value}</p>
          {subtitle ? <p className="mt-1 text-xs text-white/50">{subtitle}</p> : null}
        </div>

        {badgeText ? (
          <span
            className={[
              "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium",
              badgeClassName ?? "bg-white/5 text-white/70 border-white/10",
            ].join(" ")}
          >
            {badgeText}
          </span>
        ) : null}
      </div>
    </Card>
  );
}

export default function FinancialMetrics(props: FinancialMetricsProps) {
  const dti = safeRatio(props.outstandingDebt, props.monthlyIncome); // debt-to-income (ex: 0.22 = 22%)
  const dtiInfo = getDtiLabel(dti);

  const util = Math.min(Math.max(props.creditUtilization, 0), 1);
  const utilInfo = getUtilLabel(util);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/90">Métricas financeiras</h2>
        <p className="text-xs text-white/50">
          Atualizado agora
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Renda mensal"
          value={formatMoney(props.monthlyIncome)}
          subtitle="Base para capacidade de pagamento"
        />

        <MetricCard
          title="Dívida total"
          value={formatMoney(props.outstandingDebt)}
          subtitle="Somatório das dívidas em aberto"
        />

        <MetricCard
          title="Empréstimo solicitado"
          value={formatMoney(props.loanAmount)}
          subtitle="Valor pedido na simulação"
        />

        <MetricCard
          title="Debt-to-Income (DTI)"
          value={formatPercent(dti)}
          subtitle="Dívida ÷ renda mensal"
          badgeText={dtiInfo.label}
          badgeClassName={dtiInfo.badge}
        />

        <MetricCard
          title="Uso do limite"
          value={formatPercent(util)}
          subtitle="Utilização de crédito"
          badgeText={utilInfo.label}
          badgeClassName={utilInfo.badge}
        />

        <MetricCard
          title="Histórico"
          value={`${props.creditHistoryYears} ano(s)`}
          subtitle={`Atrasos: ${props.latePayments}`}
          badgeText={props.latePayments === 0 ? "Ok" : "Atenção"}
          badgeClassName={
            props.latePayments === 0
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-300 border-amber-500/20"
          }
        />
      </div>
    </section>
  );
}