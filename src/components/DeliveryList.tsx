import React from 'react';
import { MoreHorizontal, ExternalLink, MapPin } from 'lucide-react';
import { Delivery } from '../types';
import { getStatusColor } from '../mockData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DeliveryListProps {
  deliveries: Delivery[];
  fullWidth?: boolean;
}

export function DeliveryList({ deliveries, fullWidth }: DeliveryListProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="font-bold text-slate-700 text-sm">Entregas Recientes</h2>
        <span className="text-[10px] text-slate-400 uppercase font-medium">Actualización en Vivo</span>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="px-4 py-3 font-bold text-slate-400 text-[10px] uppercase tracking-wider h-auto">Guía / Tracking</TableHead>
              <TableHead className="px-4 py-3 font-bold text-slate-400 text-[10px] uppercase tracking-wider h-auto">Ruta</TableHead>
              <TableHead className="px-4 py-3 font-bold text-slate-400 text-[10px] uppercase tracking-wider h-auto">Chofer</TableHead>
              <TableHead className="px-4 py-3 font-bold text-slate-400 text-[10px] uppercase tracking-wider h-auto">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-slate-600">
            {deliveries.map((delivery) => (
              <TableRow key={delivery.id} className="hover:bg-slate-50 border-slate-100 h-12">
                <td className="px-4 py-3 font-mono text-xs font-medium">
                  {delivery.tracking_number}
                </td>
                <td className="px-4 py-3 text-xs">
                  {delivery.origen.split(',')[0]} → {delivery.destino_coords.address.split(',')[0]}
                </td>
                <td className="px-4 py-3 text-xs">
                  {delivery.driver_id ? 'Juan Pérez' : 'Sin Asignar'}
                </td>
                <td className="px-4 py-3">
                  <Badge className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(delivery.status)} shadow-none`}>
                    {delivery.status === 'in_transit' ? 'En Tránsito' : 
                     delivery.status === 'pending' ? 'Pendiente' : 
                     delivery.status === 'delivered' ? 'Entregado' : 'Cancelado'}
                  </Badge>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
