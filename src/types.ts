export type UserRole = 'admin' | 'driver' | 'client';

export interface Company {
  id: string;
  nombre: string;
  plan_suscripcion: 'basic' | 'professional' | 'enterprise';
  config_moneda: 'USD' | 'VES';
  created_at: string;
}

export interface Profile {
  id: string;
  nombre: string;
  empresa_id: string;
  rol: UserRole;
  phone_number?: string;
  avatar_url?: string;
}

export type DeliveryStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';

export interface Delivery {
  id: string;
  tracking_number: string;
  empresa_id: string;
  origen: string;
  destino_coords: {
    lat: number;
    lng: number;
    address: string;
  };
  status: DeliveryStatus;
  driver_id: string | null;
  created_at: string;
  updated_at: string;
}

export type PaymentCurrency = 'USD' | 'VES';
export type PaymentMethod = 'zelle' | 'pago_movil' | 'cash' | 'transferencia';
export type PaymentStatus = 'pending' | 'confirmed' | 'rejected';

export interface PaymentLog {
  id: string;
  delivery_id: string;
  monto: number;
  moneda: PaymentCurrency;
  metodo: PaymentMethod;
  pago_referencia?: string;
  status_pago: PaymentStatus;
  created_at: string;
}
