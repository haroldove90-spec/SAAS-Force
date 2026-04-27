/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { WelcomeHeader } from './components/WelcomeHeader';
import { StatsCards } from './components/StatsCards';
import { DeliveryList } from './components/DeliveryList';
import { PaymentList } from './components/PaymentList';
import { PaymentPage } from './components/PaymentPage';
import { DriversPage } from './components/DriversPage';
import { SettingsPage } from './components/SettingsPage';
import { DashboardMain } from './components/DashboardMain';
import { DriverPerformancePage } from './components/DriverPerformancePage';
import { mockDeliveries, mockPayments } from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on selection for mobile
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans relative">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-8 bg-white z-20 shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <h2 className="text-[10px] md:text-sm font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Operaciones / Venezuela
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 tracking-tight leading-none">Carlos Mendoza</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">Socio Administrador</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-900 border-4 border-slate-50 flex items-center justify-center font-bold text-xs text-white shadow-sm">
              CM
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-4 md:px-0">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <WelcomeHeader onNewDelivery={() => setActiveTab('deliveries')} />
                  <DashboardMain />
                </motion.div>
              )}

              {activeTab === 'deliveries' && (
                <motion.div
                  key="deliveries"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <DeliveryList />
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <PaymentPage />
              )}

              {activeTab === 'fleet' && (
                <DriversPage />
              )}

              {activeTab === 'performance' && (
                <DriverPerformancePage />
              )}

              {activeTab === 'users' && (
                <SettingsPage />
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
    </div>
  );
}
