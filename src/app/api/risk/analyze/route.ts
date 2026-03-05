import { NextResponse } from "next/server";

type EmploymentStatus = "FULL_TIME" | "PART_TIME" | "SELF_EMPLOYED" | "UNEMPLOYED";

type CustomerPayload = {
  name: string;
  age: number;
  monthlyIncome: number;
  creditScore: number; // 300..850
  outstandingDebt: number;
  loanAmount: number;
  creditUtilization: number; // 0..1
  creditHistoryYears: number;
  latePayments: number;
  employmentStatus: EmploymentStatus;
};

type RiskLevel = "LOW" | "MODERATE" | "HIGH";
type RiskFactorSeverity = "LOW" | "MEDIUM" | "HIGH";

type RiskFactorItem = {
  id?: string;
  title: string;
  description?: string;
  severity: RiskFactorSeverity;
  impact: number; // 0..100
  value?: string;
};

type PaymentStatus = "ON_TIME" | "LATE" | "MISSED";

type PaymentHistoryItem = {
  id?: string;
  date: string; // ISO "YYYY-MM-DD"
  amount: number;
  status: PaymentStatus;
  description?: string;
};

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
}

function safeNumber(n: any, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function validate(payload: Partial<CustomerPayload>) {
  const errors: Record<string, string> = {};

  if (!payload.name || !String(payload.name).trim()) errors.name = "name is required";

  const age = safeNumber(payload.age, -1);
  if (age < 18 || age > 100) errors.age = "age must be 18..100";

  const monthlyIncome = safeNumber(payload.monthlyIncome, -1);
  if (monthlyIncome <= 0) errors.monthlyIncome = "monthlyIncome must be > 0";

  const creditScore = safeNumber(payload.creditScore, -1);
  if (creditScore < 300 || creditScore > 850) errors.creditScore = "creditScore must be 300..850";

  const outstandingDebt = safeNumber(payload.outstandingDebt, -1);
  if (outstandingDebt < 0) errors.outstandingDebt = "outstandingDebt must be >= 0";

  const loanAmount = safeNumber(payload.loanAmount, -1);
  if (loanAmount <= 0) errors.loanAmount = "loanAmount must be > 0";

  const creditUtilization = safeNumber(payload.creditUtilization, -1);
  if (creditUtilization < 0 || creditUtilization > 1) errors.creditUtilization = "creditUtilization must be 0..1";

  const creditHistoryYears = safeNumber(payload.creditHistoryYears, -1);
  if (creditHistoryYears < 0 || creditHistoryYears > 60) errors.creditHistoryYears = "creditHistoryYears must be 0..60";

  const latePayments = safeNumber(payload.latePayments, -1);
  if (latePayments < 0 || latePayments > 120) errors.latePayments = "latePayments must be 0..120";

  const employmentStatus = payload.employmentStatus;
  if (
    employmentStatus !== "FULL_TIME" &&
    employmentStatus !== "PART_TIME" &&
    employmentStatus !== "SELF_EMPLOYED" &&
    employmentStatus !== "UNEMPLOYED"
  ) {
    errors.employmentStatus = "employmentStatus is invalid";
  }

  return errors;
}

function inferRiskLevel(score: number): RiskLevel {
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MODERATE";
  return "LOW";
}

function calcPD(score: number): number {
  // uma aproximação simples por faixa (0..100 -> 3..35)
  if (score < 30) return 6;
  if (score < 60) return 18;
  return 32;
}

function getDti(mDebt: number, mIncome: number) {
  if (!Number.isFinite(mDebt) || !Number.isFinite(mIncome) || mIncome <= 0) return 999;
  return mDebt / mIncome; // ex: 0.22 = 22%
}

function severityFromValue(value: number, lowMax: number, medMax: number): RiskFactorSeverity {
  if (value <= lowMax) return "LOW";
  if (value <= medMax) return "MEDIUM";
  return "HIGH";
}

function scoreContribution(value: number, lowMax: number, medMax: number, lowPts: number, medPts: number, highPts: number) {
  if (value <= lowMax) return lowPts;
  if (value <= medMax) return medPts;
  return highPts;
}

function buildFactors(p: CustomerPayload, dti: number): RiskFactorItem[] {
  const utilPct = clamp(p.creditUtilization * 100, 0, 100);

  const dtiSev = severityFromValue(dti, 0.2, 0.35);
  const scoreSev = p.creditScore >= 700 ? "LOW" : p.creditScore >= 600 ? "MEDIUM" : "HIGH";
  const utilSev = severityFromValue(utilPct, 30, 50);
  const lateSev = p.latePayments === 0 ? "LOW" : p.latePayments <= 2 ? "MEDIUM" : "HIGH";
  const histSev = p.creditHistoryYears >= 6 ? "LOW" : p.creditHistoryYears >= 2 ? "MEDIUM" : "HIGH";

  const factors: RiskFactorItem[] = [
    {
      title: "Debt-to-Income (DTI)",
      description: "Dívida em relação à renda mensal. Quanto maior, maior o risco.",
      severity: dtiSev,
      impact: clamp(scoreContribution(dti, 0.2, 0.35, 12, 35, 70), 0, 100),
      value: `${Math.round(dti * 100)}%`,
    },
    {
      title: "Credit Score",
      description: "Pontuação de crédito. Scores menores elevam o risco estimado.",
      severity: scoreSev,
      impact: clamp(p.creditScore >= 700 ? 12 : p.creditScore >= 600 ? 35 : 65, 0, 100),
      value: `${p.creditScore}`,
    },
    {
      title: "Utilização de crédito",
      description: "Uso do limite de crédito. Valores altos podem indicar maior exposição.",
      severity: utilSev,
      impact: clamp(scoreContribution(utilPct, 30, 50, 10, 25, 45), 0, 100),
      value: `${Math.round(utilPct)}%`,
    },
    {
      title: "Atrasos em pagamentos",
      description: "Histórico de atrasos aumenta a probabilidade de inadimplência.",
      severity: lateSev,
      impact: clamp(p.latePayments === 0 ? 5 : p.latePayments <= 2 ? 25 : 50, 0, 100),
      value: `${p.latePayments}`,
    },
    {
      title: "Tempo de histórico",
      description: "Poucos anos de histórico dificultam prever comportamento de pagamento.",
      severity: histSev,
      impact: clamp(p.creditHistoryYears >= 6 ? 8 : p.creditHistoryYears >= 2 ? 18 : 32, 0, 100),
      value: `${p.creditHistoryYears} ano(s)`,
    },
    {
      title: "Situação de emprego",
      description: "Estabilidade de renda influencia capacidade de pagamento.",
      severity:
        p.employmentStatus === "FULL_TIME"
          ? "LOW"
          : p.employmentStatus === "PART_TIME" || p.employmentStatus === "SELF_EMPLOYED"
          ? "MEDIUM"
          : "HIGH",
      impact:
        p.employmentStatus === "FULL_TIME"
          ? 8
          : p.employmentStatus === "PART_TIME" || p.employmentStatus === "SELF_EMPLOYED"
          ? 18
          : 35,
      value:
        p.employmentStatus === "FULL_TIME"
          ? "CLT/Integral"
          : p.employmentStatus === "PART_TIME"
          ? "Parcial"
          : p.employmentStatus === "SELF_EMPLOYED"
          ? "Autônomo"
          : "Desempregado",
    },
  ];

  return factors.sort((a, b) => clamp(b.impact, 0, 100) - clamp(a.impact, 0, 100));
}

function buildPayments(p: CustomerPayload): PaymentHistoryItem[] {
  // MVP: gera um histórico simples. Depois você salva no DB.
  // Se latePayments for alto, força alguns atrasos/não pagos.
  const late = clamp(p.latePayments, 0, 120);

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1; // 1..12

  function iso(year: number, month: number, day: number) {
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }

  const baseAmount = Math.max(200, Math.round((p.loanAmount / 24) * 100) / 100); // simula parcela

  const statuses: PaymentStatus[] =
    late === 0 ? ["ON_TIME", "ON_TIME", "ON_TIME"] : late <= 2 ? ["LATE", "ON_TIME", "ON_TIME"] : ["MISSED", "LATE", "ON_TIME"];

  const items: PaymentHistoryItem[] = [
    { date: iso(y, m, 1), amount: baseAmount, status: statuses[0], description: "Parcela empréstimo" },
    { date: iso(y, m - 1 <= 0 ? 12 : m - 1, 1), amount: baseAmount, status: statuses[1], description: "Parcela empréstimo" },
    { date: iso(y, m - 2 <= 0 ? 12 + (m - 2) : m - 2, 1), amount: baseAmount, status: statuses[2], description: "Parcela empréstimo" },
  ];

  return items;
}

function calcRiskScore(p: CustomerPayload, dti: number): number {
  const utilPct = clamp(p.creditUtilization * 100, 0, 100);

  let score = 0;

  // credit score (peso alto)
  score += p.creditScore < 600 ? 40 : p.creditScore < 700 ? 20 : 8;

  // DTI (peso alto)
  score += dti > 0.35 ? 35 : dti > 0.2 ? 15 : 6;

  // utilização (peso médio)
  score += utilPct > 50 ? 20 : utilPct > 30 ? 10 : 4;

  // atrasos (peso médio)
  score += p.latePayments >= 3 ? 20 : p.latePayments >= 1 ? 10 : 2;

  // histórico (peso menor)
  score += p.creditHistoryYears < 2 ? 10 : p.creditHistoryYears < 6 ? 5 : 2;

  // emprego (peso menor)
  score +=
    p.employmentStatus === "UNEMPLOYED" ? 10 : p.employmentStatus === "FULL_TIME" ? 2 : 5;

  return clamp(score, 0, 100);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CustomerPayload>;

    const errors = validate(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { message: "Validation error", errors },
        { status: 400 }
      );
    }

    // normaliza payload
    const payload: CustomerPayload = {
      name: String(body.name).trim(),
      age: safeNumber(body.age),
      monthlyIncome: safeNumber(body.monthlyIncome),
      creditScore: clamp(safeNumber(body.creditScore), 300, 850),
      outstandingDebt: Math.max(0, safeNumber(body.outstandingDebt)),
      loanAmount: Math.max(1, safeNumber(body.loanAmount)),
      creditUtilization: clamp(safeNumber(body.creditUtilization), 0, 1),
      creditHistoryYears: clamp(safeNumber(body.creditHistoryYears), 0, 60),
      latePayments: clamp(safeNumber(body.latePayments), 0, 120),
      employmentStatus: body.employmentStatus as EmploymentStatus,
    };

    const dti = getDti(payload.outstandingDebt, payload.monthlyIncome);

    const riskScore = calcRiskScore(payload, dti);
    const riskLevel = inferRiskLevel(riskScore);
    const probabilityOfDefault = calcPD(riskScore);

    const factors = buildFactors(payload, dti);
    const payments = buildPayments(payload);

    return NextResponse.json({
      riskScore,
      riskLevel,
      probabilityOfDefault,
      factors,
      payments,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST /api/risk/analyze to generate a risk analysis.",
  });
}