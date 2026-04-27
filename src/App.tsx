/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { WelcomeHeader } from './components/WelcomeHeader';
import { StatsCards } from './components/StatsCards';
import { DeliveryList } from './components/DeliveryList';
import { PaymentList } from './components/PaymentList';
import { DeliveryForm } from './components/DeliveryForm';
import { PaymentPage } from './components/PaymentPage';
import { mockDeliveries, mockPayments } from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNewDelivery, setShowNewDelivery] = useState(false);

  const stats = [
    { label: 'En Tránsito', value: '128', change: '↑ 12% vs ayer', trend: 'text-green-600' },
    { label: 'Volumen Diario', value: '$4,290.00', change: 'Liquidado en USD', trend: 'text-slate-400' },
    { label: 'Bolívares (VES)', value: 'Bs. 156.40K', change: 'Pago Móvil y Efectivo', trend: 'text-slate-400' },
    { label: 'Choferes Activos', value: '42 / 50', change: 'Utilización de Flota: 84%', trend: 'text-slate-400' },
  ];
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Operaciones / Venezuela
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">Carlos Mendoza</p>
              <p className="text-xs text-muted-foreground uppercase">Admin / Logística Integral C.A.</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-muted border flex items-center justify-center font-bold text-xs">
              CM
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <WelcomeHeader onNewDelivery={() => setShowNewDelivery(true)} />
                  <StatsCards />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                       <DeliveryList deliveries={mockDeliveries} />
                    </div>
                    <div>
                       <PaymentList payments={mockPayments} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'deliveries' && (
                <motion.div
                  key="deliveries"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <DeliveryList deliveries={mockDeliveries} fullWidth />
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <PaymentPage />
              )}

              {/* Placeholder for other tabs */}
              {['map', 'fleet', 'users'].includes(activeTab) && (
                <motion.div
                  key="placeholder"
                  className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl bg-card/50"
                >
                  <p className="text-muted-foreground font-mono uppercase tracking-tighter">Módulo en Desarrollo</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <DeliveryForm open={showNewDelivery} onOpenChange={setShowNewDelivery} />
    </div>
  );
}
