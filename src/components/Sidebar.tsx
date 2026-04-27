import React from 'react';
import { Package, Truck, CreditCard, Users, Settings, LogOut, LayoutDashboard, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fleet', label: 'Fleet Manager', icon: Truck },
    { id: 'deliveries', label: 'Active Deliveries', icon: Package },
    { id: 'payments', label: 'Payment Logs', icon: CreditCard },
    { id: 'users', label: 'Company Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full border-r border-slate-200 bg-white flex flex-col">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-full"></div>
        </div>
        <span className="font-bold text-lg tracking-tight">Force Control</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === item.id
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">CM</div>
          <div>
            <div className="font-medium text-xs">Admin User</div>
            <div className="text-[10px] text-slate-400">Distribuidora Los Andes</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
