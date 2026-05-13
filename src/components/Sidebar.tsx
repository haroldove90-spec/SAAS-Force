import React from 'react';
import { Package, Truck, CreditCard, Users, Settings, LogOut, LayoutDashboard, Map, Trophy, Receipt, History, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, onClose, onLogout }: SidebarProps) {
  const [activeUser, setActiveUser] = React.useState<any>(null);
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);

  React.useEffect(() => {
    const current = localStorage.getItem('fc_active_user');
    if (current) {
      setActiveUser(JSON.parse(current));
    } else {
      // Default fallback
      const admin = { id: '1', name: 'Admin Principal', email: 'admin@forcecontrol.com', role: 'ADMIN' };
      setActiveUser(admin);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Resumen General', icon: LayoutDashboard, roles: ['ADMIN', 'OPERATOR', 'CASHIER', 'DRIVER'] },
    { id: 'fleet', label: 'Gestión de Flota', icon: Truck, roles: ['ADMIN', 'OPERATOR'] },
    { id: 'performance', label: 'Ranking Operativo', icon: Trophy, roles: ['ADMIN'] },
    { id: 'expenses', label: 'Gestión de Gastos', icon: Receipt, roles: ['ADMIN'] },
    { id: 'audit', label: 'Auditoría Operativa', icon: History, roles: ['ADMIN'] },
    { id: 'deliveries', label: 'Entregas Activas', icon: Package, roles: ['ADMIN', 'OPERATOR', 'DRIVER'] },
    { id: 'payments', label: 'Pagos y Liquidación', icon: CreditCard, roles: ['ADMIN', 'CASHIER'] },
    { id: 'user_management', label: 'Usuarios y Roles', icon: Users, roles: ['ADMIN'] },
    { id: 'users', label: 'Configuración', icon: Settings, roles: ['ADMIN'] },
  ];

  const filteredItems = menuItems.filter(item => 
    !activeUser || (item.roles && item.roles.includes(activeUser.role))
  );

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
        <div className="p-6 border-b border-slate-100 flex flex-col items-start gap-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <img 
                src="https://cossma.com.mx/deltaforce.png" 
                alt="Logo" 
                className="h-10 w-auto"
              />
              <span className="font-black text-sm tracking-tighter uppercase italic leading-tight">FORCE <br/><span className="text-blue-600 not-italic">CONTROL</span></span>
            </div>
            <button onClick={onClose} className="md:hidden text-slate-400 p-1">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

      <nav className="flex-1 p-4 space-y-1">
        {filteredItems.map((item) => (
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

      <div className="p-4 border-t border-slate-100 space-y-4">
        {deferredPrompt && (
          <Button 
            onClick={handleInstallClick}
            variant="outline"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 h-10 shadow-lg shadow-blue-100"
          >
            <Download className="h-3 w-3" />
            Instalar App
          </Button>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold uppercase">
              {activeUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="font-bold text-[11px] text-slate-900 uppercase tracking-tight">{activeUser?.name || 'Usuario'}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{activeUser?.role || 'Visitante'}</div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all border border-blue-100 rounded-xl"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
    </>
  );
}
