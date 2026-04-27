import React from 'react';
import { motion } from 'motion/react';
import { DollarSign, Wallet, CreditCard, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { mockPayments } from '../mockData';
import { cn } from '@/lib/utils';

export function PaymentPage() {
  const totals = {
    usd: 12450.50,
    ves: 456200.00
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Pagos y Liquidación</h1>
        <p className="text-slate-500 text-xs mt-1">Control de transacciones multi-moneda para el mercado venezolano</p>
      </div>

      {/* Resumen de Caja */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 font-medium text-xs mb-1 uppercase tracking-tight">
            <DollarSign className="h-3 w-3" /> Saldo Total (USD)
          </div>
          <div className="text-3xl font-bold font-mono">
            $ {totals.usd.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-green-400 mt-2 uppercase font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +8.2% este mes
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 font-medium text-xs mb-1 uppercase tracking-tight">
            <Wallet className="h-3 w-3" /> Saldo Total (VES)
          </div>
          <div className="text-3xl font-bold font-mono">
            Bs. {totals.ves.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-2 uppercase font-medium">
            Tasa Promedio: 36.50
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="text-slate-400 font-medium text-xs mb-1 uppercase tracking-tight">Transacciones Hoy</div>
          <div className="text-2xl font-bold">24 Confirmadas</div>
          <div className="text-xs text-amber-600 mt-1 uppercase font-bold tracking-tight">3 por verificar</div>
        </div>
      </div>

      {/* Lista de Transacciones - Mobile-First (Table to Cards) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-bold text-slate-700 text-sm">Historial de Transacciones</h2>
          <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase border px-2 py-1 rounded">Exportar Reporte</button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Referencia</th>
                <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Monto</th>
                <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Método</th>
                <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Estatus</th>
                <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600">
                    {payment.pago_referencia || 'SIN REF'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">
                      {payment.moneda === 'VES' ? 'Bs. ' : '$ '}
                      {payment.monto.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded leading-none uppercase tracking-tighter">
                        {payment.metodo.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "flex items-center gap-1.5 text-[10px] font-bold uppercase",
                      payment.status_pago === 'confirmed' ? "text-green-600" : "text-amber-600"
                    )}>
                      {payment.status_pago === 'confirmed' ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                      {payment.status_pago === 'confirmed' ? 'Verificado' : 'Pendiente'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[10px] font-bold text-slate-900 hover:underline uppercase">Detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-slate-100">
          {mockPayments.map((payment) => (
            <div key={payment.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono font-bold uppercase leading-none mb-1">
                    Ref: {payment.pago_referencia || 'SIN REF'}
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    {payment.moneda === 'VES' ? 'Bs. ' : '$ '}
                    {payment.monto.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className={cn(
                    "px-2 py-1 rounded text-[9px] font-bold uppercase",
                    payment.status_pago === 'confirmed' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                )}>
                  {payment.status_pago === 'confirmed' ? 'Verificado' : 'Pendiente'}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded leading-none uppercase tracking-tighter">
                  {payment.metodo.replace('_', ' ')}
                </span>
                <button className="h-9 px-4 bg-slate-900 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Verificar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
