// ==========================================
// DATABASE MANAGER - Sistema de gestión de BD con Supabase
// ==========================================

import { supabaseAPI } from './supabase';
import {
  User,
  Product,
  ProductTranslation,
  PriceByQuantity,
  Category,
  CategoryTranslation,
  Page,
  PageContent,
  SiteSettings,
  Translation,
} from './supabase';

// ==========================================
// GETTERS CON SUPABASE
// ==========================================

export class DatabaseManager {
  // Usuarios
  static async getUsers(): Promise<User[]> {
    return await supabaseAPI.getUsers();
  }

  static async saveUsers(users: User[]): Promise<void> {
    // Implementar lógica para guardar usuarios en Supabase
    console.warn('Save users not implemented');
  }

  // Productos
  static async getProducts(): Promise<Product[]> {
    return await supabaseAPI.getProducts();
  }

  static async saveProducts(products: Product[]): Promise<void> {
    // Implementar lógica para guardar productos en Supabase
    console.warn('Save products not implemented');
  }

  // Categorías
  static async getCategories(): Promise<Category[]> {
    return await supabaseAPI.getCategories();
  }

  static async saveCategories(categories: Category[]): Promise<void> {
    // Implementar lógica para guardar categorías en Supabase
    console.warn('Save categories not implemented');
  }

  // Traducciones de categorías
  static async getCategoryTranslations(): Promise<CategoryTranslation[]> {
    const categories = await supabaseAPI.getCategories();
    const translations = [];
    for (const category of categories) {
      const esTranslation = await supabaseAPI.getCategoryTranslation(category.id, 'es');
      const enTranslation = await supabaseAPI.getCategoryTranslation(category.id, 'en');
      if (esTranslation) translations.push(esTranslation);
      if (enTranslation) translations.push(enTranslation);
    }
    return translations;
  }

  static async saveCategoryTranslations(translations: CategoryTranslation[]): Promise<void> {
    // Implementar lógica para guardar traducciones de categorías
    console.warn('Save category translations not implemented');
  }

  // Páginas
  static async getPages(): Promise<Page[]> {
    return await supabaseAPI.getAllPages();
  }

  static async savePages(pages: Page[]): Promise<void> {
    // Implementar lógica para guardar páginas en Supabase
    console.warn('Save pages not implemented');
  }

  // Contenido de páginas
  static async getPageContents(): Promise<PageContent[]> {
    const pages = await supabaseAPI.getAllPages();
    const contents = [];
    for (const page of pages) {
      const esContent = await supabaseAPI.getPageContent(page.id, 'es');
      const enContent = await supabaseAPI.getPageContent(page.id, 'en');
      if (esContent) contents.push(esContent);
      if (enContent) contents.push(enContent);
    }
    return contents;
  }

  static async savePageContents(contents: PageContent[]): Promise<void> {
    // Implementar lógica para guardar contenido de páginas
    console.warn('Save page contents not implemented');
  }

  // Settings
  static async getSiteSettings(): Promise<SiteSettings> {
    return await supabaseAPI.getSiteSettings();
  }

  static async saveSiteSettings(settings: SiteSettings): Promise<void> {
    await supabaseAPI.updateSiteSettings(settings);
  }

  // Traducciones
  static async getTranslations(): Promise<Translation[]> {
    return await supabaseAPI.getTranslations();
  }

  static async saveTranslations(translations: Translation[]): Promise<void> {
    // Implementar lógica para guardar traducciones generales
    console.warn('Save translations not implemented');
  }

  // Precios
  static async getPrices(): Promise<PriceByQuantity[]> {
    const products = await supabaseAPI.getProducts();
    const prices = [];
    for (const product of products) {
      const productPrices = await supabaseAPI.getPricesByProduct(product.id);
      prices.push(...productPrices);
    }
    return prices;
  }

  static async getProductTranslations(): Promise<ProductTranslation[]> {
    const products = await supabaseAPI.getProducts();
    const translations = [];
    for (const product of products) {
      const esTranslation = await supabaseAPI.getProductTranslation(product.id, 'es');
      const enTranslation = await supabaseAPI.getProductTranslation(product.id, 'en');
      if (esTranslation) translations.push(esTranslation);
      if (enTranslation) translations.push(enTranslation);
    }
    return translations;
  }
}
