/**
 * Configuración central de la API para BionanoAYT
 */

// Configuración de la API (Activa: Producción)
// Para usar local, asegúrate de que tu servidor Apache esté corriendo y la URL sea correcta.
// export const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost/bionano-api' : 'https://api.bionano-ayt.com/api';

export const API_BASE_URL = 'https://api.bionano-ayt.com/api';

/**
 * Obtiene los headers por defecto para las peticiones API,
 * incluyendo el token de autorización si existe.
 */
export const getApiHeaders = () => {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Helper para manejar errores de respuesta fetch
 */
export const handleApiResponse = async (response: Response) => {
  const text = await response.text();
  
  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = JSON.parse(text);
    } catch (e) {}
    
    throw new Error(errorData.message || errorData.error || `Error del servidor: ${response.status}`);
  }
  
  if (!text) return null; // Respuesta exitosa, pero vacía.
  
  try {
    return JSON.parse(text);
  } catch (e) {
    return text; // Es texto plano, lo devolvemos tal cual.
  }
};
