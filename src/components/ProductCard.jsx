import { useState, useEffect } from 'react';
import { getProductById } from '../services/DumpyService';
import './ProductCard.css';

export default function ProductCard({
    product: propProduct,
    productId,
    id,
    product_id,
    defaultExpanded = false
}) {
    const targetId = productId || product_id || id || (propProduct ? propProduct.id : 1);
    const [fetchedProduct, setFetchedProduct] = useState(null);
    const [loading, setLoading] = useState(!propProduct);
    const [error, setError] = useState(null);

    const productData = propProduct || fetchedProduct;

    const [selectedImage, setSelectedImage] = useState('');
    const [activeTab, setActiveTab] = useState('specs');
    const [showDetails, setShowDetails] = useState(defaultExpanded);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    useEffect(() => {
        if (propProduct) {
            return;
        }

        let isMounted = true;

        getProductById(targetId)
            .then((data) => {
                if (isMounted) {
                    setFetchedProduct(data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message || 'Error al obtener producto de la API');
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [targetId, propProduct]);

    if (loading && !productData) {
        return (
            <div className="product-card-container">
                <div className="product-loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Cargando producto de la API...</p>
                </div>
            </div>
        );
    }

    if (error && !productData) {
        return (
            <div className="product-card-container">
                <div className="product-error-container">
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

    if (!productData) {
        return null;
    }

    const {
        id: prodId,
        title = '',
        description = '',
        category = '',
        price = 0,
        discountPercentage = 0,
        rating = 0,
        stock = 0,
        tags = [],
        brand = '',
        sku = '',
        weight = 0,
        dimensions = {},
        warrantyInformation = '',
        shippingInformation = '',
        availabilityStatus = 'In Stock',
        reviews = [],
        returnPolicy = '',
        minimumOrderQuantity = 1,
        meta = {},
        images = [],
        thumbnail = ''
    } = productData;

    const allImages = images && images.length > 0 ? images : [thumbnail].filter(Boolean);
    const currentImage = selectedImage || allImages[0] || thumbnail || '';

    const minQty = minimumOrderQuantity || 1;
    const maxStock = stock || 99;

    // Cálculos de descuento
    const currentPrice = Number(price || 0);
    const discount = Number(discountPercentage || 0);
    const originalPrice = discount > 0 ? (currentPrice / (1 - discount / 100)).toFixed(2) : null;
    const savings = originalPrice ? (Number(originalPrice) - currentPrice).toFixed(2) : 0;

    // Renderizar estrellas de calificación
    const renderStars = (score = 0) => {
        const fullStars = Math.floor(score);
        const hasHalfStar = score % 1 >= 0.3 && score % 1 <= 0.7;
        const roundedStars = Math.round(score);

        return (
            <div className="stars-wrapper" title={`Calificación: ${score} de 5`}>
                {[1, 2, 3, 4, 5].map((starIndex) => {
                    const isFilled = starIndex <= fullStars || (starIndex <= roundedStars && !hasHalfStar);
                    return (
                        <svg
                            key={starIndex}
                            className="star-icon"
                            fill={isFilled ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                            />
                        </svg>
                    );
                })}
            </div>
        );
    };

    const handleAddToCart = () => {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        try {
            return new Date(isoString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return isoString;
        }
    };

    return (
        <div className="product-card-container" data-product-id={prodId}>
            <article className="product-card">

                <header className="product-card-top-bar">
                    <div className="product-brand-category">
                        {brand && <span className="brand-badge">{brand}</span>}
                        <span className="category-tag">{category}</span>
                    </div>
                    {sku && <span className="sku-badge">SKU: {sku}</span>}
                </header>


                <div className="product-main-grid">

                    <div className="product-gallery-col">
                        <div className="main-image-wrapper">
                            {discount > 0 && (
                                <span className="discount-ribbon">-{discount}% OFF</span>
                            )}
                            <span className="stock-status-pill">
                                <span className="status-dot"></span>
                                {availabilityStatus || 'En stock'}
                            </span>
                            <img
                                src={currentImage}
                                alt={title}
                                className="product-main-img"
                                loading="lazy"
                            />
                        </div>


                        {allImages.length > 1 && (
                            <div className="thumbnails-row">
                                {allImages.map((imgUrl, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`thumb-btn ${currentImage === imgUrl ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(imgUrl)}
                                        title={`Ver imagen ${index + 1}`}
                                    >
                                        <img src={imgUrl} alt={`${title} preview ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>


                    <div className="product-info-col">
                        <div className="product-heading-section">
                            <h2 className="product-title" title={title}>{title}</h2>


                            <div className="product-rating-row">
                                {renderStars(rating)}
                                <span className="rating-score">{rating}</span>
                                <span className="rating-count">
                                    ({reviews?.length || 0})
                                </span>
                                <span className="stock-count-badge">
                                    {stock} disponibles
                                </span>
                            </div>


                            <div className="product-price-section">
                                <div className="price-main-line">
                                    <span className="current-price">${currentPrice.toFixed(2)}</span>
                                    {originalPrice && (
                                        <span className="original-price">${originalPrice}</span>
                                    )}
                                </div>
                                {originalPrice && (
                                    <span className="savings-label">
                                        ¡Ahorras ${savings} ({discount}% OFF)!
                                    </span>
                                )}
                            </div>
                        </div>


                        <p className="product-description" title={description}>{description}</p>


                        {tags && tags.length > 0 && (
                            <div className="product-tags-list">
                                {tags.map((tag, idx) => (
                                    <span key={idx} className="product-tag">#{tag}</span>
                                ))}
                            </div>
                        )}


                        <div className="purchase-controls">
                            <div className="quantity-row">
                                <span className="qty-label">Cantidad:</span>
                                <div className="qty-counter">
                                    <button
                                        type="button"
                                        className="qty-btn"
                                        onClick={() => setQuantity((q) => Math.max(minQty, q - 1))}
                                        disabled={quantity <= minQty}
                                        aria-label="Disminuir cantidad"
                                    >
                                        -
                                    </button>
                                    <span className="qty-value">{quantity}</span>
                                    <button
                                        type="button"
                                        className="qty-btn"
                                        onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                                        disabled={quantity >= maxStock}
                                        aria-label="Aumentar cantidad"
                                    >
                                        +
                                    </button>
                                </div>
                                {minQty > 1 && (
                                    <span className="moq-hint">(Mín: {minQty})</span>
                                )}
                            </div>

                            <div className="action-buttons">
                                <button
                                    type="button"
                                    className={`btn-add-cart ${addedToCart ? 'added-feedback' : ''}`}
                                    onClick={handleAddToCart}
                                >
                                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {addedToCart ? '¡Añadido!' : 'Añadir al Carrito'}
                                </button>

                                <button type="button" className="btn-buy-now">
                                    Comprar
                                </button>
                            </div>


                            <button
                                type="button"
                                className="btn-toggle-details"
                                onClick={() => setShowDetails(!showDetails)}
                            >
                                <span>{showDetails ? 'Ocultar especificaciones ▲' : 'Ver especificaciones y reseñas ▼'}</span>
                            </button>
                        </div>
                    </div>
                </div>


                {showDetails && (
                    <section className="product-tabs-section">
                        <nav className="tabs-header" aria-label="Detalles adicionales">
                            <button
                                type="button"
                                className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                                onClick={() => setActiveTab('specs')}
                            >
                                Especificaciones
                            </button>
                            <button
                                type="button"
                                className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                                onClick={() => setActiveTab('shipping')}
                            >
                                Garantía & Envíos
                            </button>
                            <button
                                type="button"
                                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Opiniones ({reviews?.length || 0})
                            </button>
                        </nav>

                        <div className="tab-content">

                            {activeTab === 'specs' && (
                                <div>
                                    <div className="specs-grid">
                                        <div className="spec-item">
                                            <span className="spec-title">Peso</span>
                                            <span className="spec-value">{weight} g</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-title">Dimensiones (An × Al × Prof)</span>
                                            <span className="spec-value">
                                                {dimensions?.width} × {dimensions?.height} × {dimensions?.depth} cm
                                            </span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-title">Código SKU</span>
                                            <span className="spec-value">{sku || 'N/A'}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-title">Código de Barras</span>
                                            <span className="spec-value">{meta?.barcode || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {meta && (
                                        <div className="meta-qr-section">
                                            {meta.qrCode && (
                                                <img
                                                    src={meta.qrCode}
                                                    alt="Código QR"
                                                    className="qr-preview"
                                                />
                                            )}
                                            <div className="meta-details">
                                                <strong>Identificador Digital y Trazabilidad</strong>
                                                <span>Código de barras: {meta.barcode}</span>
                                                {meta.createdAt && (
                                                    <span>Fecha: {formatDate(meta.createdAt)}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}


                            {activeTab === 'shipping' && (
                                <div className="policy-cards-grid">
                                    <div className="policy-card">
                                        <svg className="policy-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                        </svg>
                                        <div className="policy-content">
                                            <h4>Información de Envío</h4>
                                            <p>{shippingInformation || 'Envío estándar'}</p>
                                        </div>
                                    </div>

                                    <div className="policy-card">
                                        <svg className="policy-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        <div className="policy-content">
                                            <h4>Garantía</h4>
                                            <p>{warrantyInformation || 'Garantía estándar'}</p>
                                        </div>
                                    </div>

                                    <div className="policy-card">
                                        <svg className="policy-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <div className="policy-content">
                                            <h4>Política de Devolución</h4>
                                            <p>{returnPolicy || 'Términos estándar'}</p>
                                        </div>
                                    </div>

                                    <div className="policy-card">
                                        <svg className="policy-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <div className="policy-content">
                                            <h4>Pedido Mínimo</h4>
                                            <p>{minimumOrderQuantity || 1} unidad(es)</p>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {activeTab === 'reviews' && (
                                <div className="reviews-container">
                                    {reviews && reviews.length > 0 ? (
                                        reviews.map((rev, index) => (
                                            <article key={index} className="review-item">
                                                <div className="review-header">
                                                    <div className="reviewer-meta">
                                                        <div className="reviewer-avatar">
                                                            {rev.reviewerName ? rev.reviewerName.charAt(0).toUpperCase() : 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="reviewer-name">{rev.reviewerName}</div>
                                                            <div className="reviewer-email">{rev.reviewerEmail}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {renderStars(rev.rating)}
                                                        <span className="review-date">{formatDate(rev.date)}</span>
                                                    </div>
                                                </div>
                                                <p className="review-comment">"{rev.comment}"</p>
                                            </article>
                                        ))
                                    ) : (
                                        <p>No hay opiniones disponibles para este producto.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </article>
        </div>
    );
}