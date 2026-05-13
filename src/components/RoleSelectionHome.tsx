import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Users, 
  ChevronRight,
  Zap,
  Globe,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RoleSelectionHomeProps {
  onSelectRole: (role: any) => void;
}

const roles = [
  {
    id: 'ADMIN',
    title: 'Super Admin (CEO)',
    description: 'Control total de finanzas, auditoría y personal.',
    icon: ShieldCheck,
    color: 'bg-indigo-600',
    lightColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    features: ['Reportes de Utilidad', 'Gestión de Gastos', 'Auditoría Total']
  },
  {
    id: 'OPERATOR',
    title: 'Operador Logístico',
    description: 'Gestión de despachos, rutas y monitoreo en tiempo real.',
    icon: Truck,
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    features: ['Creación de Pedidos', 'Asignación de Flota', 'Mapa de Rutas']
  },
  {
    id: 'CASHIER',
    title: 'Cajero / Liquidador',
    description: 'Validación de cobros, cierre de caja y divisas.',
    icon: CreditCard,
    color: 'bg-emerald-600',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    features: ['Verificar Zelle/VES', 'Conciliación de Efectivo', 'Estatus de Pago']
  },
  {
    id: 'DRIVER',
    title: 'Chofer / Repartidor',
    description: 'Interfaz optimizada para móviles y reportes de campo.',
    icon: Users,
    color: 'bg-slate-900',
    lightColor: 'bg-slate-100',
    textColor: 'text-slate-900',
    features: ['Hoja de Ruta Personal', 'Evidencia de Entrega', 'Registro de Cobro']
  }
];

export function RoleSelectionHome({ onSelectRole }: RoleSelectionHomeProps) {
  const handleSelect = (roleId: string, title: string) => {
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Demo ${title}`,
      email: `${roleId.toLowerCase()}@saasforce.com`,
      role: roleId
    };
    onSelectRole(user);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-[30vh] bg-slate-900 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-100 rounded-full blur-[120px] opacity-20 -z-1" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full z-10 space-y-12"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/80 text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            <Zap className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            Acceso Prioritario Operativo
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none italic">
            SAAS <span className="text-slate-400 not-italic">FORCE</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto font-medium">
            Bienvenido a <span className="text-white font-bold">SAAS FORCE</span>. 
            Elija el rol operativo para acceder a los módulos de gestión autorizados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              onClick={() => handleSelect(role.id, role.title)}
              className="group bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all cursor-pointer flex flex-col h-full overflow-hidden relative"
            >
              <div className={cn("inline-flex p-4 rounded-3xl mb-6 self-start transition-transform group-hover:scale-110 duration-300", role.lightColor)}>
                <role.icon className={cn("h-6 w-6", role.textColor)} />
              </div>

              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-3">
                {role.title}
              </h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8">
                {role.description}
              </p>

              <div className="space-y-3 mt-auto">
                <div className="flex flex-wrap gap-2">
                  {role.features.map(f => (
                    <span key={f} className="text-[9px] font-bold uppercase tracking-tighter px-2 py-1 bg-slate-50 text-slate-400 rounded-lg border border-slate-100">
                      {f}
                    </span>
                  ))}
                </div>
                <div className={cn("w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-[10px] uppercase tracking-widest mt-4 group-hover:gap-4 transition-all", role.color)}>
                  Ingresar <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 gap-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Multi-región Activo</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Encriptación Forzada</span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© 2026 SAAS FORCE INTELLIGENCE</p>
        </div>
      </motion.div>
    </div>
  );
}
