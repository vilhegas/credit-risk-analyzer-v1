import React from "react";
import { Card } from "@/components/ui/Card";

export type PaymentStatus = "ON_TIME" | "LATE" | "MISSED";

export type PaymentHistoryItem = {
  id?: string;
  date: string; // "2026-03-05" (ISO) ou "05/03/2026"
  amount: number; // valor pago
  status: PaymentStatus;
  description?: string; // opcional (ex: "Fatura cartão", "Parcela empréstimo")
};

type PaymentHistoryTableProps = {
  items: PaymentHistoryItem[];
  currency?: "BRL" | "USD";
  title?: string;
};

function formatMoney(value: number, currency: "BRL" | "USD") {
  return value.toLocaleString(currency === "BRL" ? "pt-BR" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
}

function formatDate(date: string) {
  // tenta formatar ISO (YYYY-MM-DD) -> DD/MM/YYYY
  // se não for ISO, retorna como veio
  const iso = /^\d{4}-\d{2}-\d{2}/.test(date);
  if (!iso) return date;

  const [y, m, d] = date.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

function statusLabel(status: PaymentStatus) {
  switch (status) {
    case "ON_TIME":
      return { text: "Em dia", cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" };
    case "LATE":
      return { text: "Atrasado", cls: "bg-amber-500/10 text-amber-300 border-amber-500/20" };
    case "MISSED":
      return { text: "Não pago", cls: "bg-rose-500/10 text-rose-300 border-rose-500/20" };
  }
}

function sortByDateDesc(a: PaymentHistoryItem, b: PaymentHistoryItem) {
  // ordena ISO desc quando possível
  const aIso = /^\d{4}-\d{2}-\d{2}/.test(a.date);
  const bIso = /^\d{4}-\d{2}-\d{2}/.test(b.date);

  if (aIso && bIso) return b.date.localeCompare(a.date);
  return 0;
}

export default function PaymentHistoryTable({
  items,
  currency = "BRL",
  title = "Histórico de pagamentos",
}: PaymentHistoryTableProps) {
  const sorted = [...items].sort(sortByDateDesc);

  const total = sorted.length;
  const onTime = sorted.filter((i) => i.status === "ON_TIME").length;
  const late = sorted.filter((i) => i.status === "LATE").length;
  const missed = sorted.filter((i) => i.status === "MISSED").length;

  const onTimePct = total > 0 ? Math.round((onTime / total) * 100) : 0;

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white/90">{title}</h3>
          <p className="mt-1 text-xs text-white/50">
            On-time: <span className="text-white/80">{onTimePct}%</span> · Em dia:{" "}
            <span className="text-white/80">{onTime}</span> · Atrasados:{" "}
            <span className="text-white/80">{late}</span> · Não pagos:{" "}
            <span className="text-white/80">{missed}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70">
            Últimos {Math.min(total, 12)}
          </span>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
        <div className="max-h-[340px] overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-[#0b1220]/90 backdrop-blur">
              <tr className="text-xs text-white/60">
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-white/60" colSpan={4}>
                    Nenhum pagamento registrado ainda.
                  </td>
                </tr>
              ) : (
                sorted.slice(0, 12).map((row, idx) => {
                  const s = statusLabel(row.status);
                  return (
                    <tr
                      key={row.id ?? `${row.date}-${row.amount}-${idx}`}
                      className="border-t border-white/10 text-white/80 hover:bg-white/5"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">{formatDate(row.date)}</td>

                      <td className="px-4 py-3 text-white/70">
                        {row.description ?? "—"}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatMoney(row.amount, currency)}
                      </td>

                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${s.cls}`}>
                          {s.text}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {sorted.length > 12 ? (
        <p className="mt-3 text-xs text-white/45">
          Mostrando 12 de {sorted.length} registros.
        </p>
      ) : null}
    </Card>
  );
}