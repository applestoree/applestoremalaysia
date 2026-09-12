import React from 'react'
import ProductCard from './ProductCard'

export default function ProductList({ products, onProduct }) {
  if (!products.length) {
    return <div className="muted">No products available.</div>
  }

  return (
    <div className="products">
      {products.map((product) => (
        <ProductCard
          key={product.item_group_id}
          product={product}
          onProduct={onProduct}
        />
      ))}
    </div>
  )
}
