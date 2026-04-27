import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  MapPin, 
  Truck, 
  User, 
  DollarSign, 
  CreditCard, 
  X, 
  Save, 
  Loader2,
  CheckCircle2,
  Clock,
  MoreVertical,
  Edit2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getStatusColor, mockDeliveries } from '../mockData';
import { Delivery } from '../types';

export function DeliveryList() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    cliente: '',
    direccion: '',
    choferId: '',
    monto: '',
    moneda: 'USD',
    metodoPago: 'zelle'
  });

  // Load Data
  useEffect(() => {
    const savedDeliveries = localStorage.getItem('force_deliveries');
    if (savedDeliveries) {
      setDeliveries(JSON.parse(savedDeliveries));
    } else {
      // Seed with some mock data if empty
      const initial = mockDeliveries.map(d => ({
        id: d.id,
        tracking: d.tracking_number,
        cliente: 'Cliente de Prueba',
        direccion: d.destino_coords.address,
        choferId: d.driver_id || '',
        monto: 15.50,
        moneda: 'USD',
        metodoPago: 'efectivo',
        status: d.status,
        timestamp: d.created_at
      }));
      setDeliveries(initial);
      localStorage.setItem('force_deliveries', JSON.stringify(initial));
    }

    const savedDrivers = localStorage.getItem('fc_drivers');
    if (savedDrivers) {
      setDrivers(JSON.parse(savedDrivers));
    }
  }, []);

  const openDrawer = (delivery?: any) => {
    if (delivery) {
      setEditingDelivery(delivery);
      setFormData({
        cliente: delivery.cliente || '',
        direccion: delivery.direccion || '',
        choferId: delivery.choferId || '',
        monto: delivery.monto?.toString() || '',
        moneda: delivery.moneda || 'USD',
        metodoPago: delivery.metodoPago || 'zelle'
      });
    } else {
      setEditingDelivery(null);
      setFormData({
        cliente: '',
        direccion: '',
        choferId: '',
        monto: '',
        moneda: 'USD',
        metodoPago: 'zelle'
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cliente || !formData.direccion || !formData.monto) {
      alert('Complete los campos obligatorios');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // Realism

    let updatedDeliveries;
    if (editingDelivery) {
      updatedDeliveries = deliveries.map(d => 
        d.id === editingDelivery.id ? { ...d, ...formData, monto: parseFloat(formData.monto) } : d
      );
    } else {
      const newEntry = {
        id: `GUID-${Math.floor(Math.random() * 90000) + 10000}`,
        tracking: `FC${Math.floor(Math.random() * 900000) + 100000}`,
        ...formData,
        monto: parseFloat(formData.monto),
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      updatedDeliveries = [newEntry, ...deliveries];
    }

    setDeliveries(updatedDeliveries);
    localStorage.setItem('force_deliveries', JSON.stringify(updatedDeliveries));
    setLoading(false);
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header moved inside for token economy/encapsulation */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Registro de Entregas</h1>
          <p className="text-slate-500 text-xs">Gestión y control de guías en tiempo real</p>
        </div>
        <Button 
          onClick={() => openDrawer()}
          className="bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider h-11 px-6 shadow-lg shadow-slate-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Entrega
        </Button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Search className="h-3 w-3" /> Buscar Guía
          </div>
          <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Sistema en Línea
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100">
                <TableHead className="px-6 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Tracking / Cliente</TableHead>
                <TableHead className="px-6 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Chofer</TableHead>
                <TableHead className="px-6 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Liquidación</TableHead>
                <TableHead className="px-6 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Estatus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((d) => (
                <TableRow 
                  key={d.id} 
                  onClick={() => openDrawer(d)}
                  className="hover:bg-slate-50 border-slate-100 h-16 cursor-pointer transition-colors group"
                >
                  <TableCell className="px-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase leading-tight group-hover:text-slate-900 transition-colors">
                        {d.tracking || d.tracking_number}
                      </span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5">{d.cliente || 'Consumidor Final'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <Truck className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <span className="text-xs text-slate-600 font-medium">
                        {drivers.find(dr => dr.id === d.choferId)?.nombre || 'Sin Asignar'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">
                        {d.moneda === 'VES' ? 'Bs' : '$'} {d.monto?.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase leading-none mt-1">
                        {d.metodoPago || 'EFECTIVO'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <Badge className={cn(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase shadow-none border-0",
                      d.status === 'delivered' ? "bg-green-100 text-green-700" : 
                      d.status === 'pending' ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                       {d.status === 'delivered' ? 'Entregado' : 
                        d.status === 'pending' ? 'Pendiente' : 
                        d.status === 'in_transit' ? 'En Tránsito' : 'Cancelado'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Drawer Component */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: '100%', y: 0 }}
              animate={{ x: 0, y: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "fixed right-0 bg-white shadow-2xl z-[101] overflow-y-auto",
                "bottom-0 w-full md:top-0 md:h-screen md:w-[450px]",
                "h-[90%] md:h-full rounded-t-[2rem] md:rounded-l-[2.5rem] md:rounded-tr-none px-8 py-10"
              )}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {editingDelivery ? 'Editar Entrega' : 'Nueva Entrega'}
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">
                    {editingDelivery ? `Ajustando Guía ${editingDelivery.tracking}` : 'Complete el manifiesto para despacho'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
                      <User className="h-3 w-3" /> Cliente Destinatario
                    </Label>
                    <Input 
                      required
                      placeholder="Ej: Farmatodo Las Mercedes"
                      className="h-12 rounded-xl focus-visible:ring-slate-900"
                      value={formData.cliente}
                      onChange={e => setFormData({...formData, cliente: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> Dirección de Entrega
                    </Label>
                    <Input 
                      required
                      placeholder="Calle, Edificio, Referencia"
                      className="h-12 rounded-xl focus-visible:ring-slate-900"
                      value={formData.direccion}
                      onChange={e => setFormData({...formData, direccion: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
                      <Truck className="h-3 w-3" /> Seleccionar Chofer
                    </Label>
                    <Select value={formData.choferId} onValueChange={val => setFormData({...formData, choferId: val})}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Buscar en flota operativa..." />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map(dr => (
                          <SelectItem key={dr.id} value={dr.id}>{dr.nombre} - {dr.vehiculo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
                        <DollarSign className="h-3 w-3" /> Monto
                      </Label>
                      <Input 
                        required
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="h-12 rounded-xl focus-visible:ring-slate-900"
                        value={formData.monto}
                        onChange={e => setFormData({...formData, monto: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
                        Moneda
                      </Label>
                      <Select value={formData.moneda} onValueChange={val => setFormData({...formData, moneda: val})}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">Dólares (USD)</SelectItem>
                          <SelectItem value="VES">Bolívares (VES)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
                      <CreditCard className="h-3 w-3" /> Método de Liquidación
                    </Label>
                    <Select value={formData.metodoPago} onValueChange={val => setFormData({...formData, metodoPago: val})}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zelle">Zelle / Digital</SelectItem>
                        <SelectItem value="pago_movil">Pago Móvil</SelectItem>
                        <SelectItem value="efectivo">Efectivo Físico</SelectItem>
                        <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-8">
                  <Button 
                    disabled={loading}
                    className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-slate-200"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingDelivery ? 'Actualizar Registro' : 'Generar Guía de Despacho'}
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
