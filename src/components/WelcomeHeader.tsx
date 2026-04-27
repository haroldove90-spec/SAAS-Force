import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeHeaderProps {
  onNewDelivery: () => void;
}

export function WelcomeHeader({ onNewDelivery }: WelcomeHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Resumen de Operaciones</h1>
        <p className="text-slate-500 text-xs mt-1">Estado en tiempo real de la red logística regional</p>
      </div>
      <Button 
        onClick={onNewDelivery} 
        className="bg-slate-900 text-white px-4 py-2 rounded-md font-bold text-[10px] tracking-wider uppercase hover:bg-slate-800"
      >
        + NUEVA ENTREGA
      </Button>
    </div>
  );
}
