// Tipos de roles con permisos
export type Role = 'admin' | 'editor' | 'manager' | 'viewer' | 'customer';

// Definir permisos específicos para cada sección funcional
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'users' | 'products' | 'content' | 'blog' | 'settings' | 'reports';
}

export const permissions: Permission[] = [
  // Permisos de Usuarios
  { id: 'users.view', name: 'Ver Usuarios', description: 'Ver lista de usuarios', category: 'users' },
  { id: 'users.create', name: 'Crear Usuarios', description: 'Crear nuevos usuarios', category: 'users' },
  { id: 'users.edit', name: 'Editar Usuarios', description: 'Editar información de usuarios', category: 'users' },
  { id: 'users.delete', name: 'Eliminar Usuarios', description: 'Eliminar usuarios', category: 'users' },
  { id: 'users.roles', name: 'Gestionar Roles', description: 'Editar roles y permisos', category: 'users' },

  // Permisos de Productos
  { id: 'products.view', name: 'Ver Productos', description: 'Ver lista de productos', category: 'products' },
  { id: 'products.create', name: 'Crear Productos', description: 'Crear nuevos productos', category: 'products' },
  { id: 'products.edit', name: 'Editar Productos', description: 'Editar información de productos', category: 'products' },
  { id: 'products.delete', name: 'Eliminar Productos', description: 'Eliminar productos', category: 'products' },
  { id: 'products.prices', name: 'Gestionar Precios', description: 'Editar precios de productos', category: 'products' },

  // Permisos de Categorías
  { id: 'categories.view', name: 'Ver Categorías', description: 'Ver lista de categorías', category: 'products' },
  { id: 'categories.create', name: 'Crear Categorías', description: 'Crear nuevas categorías', category: 'products' },
  { id: 'categories.edit', name: 'Editar Categorías', description: 'Editar información de categorías', category: 'products' },
  { id: 'categories.delete', name: 'Eliminar Categorías', description: 'Eliminar categorías', category: 'products' },

  // Permisos de Contenido CMS
  { id: 'content.view', name: 'Ver Contenido', description: 'Ver contenido de páginas', category: 'content' },
  { id: 'content.edit', name: 'Editar Contenido', description: 'Editar contenido de páginas', category: 'content' },
  { id: 'content.publish', name: 'Publicar Contenido', description: 'Publicar y despublicar contenido', category: 'content' },

  // Permisos de Blog
  { id: 'blog.posts.view', name: 'Ver Artículos', description: 'Ver lista de artículos', category: 'blog' },
  { id: 'blog.posts.create', name: 'Crear Artículos', description: 'Crear nuevos artículos', category: 'blog' },
  { id: 'blog.posts.edit', name: 'Editar Artículos', description: 'Editar información de artículos', category: 'blog' },
  { id: 'blog.posts.delete', name: 'Eliminar Artículos', description: 'Eliminar artículos', category: 'blog' },
  { id: 'blog.posts.publish', name: 'Publicar Artículos', description: 'Publicar y despublicar artículos', category: 'blog' },
  { id: 'blog.categories.view', name: 'Ver Categorías', description: 'Ver lista de categorías del blog', category: 'blog' },
  { id: 'blog.categories.create', name: 'Crear Categorías', description: 'Crear nuevas categorías del blog', category: 'blog' },
  { id: 'blog.categories.edit', name: 'Editar Categorías', description: 'Editar información de categorías', category: 'blog' },
  { id: 'blog.categories.delete', name: 'Eliminar Categorías', description: 'Eliminar categorías del blog', category: 'blog' },

  // Permisos de Traducciones
  { id: 'translations.view', name: 'Ver Traducciones', description: 'Ver lista de traducciones', category: 'content' },
  { id: 'translations.edit', name: 'Editar Traducciones', description: 'Editar traducciones', category: 'content' },

  // Permisos de Configuración
  { id: 'settings.view', name: 'Ver Configuración', description: 'Ver configuración del sistema', category: 'settings' },
  { id: 'settings.edit', name: 'Editar Configuración', description: 'Editar configuración del sistema', category: 'settings' },

  // Permisos de Reportes
  { id: 'reports.view', name: 'Ver Reportes', description: 'Ver reportes y estadísticas', category: 'reports' },
  { id: 'reports.export', name: 'Exportar Reportes', description: 'Exportar reportes a Excel/PDF', category: 'reports' },
];

// Permisos iniciales por rol
export const initialRolePermissions: Record<Role, string[]> = {
  admin: permissions.map(p => p.id), // Admin tiene todos los permisos
  editor: [
    'content.view', 'content.edit', 'content.publish',
    'blog.posts.view', 'blog.posts.create', 'blog.posts.edit', 'blog.posts.publish',
    'blog.categories.view', 'blog.categories.create', 'blog.categories.edit',
    'translations.view', 'translations.edit'
  ],
  manager: [
    'users.view',
    'products.view', 'products.create', 'products.edit', 'products.prices',
    'categories.view', 'categories.create', 'categories.edit',
    'content.view', 'content.publish',
    'blog.posts.view', 'blog.posts.publish',
    'reports.view', 'reports.export'
  ],
  viewer: [
    'users.view',
    'products.view',
    'categories.view',
    'content.view',
    'blog.posts.view',
    'blog.categories.view',
    'translations.view',
    'settings.view',
    'reports.view'
  ],
  customer: [] // Clientes no tienen permisos en el admin
};

// Estado global de permisos por rol (se cargaría desde la base de datos en producción)
let rolePermissions: Record<Role, string[]> = JSON.parse(JSON.stringify(initialRolePermissions));

// Funciones para gestionar permisos
export const getPermissionsForRole = (role: Role): string[] => {
  return rolePermissions[role] || [];
};

export const setPermissionsForRole = (role: Role, permissions: string[]): void => {
  rolePermissions[role] = permissions;
  // Aquí se guardaría en la base de datos
  localStorage.setItem('rolePermissions', JSON.stringify(rolePermissions));
};

export const hasPermission = (role: Role, permission: string): boolean => {
  return rolePermissions[role].includes(permission);
};

export const addPermissionToRole = (role: Role, permission: string): void => {
  if (!rolePermissions[role].includes(permission)) {
    rolePermissions[role].push(permission);
    localStorage.setItem('rolePermissions', JSON.stringify(rolePermissions));
  }
};

export const removePermissionFromRole = (role: Role, permission: string): void => {
  rolePermissions[role] = rolePermissions[role].filter(p => p !== permission);
  localStorage.setItem('rolePermissions', JSON.stringify(rolePermissions));
};

// Cargar permisos desde localStorage al inicializar
const savedPermissions = localStorage.getItem('rolePermissions');
if (savedPermissions) {
  rolePermissions = JSON.parse(savedPermissions);
}

// Función para restablecer permisos a valores iniciales
export const resetRolePermissions = (): void => {
  rolePermissions = JSON.parse(JSON.stringify(initialRolePermissions));
  localStorage.setItem('rolePermissions', JSON.stringify(rolePermissions));
};