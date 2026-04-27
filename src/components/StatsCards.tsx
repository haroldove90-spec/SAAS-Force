import React from 'react';
import { Truck, Package, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function StatsCards() {
  const stats = [
    { label: 'In Transit', value: '128', change: '↑ 12% vs yesterday', trend: 'text-green-600' },
    { label: 'Daily Volume', value: '$4,290.00', change: 'Settle in USD', trend: 'text-slate-400' },
    { label: 'Bolivares (VES)', value: 'Bs. 156.40K', change: 'Pago Móvil & Cash', trend: 'text-slate-400' },
    { label: 'Active Drivers', value: '42 / 50', change: 'Fleet Utilization: 84%', trend: 'text-slate-400' },
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
