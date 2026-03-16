export type EmploymentStatus =
  | "FULL_TIME"
  | "PART_TIME"
  | "SELF_EMPLOYED"
  | "UNEMPLOYED";

export type Customer = {
  id: string;
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