import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Shield, 
  Key,
  Trash2,
  RefreshCw,
  CheckCircle2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type UserRole = 'ADMIN' | 'OPERATOR' | 'CASHIER' | 'DRIVER';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'OPERATOR' as UserRole });

  useEffect(() => {
    const savedUsers = localStorage.getItem('fc_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const initialUsers: User[] = [
        { id: '1', name: 'Admin Principal', email: 'admin@saasforce.com', role: 'ADMIN' },
        { id: '2', name: 'Juan Despacho', email: 'juan@saasforce.com', role: 'OPERATOR' }
      ];
      setUsers(initialUsers);
      localStorage.setItem('fc_users', JSON.stringify(initialUsers));
    }

    const current = localStorage.getItem('fc_active_user');
    if (current) setActiveUser(JSON.parse(current));
  }, []);

  const handleSwitchUser = (user: User) => {
    setActiveUser(user);
    localStorage.setItem('fc_active_user', JSON.stringify(user));
    window.location.reload(); // Quick way to update Sidebar and other components
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      ...formData
    };
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('fc_users', JSON.stringify(updated));
    setIsAdding(false);
    setFormData({ name: '', email: '', role: 'OPERATOR' });
  };

  const deleteUser = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem('fc_users', JSON.stringify(updated));
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return <Badge className="bg-slate-900 text-white border-0 text-[9px] font-bold">SUPER ADMIN</Badge>;
      case 'OPERATOR': return <Badge className="bg-blue-100 text-blue-700 border-0 text-[9px] font-bold">DESPACHADOR</Badge>;
      case 'CASHIER': return <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[9px] font-bold">CAJERO</Badge>;
      case 'DRIVER': return <Badge className="bg-amber-100 text-amber-700 border-0 text-[9px] font-bold">CHOFER</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-24 md:pb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios y Roles</h1>
          <p className="text-slate-500 text-xs">Control de acceso y auditoría de permisos (ACL)</p>
        </div>
        <div className="flex gap-2">
            {activeUser && (
                <div className="bg-slate-100 px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-[10px] font-bold uppercase text-slate-600">
                        Sesión: <span className="text-slate-900">{activeUser.name}</span>
                    </div>
                </div>
            )}
            <Button 
                onClick={() => setIsAdding(true)}
                className="bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest h-11 px-6 rounded-xl"
            >
                <UserPlus className="h-4 w-4 mr-2" /> Agregar Perfil
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900">Perfiles Registrados</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {users.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold">
                       {user.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{user.name}</span>
                            {getRoleBadge(user.role)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSwitchUser(user)}
                        className={cn(
                            "text-[9px] font-bold uppercase tracking-widest",
                            activeUser?.id === user.id ? "text-green-600 bg-green-50" : "text-slate-400"
                        )}
                    >
                        {activeUser?.id === user.id ? "Sesión Activa" : "Simular Login"}
                    </Button>
                    <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACL Reference Guide */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
             <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
                <h3 className="text-lg font-bold tracking-tight">Matriz de Permisos (ACL)</h3>
             </div>
             
             <div className="space-y-4 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Super Admin</div>
                      <p className="text-[10px] text-slate-300 leading-relaxed italic">Acceso absoluto. Gestión de utilidades, gastos y usuarios.</p>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Despachador</div>
                      <p className="text-[10px] text-slate-300 leading-relaxed italic">Logística pura. Crea pedidos y asigna flota. Sin acceso financiero.</p>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Cajero</div>
                      <p className="text-[10px] text-slate-300 leading-relaxed italic">Conciliación. Solo valida pagos y cierra cajas de choferes.</p>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Chofer</div>
                      <p className="text-[10px] text-slate-300 leading-relaxed italic">Ejecución. Solo visualiza su propia ruta del día.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Info / Sidebar */}
        <div className="space-y-4">
          {/* Active User Status Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Estado del Sistema</h4>
             <div className="bg-slate-50 p-4 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Shield className="h-5 w-5 text-slate-900" />
                   </div>
                   <div>
                      <div className="text-xs font-bold text-slate-900 uppercase">Capa de Seguridad</div>
                      <div className="text-[9px] text-green-600 font-bold">Activa (LocalStorage)</div>
                   </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500">
                   <span>TOKEN JWT SYNC</span>
                   <span className="text-slate-900 font-mono">OK</span>
                </div>
             </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
             <div className="flex gap-3 mb-3">
                <RefreshCw className="h-5 w-5 text-amber-600 shrink-0" />
                <div className="text-xs font-bold text-amber-900 uppercase">Simulación de Roles</div>
             </div>
             <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                Al "Simular Login", el sistema actualizará los permisos globales. Verás como el menú lateral y las gráficas financieras se ocultan o muestran según la jerarquía del perfil seleccionado.
             </p>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white rounded-3xl shadow-2xl p-8 z-[201] overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-xl font-bold text-slate-900">Nuevo Perfil</h2>
                    <p className="text-xs text-slate-400">Asigne el rol adecuado para limitar el acceso</p>
                 </div>
                 <button onClick={() => setIsAdding(false)} className="p-2 text-slate-400">
                    <X className="h-5 w-5" />
                 </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">Nombre Completo</Label>
                    <Input 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="h-11 rounded-lg"
                        placeholder="Ej: Maria Perez"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">Correo Electrónico</Label>
                    <Input 
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="h-11 rounded-lg"
                        placeholder="maria@saasforce.com"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">Asignar Rol</Label>
                    <Select value={formData.role} onValueChange={(val: UserRole) => setFormData({...formData, role: val})}>
                        <SelectTrigger className="h-11 rounded-lg">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ADMIN">Super Admin</SelectItem>
                            <SelectItem value="OPERATOR">Despachador</SelectItem>
                            <SelectItem value="CASHIER">Cajero</SelectItem>
                            <SelectItem value="DRIVER">Chofer</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>

                 <div className="pt-4">
                    <Button className="w-full bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest h-12 rounded-xl">
                        Registrar Usuario
                    </Button>
                 </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
