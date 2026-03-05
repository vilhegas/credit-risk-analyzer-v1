"use client";

import { useRouter } from "next/navigation";
import { BarChart3, ShieldCheck, Users, ArrowRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0b1220] text-white flex flex-col">
      
      {/* HEADER */}
      <header className="w-full border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Credit Risk Analyzer</h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
        >
          Open Dashboard
        </button>
      </header>

      {/* HERO */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-bold mb-4">
          Financial Credit Risk Analysis Platform
        </h2>

        <p className="text-white/60 max-w-xl mb-8">
          Analyze customer financial profiles, evaluate credit risk, and
          generate insights with an interactive dashboard built using
          modern fullstack technologies.
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
        >
          Launch Dashboard
          <ArrowRight size={18} />
        </button>
      </section>

      {/* FEATURES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 pb-16">
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <Users className="mb-3 text-blue-400" size={28} />
          <h3 className="font-semibold mb-2">Customer Management</h3>
          <p className="text-sm text-white/60">
            Register and manage customer financial profiles for risk evaluation.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <BarChart3 className="mb-3 text-blue-400" size={28} />
          <h3 className="font-semibold mb-2">Risk Analytics</h3>
          <p className="text-sm text-white/60">
            Generate credit risk scores based on financial indicators.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <ShieldCheck className="mb-3 text-blue-400" size={28} />
          <h3 className="font-semibold mb-2">Decision Support</h3>
          <p className="text-sm text-white/60">
            Help financial institutions evaluate potential credit approvals.
          </p>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 text-center text-sm text-white/40 py-4">
        Credit Risk Analyzer • Built with Next.js + TypeScript
      </footer>

    </main>
  );
}