import React, { useMemo } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductList from './ProductList'

export default function HomePage({ onProduct }) {
  const { products, loading, error } = useProducts()

  const flashSaleProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          String(product.custom_label_0 || '').toLowerCase() === 'flashsale'
      ),
    [products]
  )

  const recommendedProducts = useMemo(
    () => [...products].sort(() => Math.random() - 0.5).slice(0, 8),
    [products]
  )

  return (
    <section>
      <div className="hero">Apple Store Malaysia</div>
      {loading && <div className="muted">Loading products...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && (
        <>
          <div className="section-title">FlashSale</div>
          <ProductList products={flashSaleProducts} onProduct={onProduct} />
          <div className="section-title">Recommeded</div>
          <ProductList products={recommendedProducts} onProduct={onProduct} />
        </>
      )}
    </section>
  )
}
