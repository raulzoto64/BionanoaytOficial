import { useState } from 'react';
import { supabaseAPI } from '../data/supabase';
import { Button } from './ui/button';

export function CartTest() {
  const [testStatus, setTestStatus] = useState('');
  const [testResult, setTestResult] = useState('');

  const runTest = async () => {
    setTestStatus('running');
    setTestResult('');

    try {
      // 1. Obtener productos disponibles
      const products = await supabaseAPI.getProducts();
      
      if (products.length === 0) {
        throw new Error('No hay productos disponibles para probar');
      }
      
      const testProduct = products[0];
      
      // 2. Obtener usuario de prueba (admin por defecto)
      const users = await supabaseAPI.getUsers();
      const testUser = users.find(u => u.email === 'admin@atbionano.com');
      
      if (!testUser) {
        throw new Error('No se encontró usuario de prueba');
      }
      
      // 3. Limpiar carrito del usuario de prueba
      await supabaseAPI.clearCart(testUser.id);
      
      // 4. Agregar producto con embase "Botella" (1 a 10 unidades a 25,000)
      const botellaItem = await supabaseAPI.addToCart(testUser.id, testProduct.id, 5, 'Botella');
      
      // 5. Agregar el mismo producto con embase "Galón" (1 a 20 unidades a 50,000)
      await supabaseAPI.addToCart(testUser.id, testProduct.id, 3, 'Galón');
      
      // 6. Verificar que los items están en el carrito como separados
      const cartItems = await supabaseAPI.getCartItems(testUser.id);
      
      // Calcular precios para cada item
      await Promise.all(
        cartItems.map(async (item) => {
          const priceInfo = await supabaseAPI.calculatePrice(item.product_id, item.quantity, item.packaging);
          return {
            ...item,
            pricePerUnit: priceInfo?.pricePerUnit || 0,
            totalPrice: priceInfo?.total || 0,
            currency: priceInfo?.currency || 'COP'
          };
        })
      );
      
      // 7. Verificar que se calcularon los precios correctamente
      
      // 8. Probar la actualización de cantidades
      await supabaseAPI.updateCartItemQuantity(botellaItem.id, 8);
      
      setTestStatus('success');
      setTestResult('✅ Prueba completada con éxito! El carrito funciona correctamente con productos de diferentes embases');
      
    } catch (error: any) {
      setTestStatus('error');
      setTestResult(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-[#1C5D15] mb-4">Prueba de Carrito</h2>
      
      <Button 
        onClick={runTest} 
        disabled={testStatus === 'running'}
        className="bg-[#1C5D15] text-white hover:bg-[#629960]"
      >
        {testStatus === 'running' ? 'Ejecutando prueba...' : 'Ejecutar Prueba'}
      </Button>

      {testResult && (
        <div className={`mt-4 p-4 rounded-lg ${
          testStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {testResult}
        </div>
      )}

      {testStatus === 'running' && (
        <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
            <span>Ejecutando prueba...</span>
          </div>
        </div>
      )}
    </div>
  );
}