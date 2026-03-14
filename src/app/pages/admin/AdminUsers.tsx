import { useState, useEffect } from 'react';
import { Plus, Edit, Trash, User as UserIcon } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { toast } from 'sonner';
import { supabaseAPI, type User } from '../../data/supabase';
import { Role } from '../../data/roles';
import { RolePermissionsCard } from '../../components/admin/RolePermissionsCard';

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'viewer' as Role,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await supabaseAPI.getUsers();
      setUsers(usersData);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingUser) {
        // Editar usuario existente
        const updatedUser = await supabaseAPI.updateUser(editingUser.id, {
          email: formData.email,
          role: formData.role,
        });
        console.log('Updated user:', updatedUser);
        toast.success('Usuario actualizado exitosamente');
      } else {
        // Crear nuevo usuario (se genera un nombre y contraseña temporal)
        const tempPassword = Math.random().toString(36).slice(-8);
        const newUser = await supabaseAPI.registerUser({
          email: formData.email,
          name: formData.email.split('@')[0], // Usar parte del email como nombre
          password: tempPassword,
          role: formData.role,
        });
        console.log('New user:', newUser);
        toast.success('Usuario creado exitosamente');
      }

      setIsModalOpen(false);
      loadUsers();
      resetForm();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      toast.error('Error al guardar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      password: '',
      role: user.role as Role,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    // Obtener usuario actual
    const userToDelete = users.find(u => u.id === userId);
    
    if (!userToDelete) {
      toast.error('Usuario no encontrado');
      return;
    }
    
    // Restricción: No se puede eliminar el admin principal
    if (userToDelete.role === 'admin') {
      const otherAdmins = users.filter(u => u.role === 'admin' && u.id !== userId);
      if (otherAdmins.length === 0) {
        toast.error('No se puede eliminar el último administrador');
        return;
      }
    }
    
    // Restricción: No se puede eliminar a sí mismo
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (currentUser && currentUser.id === userId) {
      toast.error('No se puede eliminar a sí mismo');
      return;
    }
    
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await supabaseAPI.deleteUser(userId);
        toast.success('Usuario eliminado exitosamente');
        loadUsers();
      } catch (error) {
        toast.error('Error al eliminar usuario');
      }
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      name: '',
      password: '',
      role: 'viewer',
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl text-[#1C5D15] mb-2">Usuarios y Roles</h2>
        <p className="text-[#629960]">Gestiona los usuarios y sus permisos</p>
      </div>

      {/* Botón para crear usuario */}
      <div className="flex justify-end mb-6">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="correo@ejemplo.com"
                  disabled={!!editingUser} // No se puede editar el email de usuarios existentes
                />
              </div>
              
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as Role })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15]"
                disabled={isLoading}
              >
                {isLoading ? 'Cargando...' : (editingUser ? 'Actualizar' : 'Crear')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de usuarios */}
      <Card className="p-6 bg-white border-2 border-[#629960]/20">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#1C5D15]">Nombre</TableHead>
              <TableHead className="text-[#1C5D15]">Email</TableHead>
              <TableHead className="text-[#1C5D15]">Rol</TableHead>
              <TableHead className="text-[#1C5D15]">Fecha de creación</TableHead>
              <TableHead className="text-[#1C5D15] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#19FF00]/20 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-[#1C5D15]" />
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-[#629960]">{user.email}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'manager' ? 'bg-green-100 text-green-800' :
                    user.role === 'viewer' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role === 'admin' && 'Administrador'}
                    {user.role === 'editor' && 'Editor'}
                    {user.role === 'manager' && 'Gerente'}
                    {user.role === 'viewer' && 'Visualizador'}
                    {user.role === 'customer' && 'Cliente'}
                  </span>
                </TableCell>
                <TableCell className="text-[#629960]">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      onClick={() => handleEdit(user)}
                      variant="secondary"
                      size="sm"
                      className="bg-[#629960] text-white hover:bg-[#1C5D15]"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => handleDelete(user.id)}
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Sección de roles y permisos */}
      <div className="mt-8">
        <h3 className="text-2xl text-[#1C5D15] mb-4">Roles y Permisos</h3>
        <div className="grid gap-6">
          {(['admin', 'editor', 'manager', 'viewer'] as Role[]).map((role) => (
            <RolePermissionsCard key={role} role={role} />
          ))}
        </div>
      </div>
    </div>
  );
}