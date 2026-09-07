import { useState, useEffect, useMemo } from 'react';
import ProductCard from './components/ProductCard';
import { getAllProducts } from './services/DumpyService';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros y Búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const handleReload = () => {
    setLoading(true);
    setError(null);
    getAllProducts(0)
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error al conectar con la API de productos');
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;

    getAllProducts(0)
      .then((data) => {
        if (isMounted) {
          setProducts(data.products || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error al obtener los productos de la API:', err);
          setError(err.message || 'Error al conectar con la API de productos');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Categorías únicas
  const categories = useMemo(() => {
    const list = products.map((p) => p.category).filter(Boolean);
    return ['all', ...Array.from(new Set(list))];
  }, [products]);

  // Filtrado y ordenamiento
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          const matchBrand = item.brand?.toLowerCase().includes(q);
          const matchCategory = item.category?.toLowerCase().includes(q);
          const matchTags = item.tags?.some((tag) => tag.toLowerCase().includes(q));

          if (!matchTitle && !matchDesc && !matchBrand && !matchCategory && !matchTags) {
            return false;
          }
        }

        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        if (onlyInStock && (item.stock <= 0 || item.availabilityStatus === 'Out of Stock')) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'discount-desc') return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        if (sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '');
        return 0;
      });
  }, [products, searchQuery, selectedCategory, onlyInStock, sortBy]);

  // Cálculos de paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, startIndex, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== safeCurrentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Generador inteligente de números de página con elipses (...)
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const left = Math.max(2, safeCurrentPage - delta);
    const right = Math.min(totalPages - 1, safeCurrentPage + delta);

    pages.push(1);

    if (left > 2) {
      pages.push('...');
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all' || sortBy !== 'default' || onlyInStock;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('default');
    setOnlyInStock(false);
    setCurrentPage(1);
  };

  return (
    <div className="app-main-layout">
      <header className="app-header">
        <h1>Catálogo de Productos</h1>
        <p>Integración con API DummyJSON, búsqueda en tiempo real, filtros y paginación</p>
      </header>

      {/* Barra de Filtros */}
      <section className="filters-toolbar-container" aria-label="Filtros de productos">
        <div className="search-input-wrapper">
          <svg className="search-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, marca, categoría o descripción..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              title="Borrar búsqueda"
              aria-label="Borrar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filters-controls-row">
          <div className="filter-group-left">
            <div className="filter-item">
              <label htmlFor="category-select" className="filter-label">Categoría:</label>
              <select
                id="category-select"
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Todas las categorías' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="sort-select" className="filter-label">Ordenar por:</label>
              <select
                id="sort-select"
                className="filter-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="default">Por defecto</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating-desc">Mejor Valorados ★</option>
                <option value="discount-desc">Mayor Descuento %</option>
                <option value="title-asc">Nombre: A - Z</option>
              </select>
            </div>

            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => {
                  setOnlyInStock(e.target.checked);
                  setCurrentPage(1);
                }}
              />
              Solo en stock
            </label>
          </div>

          <div className="filter-group-right">
            {hasActiveFilters && (
              <button
                type="button"
                className="btn-reset-filters"
                onClick={handleResetFilters}
              >
                Limpiar filtros
              </button>
            )}

            <div className="view-toggle-btns" role="group" aria-label="Cambiar vista">
              <button
                type="button"
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Vista de cuadrícula"
                aria-label="Vista de cuadrícula"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
                </svg>
              </button>
              <button
                type="button"
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Vista de lista"
                aria-label="Vista de lista"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Resumen de Resultados */}
      <div className="results-summary-bar">
        <span>
          Mostrando <strong className="results-count">{filteredProducts.length > 0 ? `${startIndex + 1} - ${endIndex}` : 0}</strong> de <strong>{filteredProducts.length}</strong> productos
          {products.length > 0 && ` (Total API: ${products.length})`}
          {searchQuery && ` para "${searchQuery}"`}
          {selectedCategory !== 'all' && ` en "${selectedCategory}"`}
        </span>
        {totalPages > 1 && (
          <span>Página <strong>{safeCurrentPage}</strong> de <strong>{totalPages}</strong></span>
        )}
      </div>

      <main className="app-content">
        {loading && (
          <div className="catalog-loading">
            <div className="loading-spinner"></div>
            <p className="catalog-loading-text">Cargando productos desde la API de DummyJSON...</p>
          </div>
        )}

        {error && !loading && (
          <div className="product-error-container">
            <svg className="error-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="error-title">Error al consultar la API</h3>
            <p className="error-message">{error}</p>
            <button type="button" className="retry-btn" onClick={handleReload}>
              Reintentar carga
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="no-results-card">
            <svg className="no-results-icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>
            <h3>No se encontraron productos</h3>
            <p>Prueba ajustando los términos de búsqueda o cambiando los filtros seleccionados.</p>
            <button type="button" className="retry-btn" onClick={handleResetFilters}>
              Restablecer filtros
            </button>
          </div>
        )}

        {/* Productos paginados */}
        {!loading && !error && paginatedProducts.length > 0 && (
          <div className={`products-container ${viewMode === 'grid' ? 'products-grid' : 'products-list'}`}>
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                defaultExpanded={viewMode === 'list'}
              />
            ))}
          </div>
        )}

        {/* Paginación Inferior */}
        {!loading && !error && totalPages > 1 && (
          <nav className="pagination-container" aria-label="Navegación de páginas">
            <div className="pagination-info">
              Mostrando del <strong>{startIndex + 1}</strong> al <strong>{endIndex}</strong> de <strong>{filteredProducts.length}</strong> productos
            </div>

            <div className="pagination-controls">
              <button
                type="button"
                className="page-btn page-nav-btn"
                onClick={() => handlePageChange(1)}
                disabled={safeCurrentPage === 1}
                title="Primera página"
                aria-label="Primera página"
              >
                «
              </button>

              <button
                type="button"
                className="page-btn page-nav-btn"
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                title="Página anterior"
                aria-label="Página anterior"
              >
                ‹
              </button>

              {getPageNumbers().map((page, idx) =>
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    className={`page-btn ${safeCurrentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                    aria-current={safeCurrentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                className="page-btn page-nav-btn"
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                title="Página siguiente"
                aria-label="Página siguiente"
              >
                ›
              </button>

              <button
                type="button"
                className="page-btn page-nav-btn"
                onClick={() => handlePageChange(totalPages)}
                disabled={safeCurrentPage === totalPages}
                title="Última página"
                aria-label="Última página"
              >
                »
              </button>
            </div>

            <div className="pagination-per-page">
              <label htmlFor="per-page-select">Por página:</label>
              <select
                id="per-page-select"
                className="per-page-select"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={18}>18</option>
                <option value={24}>24</option>
              </select>
            </div>
          </nav>
        )}
      </main>
    </div>
  );
}

export default App;
