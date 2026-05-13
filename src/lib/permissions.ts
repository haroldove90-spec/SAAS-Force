export type UserRole = 'ADMIN' | 'OPERATOR' | 'CASHIER' | 'DRIVER';

export type Action = 
  | 'VIEW_FINANCE' 
  | 'DELETE_EXPENSE' 
  | 'MANAGE_USERS' 
  | 'CREATE_DELIVERY' 
  | 'VALIDATE_PAYMENT' 
  | 'VIEW_ALL_DRIVERS';

export function checkPermission(role: UserRole, action: Action): boolean {
  switch (role) {
    case 'ADMIN':
      return true; // All access
    case 'OPERATOR':
      return ['CREATE_DELIVERY', 'VIEW_ALL_DRIVERS'].includes(action);
    case 'CASHIER':
      return ['VALIDATE_PAYMENT'].includes(action);
    case 'DRIVER':
      return false; // Very limited, handled by components
    default:
      return false;
  }
}
