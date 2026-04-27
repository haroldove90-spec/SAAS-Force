import { Delivery, DeliveryStatus, PaymentLog, Profile } from './types';

export const mockDeliveries: Delivery[] = [
  {
    id: '1',
    tracking_number: 'FC-99823-VE',
    empresa_id: 'cmp-1',
    origen: 'Galpón Carabobo, Valencia',
    destino_coords: { lat: 10.4806, lng: -66.9036, address: 'Altamira, Caracas' },
    status: 'in_transit',
    driver_id: 'drv-1',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    tracking_number: 'FC-99824-VE',
    empresa_id: 'cmp-1',
    origen: 'Puerto Cabello, Zona Primaria',
    destino_coords: { lat: 10.0678, lng: -69.3472, address: 'Zona Industrial II, Barquisimeto' },
    status: 'pending',
    driver_id: null,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    tracking_number: 'FC-99825-VE',
    empresa_id: 'cmp-1',
    origen: 'Sede Principal, Maracay',
    destino_coords: { lat: 10.6692, lng: -71.6166, address: 'Av. El Milagro, Maracaibo' },
    status: 'delivered',
    driver_id: 'drv-2',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const mockProfiles: Profile[] = [
  { id: 'usr-admin', nombre: 'Carlos Mendoza', empresa_id: 'cmp-1', rol: 'admin' },
  { id: 'drv-1', nombre: 'Juan Pérez', empresa_id: 'cmp-1', rol: 'driver' },
  { id: 'drv-2', nombre: 'José Rodríguez', empresa_id: 'cmp-1', rol: 'driver' },
];

export const mockPayments: PaymentLog[] = [
  {
    id: 'pay-1',
    delivery_id: '3',
    monto: 45.50,
    moneda: 'USD',
    metodo: 'zelle',
    pago_referencia: 'TXN882299',
    status_pago: 'confirmed',
    created_at: new Date().toISOString(),
  },
  {
    id: 'pay-2',
    delivery_id: '1',
    monto: 1550.00,
    moneda: 'VES',
    metodo: 'pago_movil',
    pago_referencia: '998231',
    status_pago: 'pending',
    created_at: new Date().toISOString(),
  }
];

export const getStatusColor = (status: DeliveryStatus) => {
  switch (status) {
    case 'pending': return 'bg-blue-100 text-blue-700 border-transparent';
    case 'in_transit': return 'bg-amber-100 text-amber-700 border-transparent';
    case 'delivered': return 'bg-green-100 text-green-700 border-transparent';
    case 'cancelled': return 'bg-red-100 text-red-700 border-transparent';
    default: return 'bg-slate-100 text-slate-700 border-transparent';
  }
};
