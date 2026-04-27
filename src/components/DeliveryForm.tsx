import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DeliveryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeliveryForm({ open, onOpenChange }: DeliveryFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase tracking-tight">Registrar Nuevo Envío</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Complete los datos detallados del origen y destino para generar el número de guía.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="origen" className="text-xs font-bold uppercase tracking-wider text-slate-400">Origen (Planta/Galpón)</Label>
            <Input id="origen" placeholder="Ej: Galpón Valencia Central" className="rounded-md" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="destino" className="text-xs font-bold uppercase tracking-wider text-slate-400">Dirección de Destino</Label>
            <Input id="destino" placeholder="Ej: Urb. Altamira, Edif Residencia 1" className="rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="driver" className="text-xs font-bold uppercase tracking-wider text-slate-400">Asignar Chofer</Label>
              <Select>
                <SelectTrigger id="driver" className="rounded-md">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drv1">Juan Pérez (Camión 02)</SelectItem>
                  <SelectItem value="drv2">José Rodríguez (Pickup 05)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-slate-400">Tipo de Carga</Label>
              <Select>
                <SelectTrigger id="type" className="rounded-md">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Seco</SelectItem>
                  <SelectItem value="re">Refrigerado</SelectItem>
                  <SelectItem value="hz">Peligroso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-md">Cancelar</Button>
          <Button type="submit" className="bg-slate-900 text-white rounded-md px-8 font-bold text-xs uppercase" onClick={() => onOpenChange(false)}>Generar Guía</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
