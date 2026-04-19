/**
 * Configuración central de la API para BionanoAYT
 */

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
  console.log(`🌐 [FETCH] Llamando a: ${response.url} | Status: ${response.status}`);
    if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Loguear todo el cuerpo del error para diagnóstico profundo
    console.error(`❌ [API-ERROR] en ${response.url}:`, {
      status: response.status,
      message: errorData.message || errorData.error || 'Error desconocido',
      details: errorData
    });
    
    throw new Error(errorData.message || errorData.error || `Error del servidor: ${response.status}`);
  }
  return response.json();
};
