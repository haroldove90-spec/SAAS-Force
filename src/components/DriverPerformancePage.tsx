import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  MessageCircle, 
  Truck, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2,
  Medal,
  Star,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DriverPerformance {
  id: string;
  nombre: string;
  vehiculo: string;
  entregas: number;
  recaudadoUSD: number;
  recaudadoVES: number;
  eficiencia: number; // 0-100
}

export function DriverPerformancePage() {
  const [ranking, setRanking] = useState<DriverPerformance[]>([]);

  useEffect(() => {
    const savedDeliveries = localStorage.getItem('force_deliveries');
    const savedDrivers = localStorage.getItem('fc_drivers');
    
    if (savedDeliveries && savedDrivers) {
      const deliveries = JSON.parse(savedDeliveries);
      const drivers = JSON.parse(savedDrivers);

      const stats = drivers.map((driver: any) => {
        const driverDeliveries = deliveries.filter((d: any) => d.choferId === driver.id);
        
        const collectedUSD = driverDeliveries.reduce((acc: number, d: any) => 
          d.moneda === 'USD' ? acc + parseFloat(d.monto || 0) : acc, 0);
          
        const collectedVES = driverDeliveries.reduce((acc: number, d: any) => 
          d.moneda === 'VES' ? acc + parseFloat(d.monto || 0) : acc, 0);

        // Simulated efficiency based on ratio of total deliveries vs pending (mock logic)
        const total = driverDeliveries.length;
        const delivered = driverDeliveries.filter((d: any) => d.status === 'delivered').length;
        const efficiency = total > 0 ? (delivered / total) * 100 : 0;

        return {
          id: driver.id,
          nombre: driver.nombre,
          vehiculo: driver.vehiculo,
          entregas: delivered,
          recaudadoUSD: collectedUSD,
          recaudadoVES: collectedVES,
          eficiencia: efficiency
        };
      });

      // Sort by deliveries descending
      setRanking(stats.sort((a: any, b: any) => b.entregas - a.entregas));
    }
  }, []);

  const openWhatsApp = (nombre: string) => {
    const message = `Hola ${nombre}, te contacto desde Force Control Admin sobre tus entregas pendientes.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rendimiento de Flota</h1>
          <p className="text-slate-500 text-xs">Ranking operativo y eficiencia mensual</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg shadow-slate-200">
           <Trophy className="h-4 w-4 text-amber-400" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Leaderboard</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ranking.map((driver, index) => (
          <div 
            key={driver.id} 
            className={cn(
              "relative bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden",
              index === 0 ? "border-amber-200 ring-4 ring-amber-50" : ""
            )}
          >
            {/* Index Ribbon */}
            <div className={cn(
              "absolute top-0 left-0 w-12 h-12 flex items-center justify-center font-bold text-lg",
              index === 0 ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-400 rounded-br-3xl"
            )}>
              #{index + 1}
            </div>

            {index === 0 && (
              <div className="absolute top-4 right-4">
                <Medal className="h-6 w-6 text-amber-500 animate-bounce" />
              </div>
            )}

            <div className="mt-6 flex flex-col items-center">
               <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-50 shadow-inner mb-4">
                 <Users className="h-8 w-8 text-slate-400" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 leading-tight">{driver.nombre}</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{driver.vehiculo}</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-[8px] font-bold text-slate-400 uppercase mb-1">Entregas</div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    {driver.entregas}
                  </div>
               </div>
               <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-[8px] font-bold text-slate-400 uppercase mb-1">Eficiencia</div>
                  <div className="text-sm font-bold text-slate-900">
                    {Math.round(driver.eficiencia)}%
                  </div>
               </div>
            </div>

            <div className="mt-4 p-4 bg-slate-900 rounded-2xl text-white space-y-2">
               <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                  <span>Recaudación Total</span>
                  <DollarSign className="h-3 w-3" />
               </div>
               <div className="flex justify-between items-end">
                  <div className="text-lg font-bold">${driver.recaudadoUSD.toLocaleString()}</div>
                  <div className="text-[10px] font-bold text-slate-300">Bs. {driver.recaudadoVES.toLocaleString()}</div>
               </div>
            </div>

            <div className="mt-6">
              <Button 
                onClick={() => openWhatsApp(driver.nombre)}
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-12 font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-green-100"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contactar WhatsApp
              </Button>
            </div>
          </div>
        ))}

        {ranking.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
             <Truck className="h-12 w-12 text-slate-200 mx-auto mb-4" />
             <p className="text-slate-500 font-medium italic">No hay suficientes datos registrados para generar el ranking.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
