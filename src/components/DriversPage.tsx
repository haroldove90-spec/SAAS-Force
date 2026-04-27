import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  Truck, 
  Phone, 
  Hash, 
  User as UserIcon,
  X,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface Driver {
  id: string;
  nombre: string;
  vehiculo: string;
  placa: string;
  telefono: string;
}

const INITIAL_DRIVERS: Driver[] = [
  { id: '1', nombre: 'Juan Pérez', vehiculo: 'Camión NPR', placa: 'A12BC3D', telefono: '0414-1234567' },
  { id: '2', nombre: 'José Rodríguez', vehiculo: 'Pickup Silverado', placa: 'B98XY7Z', telefono: '0424-7654321' },
  { id: '3', nombre: 'Miguel Rivas', vehiculo: 'Gandi-Carga', placa: 'V55JK9L', telefono: '0412-5556677' },
];

export function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    vehiculo: '',
    placa: '',
    telefono: ''
  });

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('fc_drivers');
    if (saved) {
      setDrivers(JSON.parse(saved));
    } else {
      setDrivers(INITIAL_DRIVERS);
      localStorage.setItem('fc_drivers', JSON.stringify(INITIAL_DRIVERS));
    }
  }, []);

  // Sync to LocalStorage
  const saveToStorage = (newDrivers: Driver[]) => {
    setDrivers(newDrivers);
    localStorage.setItem('fc_drivers', JSON.stringify(newDrivers));
  };

  const handleOpenDialog = (driver?: Driver) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        nombre: driver.nombre,
        vehiculo: driver.vehiculo,
        placa: driver.placa,
        telefono: driver.telefono
      });
    } else {
      setEditingDriver(null);
      setFormData({ nombre: '', vehiculo: '', placa: '', telefono: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDriver) {
      const updated = drivers.map(d => d.id === editingDriver.id ? { ...d, ...formData } : d);
      saveToStorage(updated);
    } else {
      const nuevo: Driver = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      };
      saveToStorage([...drivers, nuevo]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      const filtered = drivers.filter(d => d.id !== id);
      saveToStorage(filtered);
    }
  };

  const filteredDrivers = drivers.filter(d => 
    d.nombre.toLowerCase().includes(search.toLowerCase()) ||
    d.placa.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Gestión de Flota</h1>
          <p className="text-slate-500 text-xs mt-1">Directorio maestro de choferes y vehículos autorizados</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-slate-900 text-white gap-2 font-bold text-[10px] uppercase tracking-wider h-11"
        >
          <UserPlus className="h-4 w-4" />
          Registrar Chofer
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-11 shadow-sm">
        <Search className="h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Buscar por nombre o placa..." 
          className="border-none shadow-none focus-visible:ring-0 text-sm h-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 h-10">
                <TableHead className="px-6 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Chofer</TableHead>
                <TableHead className="px-6 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Vehículo / Placa</TableHead>
                <TableHead className="px-6 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Teléfono</TableHead>
                <TableHead className="px-6 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id} className="hover:bg-slate-50 border-slate-100 transition-colors h-16">
                  <TableCell className="px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
                        {driver.nombre.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{driver.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="space-y-0.5">
                      <div className="text-xs text-slate-700 font-medium">{driver.vehiculo}</div>
                      <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">{driver.placa}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 text-xs text-slate-600 font-medium">{driver.telefono}</TableCell>
                  <TableCell className="px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenDialog(driver)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(driver.id)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View - Tactical Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredDrivers.map((driver) => (
            <div key={driver.id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {driver.nombre.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{driver.nombre}</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">ID: {driver.id.toUpperCase()}</div>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                   <Phone className="h-3.5 w-3.5 text-slate-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                    <Truck className="h-2.5 w-2.5" /> Vehículo
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate">{driver.vehiculo}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                    <Hash className="h-2.5 w-2.5" /> Placa
                  </div>
                  <div className="text-xs font-bold text-slate-800 font-mono tracking-wider uppercase">{driver.placa}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleOpenDialog(driver)}
                  className="flex-1 bg-white border border-slate-200 text-slate-900 h-10 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50"
                  variant="outline"
                >
                  <Edit2 className="h-3.5 w-3.5 mr-2" />
                  Editar
                </Button>
                <Button 
                  onClick={() => handleDelete(driver.id)}
                  className="bg-red-50 text-red-600 border border-red-100 h-10 w-10 hover:bg-red-100"
                  variant="ghost"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {filteredDrivers.length === 0 && (
            <div className="p-8 text-center bg-slate-50/50">
              <UserIcon className="h-12 w-12 mx-auto text-slate-200 mb-2" />
              <p className="text-xs text-slate-400 font-mono italic">No se encontraron choferes registrados</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader className="pb-4 border-b border-slate-100">
            <DialogTitle className="font-bold text-slate-900 tracking-tight flex items-center gap-2">
               {editingDriver ? <Edit2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
               {editingDriver ? 'Editar Chofer' : 'Registrar Nuevo Chofer'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Ingrese los datos actualizados del chofer y su vehículo asignado.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre Completo</Label>
              <Input 
                id="nombre" 
                required
                value={formData.nombre}
                onChange={e => setFormData({...formData, nombre: e.target.value})}
                placeholder="Ej: Daniel González" 
                className="h-11 rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehiculo" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehículo</Label>
                <Input 
                  id="vehiculo" 
                  required
                  value={formData.vehiculo}
                  onChange={e => setFormData({...formData, vehiculo: e.target.value})}
                  placeholder="Ej: NPR Blanco" 
                  className="h-11 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="placa" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nro. de Placa</Label>
                <Input 
                  id="placa" 
                  required
                  value={formData.placa}
                  onChange={e => setFormData({...formData, placa: e.target.value})}
                  placeholder="AB123CD" 
                  className="h-11 rounded-md font-mono uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teléfono de Contacto</Label>
              <Input 
                id="telefono" 
                required
                value={formData.telefono}
                onChange={e => setFormData({...formData, telefono: e.target.value})}
                placeholder="0414-0000000" 
                className="h-11 rounded-md"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="rounded-md h-11 text-[11px] font-bold uppercase tracking-wider"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-slate-900 text-white rounded-md h-11 px-8 text-[11px] font-bold uppercase tracking-wider"
              >
                {editingDriver ? 'Guardar Cambios' : 'Finalizar Registro'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
