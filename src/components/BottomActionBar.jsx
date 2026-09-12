import React from 'react'

export default function BottomActionBar({ onAddToCart, onBuyNow, disabled = false }) {
  return (
    <div className="bottom-action-bar">
      <button
        type="button"
        className="action-button action-cart-button"
        onClick={onAddToCart}
        disabled={disabled}
      >
        Add to Cart
      </button>
      <button
        type="button"
        className="primary-button action-button action-buy-button"
        onClick={onBuyNow}
        disabled={disabled}
      >
        Buy Now
      </button>
    </div>
  )
}
