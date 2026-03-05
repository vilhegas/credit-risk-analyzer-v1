import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export type EmploymentStatus = "FULL_TIME" | "PART_TIME" | "SELF_EMPLOYED" | "UNEMPLOYED";

export type CustomerFormData = {
  name: string;
  age: number;
  monthlyIncome: number;
  creditScore: number;
  outstandingDebt: number;
  loanAmount: number;
  creditUtilization: number; // 0..1
  creditHistoryYears: number;
  latePayments: number;
  employmentStatus: EmploymentStatus;
};

type CustomerFormProps = {
  defaultValues?: Partial<CustomerFormData>;
  onSubmit: (data: CustomerFormData) => void | Promise<void>;
  onAnalyze?: (data: CustomerFormData) => void | Promise<void>;
  isLoading?: boolean;
};

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
}

function toNumber(value: string) {
  // aceita vazio -> 0
  const cleaned = value.replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export default function CustomerForm({
  defaultValues,
  onSubmit,
  onAnalyze,
  isLoading = false,
}: CustomerFormProps) {
  const initial: CustomerFormData = useMemo(
    () => ({
      name: defaultValues?.name ?? "",
      age: defaultValues?.age ?? 25,
      monthlyIncome: defaultValues?.monthlyIncome ?? 6500,
      creditScore: defaultValues?.creditScore ?? 680,
      outstandingDebt: defaultValues?.outstandingDebt ?? 1500,
      loanAmount: defaultValues?.loanAmount ?? 30000,
      creditUtilization: defaultValues?.creditUtilization ?? 0.35,
      creditHistoryYears: defaultValues?.creditHistoryYears ?? 4,
      latePayments: defaultValues?.latePayments ?? 0,
      employmentStatus: defaultValues?.employmentStatus ?? "FULL_TIME",
    }),
    [defaultValues]
  );

  const [form, setForm] = useState<CustomerFormData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setField<K extends keyof CustomerFormData>(key: K, value: CustomerFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  function validate(data: CustomerFormData) {
    const e: Record<string, string> = {};

    if (!data.name.trim()) e.name = "Informe o nome do cliente.";
    if (data.age < 18 || data.age > 100) e.age = "Idade deve estar entre 18 e 100.";
    if (data.monthlyIncome <= 0) e.monthlyIncome = "Renda mensal deve ser maior que 0.";
    if (data.creditScore < 300 || data.creditScore > 850)
      e.creditScore = "Score deve estar entre 300 e 850.";
    if (data.outstandingDebt < 0) e.outstandingDebt = "Dívida não pode ser negativa.";
    if (data.loanAmount <= 0) e.loanAmount = "Valor do empréstimo deve ser maior que 0.";
    if (data.creditUtilization < 0 || data.creditUtilization > 1)
      e.creditUtilization = "Utilização deve estar entre 0 e 1 (ex: 0.42).";
    if (data.creditHistoryYears < 0 || data.creditHistoryYears > 60)
      e.creditHistoryYears = "Histórico deve estar entre 0 e 60 anos.";
    if (data.latePayments < 0 || data.latePayments > 120)
      e.latePayments = "Atrasos deve estar entre 0 e 120.";

    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const eMap = validate(form);
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;

    await onSubmit({
      ...form,
      creditUtilization: clamp(form.creditUtilization, 0, 1),
      creditScore: clamp(form.creditScore, 300, 850),
    });
  }

  async function handleAnalyze() {
    if (!onAnalyze) return;

    const eMap = validate(form);
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;

    await onAnalyze({
      ...form,
      creditUtilization: clamp(form.creditUtilization, 0, 1),
      creditScore: clamp(form.creditScore, 300, 850),
    });
  }

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white/90">Cliente</h3>
          <p className="mt-1 text-xs text-white/50">
            Preencha os dados para gerar a análise de risco.
          </p>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70">
          Formulário
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* linha 1 */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-white/60">Nome</label>
            <Input
              value={form.name}
              onChange={(ev: any) => setField("name", ev.target.value)}
              placeholder="Ex: Maria Oliveira"
            />
            {errors.name ? <p className="mt-1 text-xs text-rose-300">{errors.name}</p> : null}
          </div>

          <div>
            <label className="text-xs text-white/60">Situação de emprego</label>
            <select
              value={form.employmentStatus}
              onChange={(ev) => setField("employmentStatus", ev.target.value as EmploymentStatus)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
            >
              <option className="bg-[#0b1220]" value="FULL_TIME">CLT / Integral</option>
              <option className="bg-[#0b1220]" value="PART_TIME">Parcial</option>
              <option className="bg-[#0b1220]" value="SELF_EMPLOYED">Autônomo</option>
              <option className="bg-[#0b1220]" value="UNEMPLOYED">Desempregado</option>
            </select>
          </div>
        </div>

        {/* linha 2 */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs text-white/60">Idade</label>
            <Input
              value={String(form.age)}
              onChange={(ev: any) => setField("age", toNumber(ev.target.value))}
              placeholder="25"
            />
            {errors.age ? <p className="mt-1 text-xs text-rose-300">{errors.age}</p> : null}
          </div>

          <div>
            <label className="text-xs text-white/60">Score de crédito (300–850)</label>
            <Input
              value={String(form.creditScore)}
              onChange={(ev: any) => setField("creditScore", toNumber(ev.target.value))}
              placeholder="680"
            />
            {errors.creditScore ? (
              <p className="mt-1 text-xs text-rose-300">{errors.creditScore}</p>
            ) : null}
          </div>

          <div>
            <label className="text-xs text-white/60">Histórico (anos)</label>
            <Input
              value={String(form.creditHistoryYears)}
              onChange={(ev: any) => setField("creditHistoryYears", toNumber(ev.target.value))}
              placeholder="4"
            />
            {errors.creditHistoryYears ? (
              <p className="mt-1 text-xs text-rose-300">{errors.creditHistoryYears}</p>
            ) : null}
          </div>
        </div>

        {/* linha 3 */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs text-white/60">Renda mensal (BRL)</label>
            <Input
              value={String(form.monthlyIncome)}
              onChange={(ev: any) => setField("monthlyIncome", toNumber(ev.target.value))}
              placeholder="6500"
            />
            {errors.monthlyIncome ? (
              <p className="mt-1 text-xs text-rose-300">{errors.monthlyIncome}</p>
            ) : null}
          </div>

          <div>
            <label className="text-xs text-white/60">Dívida total (BRL)</label>
            <Input
              value={String(form.outstandingDebt)}
              onChange={(ev: any) => setField("outstandingDebt", toNumber(ev.target.value))}
              placeholder="1500"
            />
            {errors.outstandingDebt ? (
              <p className="mt-1 text-xs text-rose-300">{errors.outstandingDebt}</p>
            ) : null}
          </div>

          <div>
            <label className="text-xs text-white/60">Empréstimo solicitado (BRL)</label>
            <Input
              value={String(form.loanAmount)}
              onChange={(ev: any) => setField("loanAmount", toNumber(ev.target.value))}
              placeholder="30000"
            />
            {errors.loanAmount ? (
              <p className="mt-1 text-xs text-rose-300">{errors.loanAmount}</p>
            ) : null}
          </div>
        </div>

        {/* linha 4 */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs text-white/60">Utilização de crédito (0–1)</label>
            <Input
              value={String(form.creditUtilization)}
              onChange={(ev: any) => setField("creditUtilization", toNumber(ev.target.value))}
              placeholder="0.42"
            />
            {errors.creditUtilization ? (
              <p className="mt-1 text-xs text-rose-300">{errors.creditUtilization}</p>
            ) : null}
            <p className="mt-1 text-[11px] text-white/45">Ex: 0.42 = 42%</p>
          </div>

          <div>
            <label className="text-xs text-white/60">Atrasos (qtd)</label>
            <Input
              value={String(form.latePayments)}
              onChange={(ev: any) => setField("latePayments", toNumber(ev.target.value))}
              placeholder="0"
            />
            {errors.latePayments ? (
              <p className="mt-1 text-xs text-rose-300">{errors.latePayments}</p>
            ) : null}
          </div>

          <div className="flex items-end">
            <div className="w-full rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/60">Prévia rápida</p>
              <p className="mt-1 text-sm text-white/85">
                DTI estimado:{" "}
                <span className="font-semibold text-white">
                  {form.monthlyIncome > 0
                    ? `${Math.round((form.outstandingDebt / form.monthlyIncome) * 100)}%`
                    : "—"}
                </span>
              </p>
              <p className="mt-1 text-[11px] text-white/45">
                DTI = Dívida ÷ Renda mensal
              </p>
            </div>
          </div>
        </div>

        {/* ações */}
        <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
          {onAnalyze ? (
            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="bg-white/10 hover:bg-white/15 border border-white/10"
            >
              Analisar risco
            </Button>
          ) : null}

          <Button type="submit" disabled={isLoading}>
            Salvar cliente
          </Button>
        </div>
      </form>
    </Card>
  );
}