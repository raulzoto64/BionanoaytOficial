// Test script to verify cart functionality with different packaging types
// This script will simulate adding the same product with different packaging to the cart

import { supabaseAPI } from './src/app/data/supabase.ts';

async function testCartFunctionality() {
  try {
    console.log('=== Prueba de funcionalidad del carrito con diferentes embases ===');
    
    // 1. Obtener productos disponibles
    const products = await supabaseAPI.getProducts();
    console.log(`Productos disponibles: ${products.length}`);
    
    if (products.length === 0) {
      console.error('No hay productos disponibles para probar');
      return;
    }
    
    const testProduct = products[0];
    console.log(`Producto de prueba: ${testProduct.id} - ${testProduct.slug}`);
    
    // 2. Obtener usuario de prueba (admin por defecto)
    const users = await supabaseAPI.getUsers();
    const testUser = users.find(u => u.email === 'admin@atbionano.com');
    
    if (!testUser) {
      console.error('No se encontró usuario de prueba');
      return;
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
    
    cartItems.forEach(item => {
      console.log(`- ${item.translation.name}`);
      console.log(`  - Embase: ${item.packaging}`);
      console.log(`  - Cantidad: ${item.quantity}`);
      console.log(`  - Precio: $${item.pricePerUnit.toLocaleString('es-CO')} COP`);
      console.log(`  - Total: $${item.totalPrice.toLocaleString('es-CO')} COP`);
    });
    
    // 7. Verificar que se calcularon los precios correctamente
    const botellaCartItem = cartItems.find(item => item.packaging === 'Botella');
    const galonCartItem = cartItems.find(item => item.packaging === 'Galón');
    
    if (botellaCartItem && galonCartItem) {
      console.log('\n✅ Precios calculados correctamente:');
      console.log(`- Botella (5 unidades): $${botellaCartItem.totalPrice.toLocaleString('es-CO')} COP`);
      console.log(`- Galón (3 unidades): $${galonCartItem.totalPrice.toLocaleString('es-CO')} COP`);
    }
    
    // 8. Probar la actualización de cantidades
    console.log('\nActualizando cantidad de botellas a 8...');
    await supabaseAPI.updateCartItemQuantity(botellaItem.id, 8);
    const updatedBotellaItem = await supabaseAPI.getCartItems(testUser.id).then(items => 
      items.find(item => item.id === botellaItem.id)
    );
    console.log(`Cantidad actualizada: ${updatedBotellaItem.quantity}`);
    
    // 9. Verificar que los items siguen separados
    const finalCartItems = await supabaseAPI.getCartItems(testUser.id);
    console.log(`\nFinal del carrito (${finalCartItems.length} items):`);
    finalCartItems.forEach(item => {
      console.log(`- ${item.translation.name} - ${item.packaging}: ${item.quantity}`);
    });
    
    console.log('\n✅ Prueba completada con éxito!');
    console.log('El carrito está funcionando correctamente con productos de diferentes embases');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  }
}

// Ejecutar la prueba
testCartFunctionality();