import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard,
  ArrowRight,
  Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function DashboardMain() {
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUSD: 0,
    totalVES: 0,
    completed: 0,
    pending: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('force_deliveries');
    if (saved) {
      const deliveries = JSON.parse(saved);
      setData(deliveries);

      const calculated = deliveries.reduce((acc: any, d: any) => {
        if (d.moneda === 'USD') acc.totalUSD += parseFloat(d.monto || 0);
        if (d.moneda === 'VES') acc.totalVES += parseFloat(d.monto || 0);
        if (d.status === 'delivered') acc.completed += 1;
        if (d.status === 'pending') acc.pending += 1;
        return acc;
      }, { totalUSD: 0, totalVES: 0, completed: 0, pending: 0 });

      setStats(calculated);
    }
  }, []);

  // Simple Chart Data Calculation
  const paymentsByMethod = data.reduce((acc: any, d: any) => {
    const method = d.metodoPago || 'Efectivo';
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {});

  const maxVal = Math.max(...Object.values(paymentsByMethod) as number[], 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-3">
             <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
             </div>
             <Badge className="bg-green-100 text-green-700 text-[9px] font-bold border-0">USD</Badge>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ventas Totales</div>
          <div className="text-xl font-bold text-slate-900">${stats.totalUSD.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-3">
             <div className="p-2 bg-blue-50 rounded-lg">
                <CreditCard className="h-4 w-4 text-blue-600" />
             </div>
             <Badge className="bg-blue-100 text-blue-700 text-[9px] font-bold border-0">VES</Badge>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Bolívares</div>
          <div className="text-xl font-bold text-slate-900">Bs. {stats.totalVES.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-3">
             <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
             </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Entregados</div>
          <div className="text-xl font-bold text-emerald-600">{stats.completed}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-3">
             <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="h-4 w-4 text-amber-600" />
             </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Por Cobrar</div>
          <div className="text-xl font-bold text-amber-600">{stats.pending}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CSS Chart: Payment Methods */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-slate-400" />
            Métodos de Pago
          </h3>
          <div className="space-y-6">
            {Object.entries(paymentsByMethod).map(([method, count]: [any, any]) => (
              <div key={method} className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <span>{method}</span>
                  <span className="text-slate-900">{count} pedidos</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxVal) * 100}%` }}
                    className="h-full bg-slate-900 rounded-full"
                  />
                </div>
              </div>
            ))}
            {Object.keys(paymentsByMethod).length === 0 && (
               <div className="text-center py-10">
                 <AlertCircle className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                 <p className="text-[10px] text-slate-400 italic">No hay datos suficientes</p>
               </div>
            )}
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="h-4 w-4 text-slate-400" />
              Actividad Reciente
            </h3>
            <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase text-slate-400">Ver todo</Button>
          </div>

          <div className="space-y-1">
            {data.slice(0, 3).map((d) => (
              <div key={d.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 font-bold text-xs">
                    {d.cliente?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{d.cliente || 'Consumidor Final'}</div>
                    <div className="text-[10px] text-slate-400 font-mono tracking-tighter">{d.id} • {d.metodoPago?.toUpperCase()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {d.moneda === 'VES' ? 'Bs.' : '$'} {d.monto}
                      </div>
                      <div className="text-[9px] font-bold uppercase text-slate-400">{d.status}</div>
                   </div>
                   <ArrowRight className="h-4 w-4 text-slate-200" />
                </div>
              </div>
            ))}
            {data.length === 0 && (
              <div className="text-center py-16">
                 <p className="text-xs text-slate-400 italic">Espere a que se procesen las primeras guías...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
