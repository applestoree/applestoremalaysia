import React from 'react'
import { getProductPrice } from '../utils'

export default function ProductCard({ product, onProduct }) {
  const price = getProductPrice(product)
  const image = product?.variant_color?.[0]?.image_link

  return (
    <button
      className="product product-button"
      onClick={() => onProduct(product.item_group_id)}
    >
      {image ? (
        <img
          className="product-image"
          src={image}
          alt={product.title || product.item_group_id || 'Product'}
        />
      ) : (
        <div className="product-image product-image-placeholder">Product Image</div>
      )}
      <div className="product-title">{product.title || product.item_group_id || 'Product'}</div>
      <div className="product-price">
        {price > 0 ? `RM ${price.toLocaleString('en-MY')}` : 'View product'}
      </div>
    </button>
  )
}
