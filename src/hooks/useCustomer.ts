"use client";

import { useState } from "react";
import type { CustomerFormData } from "@/components/forms/CustomerForm";

export type Customer = CustomerFormData & {
  id: string;
};

export function useCustomer() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function generateId() {
    return Math.random().toString(36).substring(2, 9);
  }

  async function createCustomer(data: CustomerFormData) {
    try {
      setLoading(true);

      const newCustomer: Customer = {
        ...data,
        id: generateId(),
      };

      setCustomers((prev) => [...prev, newCustomer]);
      setSelectedCustomer(newCustomer);

      return newCustomer;
    } catch (err: any) {
      setError(err.message || "Erro ao criar cliente");
    } finally {
      setLoading(false);
    }
  }

  function updateCustomer(id: string, data: Partial<CustomerFormData>) {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id ? { ...customer, ...data } : customer
      )
    );

    if (selectedCustomer?.id === id) {
      setSelectedCustomer((prev) => (prev ? { ...prev, ...data } : null));
    }
  }

  function deleteCustomer(id: string) {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));

    if (selectedCustomer?.id === id) {
      setSelectedCustomer(null);
    }
  }

  function selectCustomer(id: string) {
    const customer = customers.find((c) => c.id === id) || null;
    setSelectedCustomer(customer);
  }

  function clearCustomer() {
    setSelectedCustomer(null);
  }

  return {
    customers,
    selectedCustomer,
    loading,
    error,

    createCustomer,
    updateCustomer,
    deleteCustomer,
    selectCustomer,
    clearCustomer,
  };
}