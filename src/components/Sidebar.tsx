import React from 'react';
import { Package, Truck, CreditCard, Users, Settings, LogOut, LayoutDashboard, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Resumen General', icon: LayoutDashboard },
    { id: 'fleet', label: 'Gestión de Flota', icon: Truck },
    { id: 'deliveries', label: 'Entregas Activas', icon: Package },
    { id: 'payments', label: 'Pagos y Liquidación', icon: CreditCard },
    { id: 'users', label: 'Configuración', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-[101] w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 h-full",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
            <span className="font-bold text-lg tracking-tight uppercase">Force Control</span>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400">
            <X className="h-5 w-5" />
          </button>
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
            <div className="font-medium text-xs">Administrador</div>
            <div className="text-[10px] text-slate-400">Distribuidora Los Andes</div>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
