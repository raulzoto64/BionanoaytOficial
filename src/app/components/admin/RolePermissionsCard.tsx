import { useState } from 'react';
import { Shield, Save, RotateCcw } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Role, permissions, getPermissionsForRole, setPermissionsForRole, resetRolePermissions } from '../../data/roles';

interface RolePermissionsCardProps {
  role: Role;
}

export function RolePermissionsCard({ role }: RolePermissionsCardProps) {
  const [currentPermissions, setCurrentPermissions] = useState<string[]>(
    getPermissionsForRole(role)
  );
  const [isEditing, setIsEditing] = useState(false);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setCurrentPermissions([...currentPermissions, permissionId]);
    } else {
      setCurrentPermissions(currentPermissions.filter(p => p !== permissionId));
    }
  };

  const handleSave = () => {
    if (role === 'admin') {
      // Admin siempre tiene todos los permisos
      toast.error('El rol de Administrador siempre tiene todos los permisos');
      return;
    }
    
    setPermissionsForRole(role, currentPermissions);
    toast.success(`Permisos actualizados para el rol ${role}`);
    setIsEditing(false);
  };

  const handleReset = () => {
    const initialPermissions = resetRolePermissions();
    setCurrentPermissions(getPermissionsForRole(role));
    toast.success(`Permisos restablecidos para el rol ${role}`);
    setIsEditing(false);
  };

  const isPermissionChecked = (permissionId: string) => {
    if (role === 'admin') return true;
    return currentPermissions.includes(permissionId);
  };

  return (
    <Card className="p-6 bg-white border-2 border-[#629960]/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Shield className={`w-6 h-6 ${
            role === 'admin' ? 'text-red-600' :
            role === 'editor' ? 'text-blue-600' :
            role === 'manager' ? 'text-green-600' :
            role === 'viewer' ? 'text-yellow-600' :
            'text-gray-600'
          }`} />
          <h4 className="text-xl font-semibold text-[#1C5D15]">
            {role === 'admin' && 'Administrador'}
            {role === 'editor' && 'Editor'}
            {role === 'manager' && 'Gerente'}
            {role === 'viewer' && 'Visualizador'}
            {role === 'customer' && 'Cliente'}
          </h4>
        </div>
        
        {role !== 'admin' && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave}
                  size="sm"
                  className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button 
                  onClick={handleReset}
                  size="sm"
                  variant="secondary"
                  className="bg-[#629960] text-white hover:bg-[#1C5D15]"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restablecer
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                size="sm"
                className="bg-[#629960] text-white hover:bg-[#1C5D15]"
              >
                Editar
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {permissions.map((perm) => (
          <div 
            key={perm.id} 
            className={`p-3 rounded-lg border ${
              isPermissionChecked(perm.id)
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}
          >
            <div className="flex items-center gap-2">
              {isEditing && role !== 'admin' ? (
                <Checkbox
                  checked={isPermissionChecked(perm.id)}
                  onCheckedChange={(checked) => 
                    handlePermissionChange(perm.id, !!checked)
                  }
                />
              ) : (
                isPermissionChecked(perm.id) && '✅'
              )}
              <span className="text-sm">{perm.name}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}