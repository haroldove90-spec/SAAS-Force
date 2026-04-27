import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  CreditCard, 
  Smartphone, 
  Globe, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Eye,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SettingsPage() {
  const [activeSegment, setActiveSegment] = useState<'empresa' | 'pagos' | 'tasa'>('empresa');
  const [loading, setLoading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  
  const [settings, setSettings] = useState({
    businessName: 'Distribuidora Los Andes C.A.',
    rif: 'J-12345678-9',
    direccion: 'Av. Las Industrias, Galpón 4, Valencia, Carabobo',
    telefono: '0241-8888888',
    zelleEmail: 'pagos@losandes.com',
    pmBanco: 'Banesco',
    pmCedula: '12345678',
    pmTelefono: '04141234567',
    tasaCambio: '36.50'
  });

  useEffect(() => {
    const saved = localStorage.getItem('force_settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('force_settings', JSON.stringify(settings));
      setLoading(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-24 md:pb-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configuración de Negocio</h1>
        <p className="text-slate-500 text-xs mt-1">Gestione su identidad fiscal y métodos de recaudación</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs Selector Mobile Style */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            <button 
              onClick={() => setActiveSegment('empresa')}
              className={cn(
                "flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                activeSegment === 'empresa' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              Empresa
            </button>
            <button 
              onClick={() => setActiveSegment('pagos')}
              className={cn(
                "flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                activeSegment === 'pagos' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              Pagos
            </button>
            <button 
              onClick={() => setActiveSegment('tasa')}
              className={cn(
                "flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                activeSegment === 'tasa' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              Tasa
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm min-h-[400px]">
            {activeSegment === 'empresa' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-3 text-slate-900 font-bold text-sm mb-2">
                  <Building2 className="h-4 w-4" /> Datos de Identidad
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">Nombre Comercial</Label>
                    <Input 
                      value={settings.businessName}
                      onChange={e => setSettings({...settings, businessName: e.target.value})}
                      className="h-11 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">RIF / Registro Fiscal</Label>
                    <Input 
                      value={settings.rif}
                      onChange={e => setSettings({...settings, rif: e.target.value})}
                      className="h-11 rounded-lg font-mono uppercase"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">Dirección Física</Label>
                    <Input 
                      value={settings.direccion}
                      onChange={e => setSettings({...settings, direccion: e.target.value})}
                      className="h-11 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">Teléfono de Contacto</Label>
                    <Input 
                      value={settings.telefono}
                      onChange={e => setSettings({...settings, telefono: e.target.value})}
                      className="h-11 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSegment === 'pagos' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-900 font-bold text-sm mb-2">
                    <Smartphone className="h-4 w-4" /> Pago Móvil (VES)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-400">Banco</Label>
                      <Input 
                        value={settings.pmBanco}
                        onChange={e => setSettings({...settings, pmBanco: e.target.value})}
                        className="h-11 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-400">Cédula / RIF</Label>
                      <Input 
                        value={settings.pmCedula}
                        onChange={e => setSettings({...settings, pmCedula: e.target.value})}
                        className="h-11 rounded-lg font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-400">Teléfono</Label>
                      <Input 
                        value={settings.pmTelefono}
                        onChange={e => setSettings({...settings, pmTelefono: e.target.value})}
                        className="h-11 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-slate-900 font-bold text-sm mb-2">
                    <CreditCard className="h-4 w-4" /> Zelle (USD)
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">Correo del Beneficiario</Label>
                    <Input 
                      value={settings.zelleEmail}
                      onChange={e => setSettings({...settings, zelleEmail: e.target.value})}
                      className="h-11 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSegment === 'tasa' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-3 text-slate-900 font-bold text-sm mb-2">
                  <TrendingUp className="h-4 w-4" /> Tasa de Cambio Manual
                </div>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                  <Info className="h-5 w-5 text-amber-600 shrink-0" />
                  <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                    Esta tasa se utilizará para convertir automáticamente los montos de USD a VES en las guías de despacho y reportes de liquidación.
                  </p>
                </div>
                <div className="max-w-xs space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-slate-400">Tasa (Bs. por 1 USD)</Label>
                  <div className="relative">
                    <Input 
                      type="number"
                      step="0.01"
                      value={settings.tasaCambio}
                      onChange={e => setSettings({...settings, tasaCambio: e.target.value})}
                      className="h-14 text-xl font-mono font-bold pl-12 rounded-xl border-slate-200"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Bs.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Desktop Save Button */}
          <div className="hidden md:flex justify-end gap-3 pt-2">
             <Button 
                onClick={handleSave}
                disabled={loading}
                className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-widest h-12 px-10 rounded-xl shadow-lg shadow-slate-200"
             >
                {loading ? "Guardando..." : "Guardar Cambios"}
             </Button>
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-2">
            <Eye className="h-3 w-3" /> Vista del Cliente
          </div>
          
          <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden border border-slate-800">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
             
             <div className="flex justify-between items-start">
               <div>
                 <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Pagos a:</div>
                 <div className="text-lg font-bold leading-tight">{settings.businessName}</div>
               </div>
               <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center">
                 <Globe className="h-4 w-4" />
               </div>
             </div>

             <div className="space-y-4">
               <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                 <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Pago Móvil</div>
                 <div className="grid grid-cols-2 gap-y-2">
                   <div className="text-[9px] text-slate-500 font-medium">BANCO</div>
                   <div className="text-[10px] font-bold text-right">{settings.pmBanco}</div>
                   <div className="text-[9px] text-slate-500 font-medium">CÉDULA</div>
                   <div className="text-[10px] font-mono font-bold text-right">{settings.pmCedula}</div>
                   <div className="text-[9px] text-slate-500 font-medium">TELÉFONO</div>
                   <div className="text-[10px] font-bold text-right">{settings.pmTelefono}</div>
                 </div>
               </div>

               <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                 <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Zelle</div>
                 <div className="text-[10px] font-bold bg-white/10 p-2 rounded-lg text-center break-all">
                   {settings.zelleEmail}
                 </div>
               </div>
             </div>

             <div className="pt-2">
                <div className="text-[8px] text-center text-slate-500 font-medium italic">
                  * Verificado por Force Control • {new Date().toLocaleDateString()}
                </div>
             </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200">
            <p className="text-[10px] text-slate-500 leading-relaxed text-center">
              Este es el diseño que visualizarán sus clientes al recibir el link de rastreo para liquidar sus órdenes.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Save Button Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-[40]">
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-slate-900 text-white font-bold text-[11px] uppercase tracking-widest h-14 rounded-2xl shadow-xl shadow-slate-200"
        >
          {loading ? "Sincronizando..." : "Guardar Configuración"}
        </Button>
      </div>

      {/* Success Toast */}
      {showSaved && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-900 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl z-[100]"
        >
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          <span className="text-xs font-bold uppercase tracking-widest">Cambios Guardados</span>
        </motion.div>
      )}
    </motion.div>
  );
}
