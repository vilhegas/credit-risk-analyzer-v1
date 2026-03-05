export type PaymentStatus = "ON_TIME" | "LATE" | "MISSED";

export type PaymentHistoryItem = {
  id?: string;
  date: string;
  amount: number;
  status: PaymentStatus;
  description?: string;
};