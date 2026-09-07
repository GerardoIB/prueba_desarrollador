const BASE_URL = 'https://dummyjson.com/products';

/**
 * Obtiene la lista de productos desde la API de DummyJSON.
 * Usar limit=0 obtiene la totalidad de productos (194) para filtrado y paginación en el cliente.
 * @param {number} [limit=0] - Límite de productos (0 para todos)
 * @param {number} [skip=0] - Cantidad de productos a omitir
 * @returns {Promise<Object>} { products, total, skip, limit }
 */
export async function getAllProducts(limit = 0, skip = 0) {
  const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
  if (!response.ok) {
    throw new Error(`Error al obtener lista de productos: Código ${response.status} (${response.statusText})`);
  }
  return await response.json();
}

/**
 * Realiza una búsqueda por query directamente en la API de DummyJSON
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Object>} Resultados encontrados
 */
export async function searchProducts(query = '') {
  const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(`Error en la búsqueda: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Obtiene un producto individual por su ID
 * @param {number|string} id - ID del producto
 * @returns {Promise<Object>} Datos del producto
 */
export async function getProductById(id = 1) {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Error en la llamada a la API: Código ${response.status} (${response.statusText})`);
  }
  return await response.json();
}

/**
 * Obtiene el listado de categorías disponibles en la API
 * @returns {Promise<Array>} Lista de categorías
 */
export async function getCategories() {
  const response = await fetch(`${BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error(`Error al obtener categorías: ${response.statusText}`);
  }
  return await response.json();
}

export default {
  getAllProducts,
  searchProducts,
  getProductById,
  getCategories,
};