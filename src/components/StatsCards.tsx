import React from 'react';
import { Truck, Package, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function StatsCards() {
  const stats = [
    { label: 'En Tránsito', value: '128', change: '↑ 12% vs ayer', trend: 'text-green-600' },
    { label: 'Volumen Diario', value: '$4,290.00', change: 'Liquidado en USD', trend: 'text-slate-400' },
    { label: 'Bolívares (VES)', value: 'Bs. 156.40K', change: 'Pago Móvil y Efectivo', trend: 'text-slate-400' },
    { label: 'Choferes Activos', value: '42 / 50', change: 'Utilización de Flota: 84%', trend: 'text-slate-400' },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 font-medium text-xs mb-1 uppercase tracking-tight">{stat.label}</div>
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className={`text-[10px] mt-2 uppercase font-medium ${stat.trend}`}>{stat.change}</div>
        </div>
      ))}
    </div>
  );
}
