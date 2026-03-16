"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  BarChart3,
  Settings
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Users
  },
  {
    name: "Risk Analysis",
    path: "/risk",
    icon: AlertTriangle
  },
  {
    name: "Reports",
    path: "/reports",
    icon: BarChart3
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-[240px] bg-[#0f172a] border-r border-white/10 flex flex-col">

      {/* logo */}
      <div className="p-6 border-b border-white/10">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            CR
          </div>

          <div>
            <p className="text-white font-semibold text-sm">
              Credit Risk
            </p>

            <p className="text-xs text-white/40">
              Analyzer
            </p>
          </div>

        </div>

      </div>

      {/* menu */}
      <nav className="flex-1 p-4 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
              
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }
              
              `}
            >
              <Icon size={18} />

              {item.name}
            </Link>
          );
        })}

      </nav>

      {/* footer */}
      <div className="p-4 border-t border-white/10">

        <p className="text-xs text-white/40">
          Credit Risk Analyzer
        </p>

        <p className="text-xs text-white/30 mt-1">
          v1.0.0
        </p>

      </div>

    </aside>
  );
}