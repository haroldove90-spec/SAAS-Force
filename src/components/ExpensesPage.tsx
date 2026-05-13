import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Fuel,
  Hammer,
  UserCheck,
  MoreHorizontal,
  X,
  Save,
  Loader2,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Expense {
  id: string;
  descripcion: string;
  categoria: 'Gasolina' | 'Mantenimiento' | 'Sueldos' | 'Otros';
  monto: number;
  moneda: 'USD' | 'VES';
  fecha: string;
}

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [totalIncome, setTotalIncome] = useState({ usd: 0, ves: 0 });
  
  const [formData, setFormData] = useState({
    descripcion: '',
    categoria: 'Gasolina' as Expense['categoria'],
    monto: '',
    moneda: 'USD' as Expense['moneda']
  });

  useEffect(() => {
    const current = localStorage.getItem('fc_active_user');
    if (current) setActiveUser(JSON.parse(current));

    // Load Expenses
    const savedExp = localStorage.getItem('force_expenses');
    if (savedExp) setExpenses(JSON.parse(savedExp));

    // Load Income from deliveries
    const savedDel = localStorage.getItem('force_deliveries');
    if (savedDel) {
      const deliveries = JSON.parse(savedDel);
      const totals = deliveries.reduce((acc: any, d: any) => {
        if (d.moneda === 'USD') acc.usd += parseFloat(d.monto || 0);
        if (d.moneda === 'VES') acc.ves += parseFloat(d.monto || 0);
        return acc;
      }, { usd: 0, ves: 0 });
      setTotalIncome(totals);
    }
  }, []);

  const isAdmin = activeUser?.role === 'ADMIN';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descripcion || !formData.monto) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const newExpense: Expense = {
      id: `EXP-${Date.now()}`,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      monto: parseFloat(formData.monto),
      moneda: formData.moneda,
      fecha: new Date().toISOString()
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    localStorage.setItem('force_expenses', JSON.stringify(updated));
    
    setFormData({ descripcion: '', categoria: 'Gasolina', monto: '', moneda: 'USD' });
    setLoading(false);
    setIsDrawerOpen(false);
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    localStorage.setItem('force_expenses', JSON.stringify(updated));
  };

  // Calculations
  const expTotals = expenses.reduce((acc: any, e: any) => {
    if (e.moneda === 'USD') acc.usd += e.monto;
    if (e.moneda === 'VES') acc.ves += e.monto;
    return acc;
  }, { usd: 0, ves: 0 });

  const utilityUSD = totalIncome.usd - expTotals.usd;
  const utilityVES = totalIncome.ves - expTotals.ves;

  const catTotals = expenses.reduce((acc: any, e: any) => {
    acc[e.categoria] = (acc[e.categoria] || 0) + (e.moneda === 'USD' ? e.monto : 0); // Normalized to USD for bars logic
    return acc;
  }, {});

  const maxCat = Math.max(...(Object.values(catTotals) as number[]), 1);

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Gastos</h1>
          <p className="text-slate-500 text-xs">Control de egresos y balance operativo</p>
        </div>
        <Button 
          onClick={() => setIsDrawerOpen(true)}
          className="hidden md:flex bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest h-11 px-6 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" /> Nuevo Gasto
        </Button>
      </div>

      {/* Utility Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cn(
          "p-6 rounded-3xl border shadow-sm transition-all overflow-hidden relative",
          utilityUSD >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"
        )}>
          <div className="flex justify-between items-start mb-4">
            <div className={cn(
              "p-3 rounded-2xl",
              utilityUSD >= 0 ? "bg-emerald-100" : "bg-rose-100"
            )}>
              {utilityUSD >= 0 ? <TrendingUp className="h-6 w-6 text-emerald-600" /> : <TrendingDown className="h-6 w-6 text-rose-600" />}
            </div>
            <Badge className={cn(
              "border-0 text-[10px] font-bold uppercase py-1",
              utilityUSD >= 0 ? "bg-emerald-200 text-emerald-800" : "bg-rose-200 text-rose-800"
            )}>
              Utilidad Neta USD
            </Badge>
          </div>
          <div className={cn(
            "text-3xl font-black tracking-tighter",
            utilityUSD >= 0 ? "text-emerald-900" : "text-rose-900"
          )}>
            ${utilityUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              Ingresos: ${totalIncome.usd.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              Gastos: ${expTotals.usd.toLocaleString()}
            </div>
          </div>
        </div>

        <div className={cn(
          "p-6 rounded-3xl border shadow-sm transition-all overflow-hidden relative",
          utilityVES >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"
        )}>
          <div className="flex justify-between items-start mb-4">
            <div className={cn(
              "p-3 rounded-2xl",
              utilityVES >= 0 ? "bg-emerald-100" : "bg-rose-100"
            )}>
              {utilityVES >= 0 ? <TrendingUp className="h-6 w-6 text-emerald-600" /> : <TrendingDown className="h-6 w-6 text-rose-600" />}
            </div>
            <Badge className={cn(
              "border-0 text-[10px] font-bold uppercase py-1",
              utilityVES >= 0 ? "bg-emerald-200 text-emerald-800" : "bg-rose-200 text-rose-800"
            )}>
              Utilidad Neta VES
            </Badge>
          </div>
          <div className={cn(
            "text-3xl font-black tracking-tighter",
            utilityVES >= 0 ? "text-emerald-900" : "text-rose-900"
          )}>
            Bs. {utilityVES.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              Ingresos: {totalIncome.ves.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              Gastos: {expTotals.ves.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Receipt className="h-4 w-4 text-slate-400" /> Distribución de Gastos (USD)
          </h3>
          <div className="space-y-6">
            {['Gasolina', 'Mantenimiento', 'Sueldos', 'Otros'].map((cat) => {
              const val = catTotals[cat] || 0;
              const perc = (val / maxCat) * 100;
              return (
                <div key={cat} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span>{cat}</span>
                    <span className="text-slate-900">${val.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${perc}%` }}
                      className="h-full bg-rose-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Últimos Movimientos</h3>
          <div className="space-y-1">
             {expenses.map((exp) => (
               <div key={exp.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                       {exp.categoria === 'Gasolina' && <Fuel className="h-5 w-5" />}
                       {exp.categoria === 'Mantenimiento' && <Hammer className="h-5 w-5" />}
                       {exp.categoria === 'Sueldos' && <UserCheck className="h-5 w-5" />}
                       {exp.categoria === 'Otros' && <MoreHorizontal className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{exp.descripcion}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{exp.categoria} • {new Date(exp.fecha).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                       <div className="text-sm font-bold text-rose-600">
                         -{exp.moneda === 'VES' ? 'Bs' : '$'} {exp.monto.toLocaleString()}
                       </div>
                    </div>
                    {isAdmin && (
                      <button 
                        onClick={() => deleteExpense(exp.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
               </div>
             ))}
             {expenses.length === 0 && (
               <div className="text-center py-16 text-slate-400 italic text-xs">
                 Sin gastos registrados en este periodo.
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Floating Add Button For Mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsDrawerOpen(true)}
          className="h-14 w-14 rounded-full bg-slate-900 text-white shadow-2xl flex items-center justify-center"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Expense Modal (Drawer Style) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "fixed right-0 bottom-0 w-full md:top-0 md:h-screen md:w-[400px] z-[101]",
                "bg-white shadow-2xl overflow-y-auto px-8 py-10 rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none h-[80%] md:h-full"
              )}
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Registrar Gasto</h2>
                  <p className="text-slate-500 text-xs mt-1">Contabilice sus egresos operativos</p>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-full bg-slate-50 text-slate-400">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-slate-400">Descripción</Label>
                  <Input 
                    required
                    placeholder="Ej: Gasolina Camioneta NPR-42"
                    value={formData.descripcion}
                    onChange={e => setFormData({...formData, descripcion: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-slate-400">Categoría</Label>
                  <Select value={formData.categoria} onValueChange={(val: any) => setFormData({...formData, categoria: val})}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasolina">Gasolina / Combustible</SelectItem>
                      <SelectItem value="Mantenimiento">Mantenimiento vehicular</SelectItem>
                      <SelectItem value="Sueldos">Sueldos y Viáticos</SelectItem>
                      <SelectItem value="Otros">Otros (Papelería, etc)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">Monto</Label>
                    <Input 
                      required
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.monto}
                      onChange={e => setFormData({...formData, monto: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">Moneda</Label>
                    <Select value={formData.moneda} onValueChange={(val: any) => setFormData({...formData, moneda: val})}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="VES">VES (Bs.)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-8">
                  <Button 
                    disabled={loading}
                    className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-slate-200"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                      <>
                        <Save className="h-4 w-4 mr-2" /> Guardar Gasto
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
