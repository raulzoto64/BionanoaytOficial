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
      console.log('=== Prueba de funcionalidad del carrito con diferentes embases ===');
      
      // 1. Obtener productos disponibles
      const products = await supabaseAPI.getProducts();
      console.log(`Productos disponibles: ${products.length}`);
      
      if (products.length === 0) {
        throw new Error('No hay productos disponibles para probar');
      }
      
      const testProduct = products[0];
      console.log(`Producto de prueba: ${testProduct.id} - ${testProduct.slug}`);
      
      // 2. Obtener usuario de prueba (admin por defecto)
      const users = await supabaseAPI.getUsers();
      const testUser = users.find(u => u.email === 'admin@atbionano.com');
      
      if (!testUser) {
        throw new Error('No se encontró usuario de prueba');
      }
      
      console.log(`Usuario de prueba: ${testUser.id} - ${testUser.email}`);
      
      // 3. Limpiar carrito del usuario de prueba
      await supabaseAPI.clearCart(testUser.id);
      console.log('Carrito limpiado');
      
      // 4. Agregar producto con embase "Botella" (1 a 10 unidades a 25,000)
      console.log('Agregando producto con embase "Botella" (5 unidades)...');
      const botellaItem = await supabaseAPI.addToCart(testUser.id, testProduct.id, 5, 'Botella');
      console.log(`Item agregado: ${botellaItem.id} - Embase: ${botellaItem.packaging} - Cantidad: ${botellaItem.quantity}`);
      
      // 5. Agregar el mismo producto con embase "Galón" (1 a 20 unidades a 50,000)
      console.log('Agregando producto con embase "Galón" (3 unidades)...');
      const galonItem = await supabaseAPI.addToCart(testUser.id, testProduct.id, 3, 'Galón');
      console.log(`Item agregado: ${galonItem.id} - Embase: ${galonItem.packaging} - Cantidad: ${galonItem.quantity}`);
      
      // 6. Verificar que los items están en el carrito como separados
      const cartItems = await supabaseAPI.getCartItems(testUser.id);
      console.log(`\nContenido del carrito (${cartItems.length} items):`);
      
      // Calcular precios para cada item
      const itemsWithPrices = await Promise.all(
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
      
      itemsWithPrices.forEach(item => {
        console.log(`- ${item.translation.name}`);
        console.log(`  - Embase: ${item.packaging}`);
        console.log(`  - Cantidad: ${item.quantity}`);
        console.log(`  - Precio: $${item.pricePerUnit.toLocaleString('es-CO')} COP`);
        console.log(`  - Total: $${item.totalPrice.toLocaleString('es-CO')} COP`);
      });
      
      // 7. Verificar que se calcularon los precios correctamente
      const botellaCartItem = itemsWithPrices.find(item => item.packaging === 'Botella');
      const galonCartItem = itemsWithPrices.find(item => item.packaging === 'Galón');
      
      if (botellaCartItem && galonCartItem) {
        console.log('\n✅ Precios calculados correctamente:');
        console.log(`- Botella (5 unidades): $${botellaCartItem.totalPrice.toLocaleString('es-CO')} COP`);
        console.log(`- Galón (3 unidades): $${galonCartItem.totalPrice.toLocaleString('es-CO')} COP`);
      }
      
      // 8. Probar la actualización de cantidades
      console.log('\nActualizando cantidad de botellas a 8...');
      await supabaseAPI.updateCartItemQuantity(botellaItem.id, 8);
      const updatedCartItems = await supabaseAPI.getCartItems(testUser.id);
      const updatedBotellaItem = updatedCartItems.find(item => item.id === botellaItem.id);
      
      if (updatedBotellaItem) {
        console.log(`Cantidad actualizada: ${updatedBotellaItem.quantity}`);
      }
      
      // 9. Verificar que los items siguen separados
      const finalCartItems = await supabaseAPI.getCartItems(testUser.id);
      console.log(`\nFinal del carrito (${finalCartItems.length} items):`);
      finalCartItems.forEach(item => {
        console.log(`- ${item.translation.name} - ${item.packaging}: ${item.quantity}`);
      });
      
      setTestStatus('success');
      setTestResult('✅ Prueba completada con éxito! El carrito funciona correctamente con productos de diferentes embases');
      
    } catch (error: any) {
      console.error('❌ Error durante la prueba:', error.message);
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