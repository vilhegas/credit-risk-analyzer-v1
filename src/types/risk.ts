export type RiskLevel = "LOW" | "MODERATE" | "HIGH";

export type RiskFactorSeverity = "LOW" | "MEDIUM" | "HIGH";

export type RiskFactor = {
  id?: string;
  title: string;
  description?: string;
  severity: RiskFactorSeverity;
  impact: number; // 0..100
  value?: string;
};

export type RiskAnalysis = {
  riskScore: number; // 0..100
  riskLevel: RiskLevel;
  probabilityOfDefault: number; // 0..100
  factors: RiskFactor[];
};