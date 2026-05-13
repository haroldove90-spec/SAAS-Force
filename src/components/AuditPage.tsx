import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Search, 
  Filter, 
  Truck, 
  CreditCard, 
  UserPlus, 
  CheckCircle2, 
  Clock,
  LayoutDashboard,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AuditEvent {
  id: string;
  type: 'DELIVERY_CREATED' | 'PAYMENT_VALIDATED' | 'DELIVERY_COMPLETED' | 'USER_CREATED';
  actor: string;
  role: string;
  description: string;
  timestamp: string;
  targetId?: string;
}

export function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'DRIVER' | 'CASHIER' | 'OPERATOR'>('ALL');
  const [stats, setStats] = useState({
    createdToday: 0,
    validatedToday: 0,
    finishedToday: 0
  });

  useEffect(() => {
    // 1. Load Data
    const deliveries = JSON.parse(localStorage.getItem('force_deliveries') || '[]');
    const users = JSON.parse(localStorage.getItem('fc_users') || '[]');
    // Note: We'll simulate audit events from existing data states
    
    const reconstructedEvents: AuditEvent[] = [];
    const today = new Date().toISOString().split('T')[0];
    let createdCount = 0, validatedCount = 0, finishedCount = 0;

    // Process Deliveries
    deliveries.forEach((d: any) => {
      const isToday = d.fecha?.startsWith(today) || d.createdAt?.startsWith(today);
      if (isToday) createdCount++;

      // Creation Event
      reconstructedEvents.push({
        id: `ev-create-${d.id}`,
        type: 'DELIVERY_CREATED',
        actor: 'Juan Despacho', // Simulated for now
        role: 'OPERATOR',
        description: `Asignó pedido #${d.id.slice(-4)} a cliente ${d.cliente}`,
        timestamp: d.createdAt || d.fecha || new Date().toISOString(),
        targetId: d.id
      });

      // Completion Event
      if (d.status === 'delivered') {
        if (isToday) finishedCount++;
        reconstructedEvents.push({
          id: `ev-done-${d.id}`,
          type: 'DELIVERY_COMPLETED',
          actor: d.choferNombre || 'Chofer Asignado',
          role: 'DRIVER',
          description: `Marcó pedido #${d.id.slice(-4)} como Entregado`,
          timestamp: d.updatedAt || new Date().toISOString(),
          targetId: d.id
        });
      }

      // Payment Event
      if (d.metodoPago) {
        if (isToday) validatedCount++;
        reconstructedEvents.push({
          id: `ev-pay-${d.id}`,
          type: 'PAYMENT_VALIDATED',
          actor: 'Cajero Central',
          role: 'CASHIER',
          description: `Validó pago de ${d.moneda === 'VES' ? 'Bs.' : '$'}${d.monto} (${d.metodoPago})`,
          timestamp: d.updatedAt || new Date().toISOString(),
          targetId: d.id
        });
      }
    });

    // Process Users
    users.slice(-3).forEach((u: any) => {
        reconstructedEvents.push({
            id: `ev-user-${u.id}`,
            type: 'USER_CREATED',
            actor: 'Super Admin',
            role: 'ADMIN',
            description: `Creó nuevo perfil de ${u.role}: ${u.name}`,
            timestamp: new Date().toISOString(),
        });
    });

    // Sort by time
    setEvents(reconstructedEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    setStats({
        createdToday: createdCount,
        validatedToday: deliveries.filter((d: any) => d.metodoPago && (d.updatedAt || '').startsWith(today)).length,
        finishedToday: finishedCount
    });
  }, []);

  const filteredEvents = events.filter(e => {
    if (filter === 'ALL') return true;
    return e.role === filter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'DELIVERY_CREATED': return <Truck className="h-3 w-3 text-blue-600" />;
      case 'PAYMENT_VALIDATED': return <CreditCard className="h-3 w-3 text-emerald-600" />;
      case 'DELIVERY_COMPLETED': return <CheckCircle2 className="h-3 w-3 text-green-600" />;
      default: return <UserPlus className="h-3 w-3 text-slate-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Auditoría Operativa</h1>
          <p className="text-slate-500 text-xs font-medium">Cronología completa de acciones y productividad diaria</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
           {(['ALL', 'DRIVER', 'CASHIER', 'OPERATOR'] as const).map(f => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={cn(
                 "px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all",
                 filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
               )}
             >
               {f === 'ALL' ? 'Todo' : f === 'DRIVER' ? 'Choferes' : f === 'CASHIER' ? 'Cajeros' : 'Despacho'}
             </button>
           ))}
        </div>
      </div>

      {/* Productivity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Truck className="h-4 w-4 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 text-[9px] font-bold border-0 uppercase">Pedidos Creados</Badge>
           </div>
           <div className="text-2xl font-black text-slate-900">{stats.createdToday}</div>
           <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Hoy vs Promedio: +12%</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <CreditCard className="h-4 w-4 text-emerald-600" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 text-[9px] font-bold border-0 uppercase">Pagos Validados</Badge>
           </div>
           <div className="text-2xl font-black text-slate-900">{stats.validatedToday}</div>
           <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Recaudación en curso</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-green-50 rounded-xl">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-700 text-[9px] font-bold border-0 uppercase">Finalizados</Badge>
           </div>
           <div className="text-2xl font-black text-slate-900">{stats.finishedToday}</div>
           <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Eficiencia de flota optima</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
         <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
               <History className="h-4 w-4" /> 
               Registro de Actividad (Log)
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
               <Calendar className="h-3 w-3" />
               Hoy, {new Date().toLocaleDateString()}
            </div>
         </div>

         <div className="p-8 relative">
            {/* Timeline Line */}
            <div className="absolute left-[2.45rem] top-8 bottom-8 w-[2px] bg-slate-100" />

            <div className="space-y-10 relative">
               {filteredEvents.map((event, idx) => (
                 <motion.div 
                   key={event.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   className="flex gap-6 pr-4"
                 >
                   <div className="relative z-10 h-8 w-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm">
                      {getIcon(event.type)}
                   </div>
                   <div className="flex-1 space-y-2">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                         <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900">{event.actor}</span>
                            <Badge className="text-[8px] h-4 py-0 font-bold uppercase border-0 bg-slate-100 text-slate-500">
                               {event.role}
                            </Badge>
                         </div>
                         <span className="text-[10px] font-mono font-bold text-slate-400">
                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                         <p className="text-xs text-slate-600 font-medium">{event.description}</p>
                         {event.targetId && (
                           <div className="mt-2 text-[9px] font-bold text-blue-500 uppercase flex items-center gap-1">
                              ID: {event.targetId.slice(-8)} <Clock className="h-2 w-2" />
                           </div>
                         )}
                      </div>
                   </div>
                 </motion.div>
               ))}

               {filteredEvents.length === 0 && (
                 <div className="text-center py-20">
                    <History className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 italic text-sm">No se encontraron eventos para este filtro.</p>
                 </div>
               )}
            </div>
         </div>
      </div>
    </motion.div>
  );
}
