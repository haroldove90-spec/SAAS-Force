import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, 
  Wallet, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Search,
  Check,
  X,
  Loader2,
  Filter,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function PaymentPage() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED'>('ALL');

  useEffect(() => {
    const saved = localStorage.getItem('force_deliveries');
    if (saved) {
      setDeliveries(JSON.parse(saved));
    }
  }, []);

  const totals = deliveries.reduce((acc, d) => {
    if (d.statusPayment === 'verified') {
      if (d.moneda === 'USD') acc.usd += parseFloat(d.monto || 0);
      if (d.moneda === 'VES') acc.ves += parseFloat(d.monto || 0);
    }
    return acc;
  }, { usd: 0, ves: 0 });

  const pendingCount = deliveries.filter(d => d.metodoPago && d.statusPayment !== 'verified').length;

  const handleVerify = async (id: string) => {
    setLoading(id);
    await new Promise(r => setTimeout(r, 600));
    
    const updated = deliveries.map(d => 
      d.id === id ? { ...d, statusPayment: 'verified', status: 'delivered', updatedAt: new Date().toISOString() } : d
    );
    
    setDeliveries(updated);
    localStorage.setItem('force_deliveries', JSON.stringify(updated));
    setLoading(null);
  };

  const filteredDeliveries = deliveries
    .filter(d => d.metodoPago) // Only entries with payment attempts
    .filter(d => {
      if (filter === 'PENDING') return d.statusPayment !== 'verified';
      if (filter === 'VERIFIED') return d.statusPayment === 'verified';
      return true;
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Pagos y Liquidación <span className="text-blue-600 not-italic">FORCE CONTROL</span></h1>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mt-1 opacity-60">Control de transacciones multi-moneda</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
           {(['ALL', 'PENDING', 'VERIFIED'] as const).map(f => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={cn(
                 "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all",
                 filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
               )}
             >
               {f === 'ALL' ? 'Todo' : f === 'PENDING' ? 'Por Verificar' : 'Verificados'}
             </button>
           ))}
        </div>
      </div>

      {/* Resumen de Caja - Estilo Brutalista/SaaS Force */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <DollarSign className="h-20 w-20 text-white" />
          </div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-[10px] mb-3 uppercase tracking-widest">
            <TrendingUp className="h-3 w-3" /> Saldo Recaudado (USD)
          </div>
          <div className="text-4xl font-black font-mono tracking-tighter">
            $ {totals.usd.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-tighter">
            Fondos Validados en Cuenta
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Wallet className="h-20 w-20 text-slate-900" />
          </div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] mb-3 uppercase tracking-widest">
            <CheckCircle2 className="h-3 w-3" /> Saldo Recaudado (VES)
          </div>
          <div className="text-4xl font-black font-mono tracking-tighter text-slate-900">
            Bs. {totals.ves.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-tighter">
            Conciliación de pagos móviles
          </div>
        </div>

        <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100 flex flex-col justify-center border-dashed">
          <div className="text-blue-900 font-black text-[10px] mb-1 uppercase tracking-widest flex items-center gap-2">
             <AlertCircle className="h-3 w-3" /> Estado de Validación
          </div>
          <div className="text-3xl font-black text-blue-600 leading-none">{pendingCount} <span className="text-xs uppercase text-blue-400">Pendientes</span></div>
          <p className="text-[10px] text-blue-800 font-bold uppercase mt-3 tracking-tight">Acción requerida por cajero</p>
        </div>
      </div>

      {/* Lista de Transacciones */}
      {/* Cierre por Chofer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" /> Cierre Diario por Chofer
          </h3>
          <div className="space-y-4">
             {Object.entries(deliveries.reduce((acc: any, d: any) => {
               if (!d.choferId) return acc;
               if (!acc[d.choferId]) acc[d.choferId] = { usd: 0, ves: 0, count: 0 };
               if (d.statusPayment === 'verified') {
                 if (d.moneda === 'USD') acc[d.choferId].usd += parseFloat(d.monto || 0);
                 if (d.moneda === 'VES') acc[d.choferId].ves += parseFloat(d.monto || 0);
                 acc[d.choferId].count += 1;
               }
               return acc;
             }, {})).map(([choferId, stats]: [string, any]) => (
               <div key={choferId} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase leading-none">Chofer ID: {choferId.slice(-4)}</div>
                    <div className="text-xs font-black text-slate-900 mt-1 uppercase">Recolectado</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900 font-mono tracking-tighter">$ {stats.usd.toFixed(2)}</div>
                    <div className="text-[10px] font-bold text-slate-400 font-mono">Bs. {stats.ves.toFixed(2)}</div>
                  </div>
               </div>
             ))}
             {deliveries.filter(d => d.statusPayment === 'verified').length === 0 && (
               <p className="text-[10px] text-slate-400 italic text-center p-4">No hay cierres verificados aún hoy.</p>
             )}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between">
           <div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-2 text-blue-400">Recordatorio de Seguridad</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                La validación de pagos en <span className="text-white">Zelle</span> y <span className="text-white">Pago Móvil</span> debe ser confirmada físicamente en el extracto bancario antes de marcar como verificado. 
                <br/><br/>
                Una vez verificado, el saldo se integra automáticamente al reporte de utilidad neta del CEO.
              </p>
           </div>
           <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado de Servidor</div>
              <Badge className="bg-blue-500/20 text-blue-400 border-0 text-[8px] font-bold">MILISEGUNDOS SECURE</Badge>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-xl">
                 <CreditCard className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-sm uppercase tracking-tight">Módulo de Conciliación</h2>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Validación manual de flujos de caja</span>
              </div>
            </div>
          <div className="flex items-center gap-2">
             <Search className="h-3 w-3 text-slate-300" />
             <input type="text" placeholder="BUSCAR REFERENCIA..." className="bg-transparent text-[10px] font-bold uppercase border-0 focus:ring-0 w-32 placeholder:text-slate-300" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Guía / Referencia</th>
                <th className="px-8 py-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Monto Operativo</th>
                <th className="px-8 py-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Vía de Pago</th>
                <th className="px-8 py-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Estado</th>
                <th className="px-8 py-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDeliveries.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-mono font-bold text-slate-400 uppercase leading-tight group-hover:text-blue-600 transition-colors">
                        {d.tracking || d.id.slice(-8)}
                      </span>
                      <span className="text-xs font-black text-slate-900 mt-1">{d.cliente || 'CLIENTE FINAL'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-900 text-sm font-mono">
                      {d.moneda === 'VES' ? 'Bs. ' : '$ '}
                      {parseFloat(d.monto || 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge className="text-[9px] font-bold h-5 px-2 bg-slate-100 text-slate-500 border-0 uppercase tracking-tighter">
                       {d.metodoPago?.replace('_', ' ') || 'S/M'}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest",
                      d.statusPayment === 'verified' ? "text-emerald-600" : "text-amber-500"
                    )}>
                      {d.statusPayment === 'verified' ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 animate-pulse" />
                      )}
                      {d.statusPayment === 'verified' ? 'CONCILIADO' : 'PENDIENTE'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {d.statusPayment !== 'verified' ? (
                      <Button 
                        disabled={loading === d.id}
                        onClick={() => handleVerify(d.id)}
                        className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
                      >
                        {loading === d.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Verificar Pago'}
                      </Button>
                    ) : (
                      <div className="flex items-center justify-end text-emerald-500 gap-1 pr-2">
                         <span className="text-[9px] font-black uppercase italic">Validado</span>
                         <Check className="h-3 w-3" />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredDeliveries.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <CreditCard className="h-10 w-10 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 text-xs italic font-medium tracking-tight">No se encontraron transacciones registradas...</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

