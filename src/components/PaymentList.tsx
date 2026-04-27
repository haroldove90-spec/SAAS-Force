import React from 'react';
import { DollarSign, FileText, CheckCircle2, Clock } from 'lucide-react';
import { PaymentLog } from '../types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PaymentListProps {
  payments: PaymentLog[];
  fullWidth?: boolean;
}

export function PaymentList({ payments, fullWidth }: PaymentListProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="font-bold text-slate-700 text-sm">Financial Pulse</h2>
      </div>
      <div className="flex-1 p-4 space-y-4">
        {payments.map((payment, i) => (
          <div key={payment.id} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
            <div>
              <div className="font-bold text-slate-900 text-sm">
                {payment.moneda === 'VES' ? 'Bs. ' : '$'}
                {payment.monto.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">
                {payment.metodo.replace('_', ' ')} • {payment.pago_referencia || 'NO REF'}
              </div>
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-tight",
              payment.status_pago === 'confirmed' ? "text-green-600" : "text-slate-400"
            )}>
              {payment.status_pago === 'confirmed' ? 'CONFIRMED' : 'PENDING'}
            </span>
          </div>
        ))}
      </div>
      <button className="w-full py-3 bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-100 transition-colors border-t border-slate-100">
        View All Transactions
      </button>
    </div>
  );
}
