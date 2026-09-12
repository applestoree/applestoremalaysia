import React from 'react'
import { getVariantValue } from '../utils'

export default function CartDrawer({ items, onClose, onCheckout, onRemove }) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <strong>Cart</strong>
          <button onClick={onClose}>×</button>
        </div>
        {!items.length ? (
          <div className="muted">Your cart is empty.</div>
        ) : (
          <>
            {items.map((item) => (
              <div className="cart-item" key={item.key}>
                <div className="cart-image">IMG</div>
                <div className="cart-item-info">
                  <strong>{item.product.title}</strong>
                  <div>
                    {item.size ? getVariantValue(item.size, 'size') : ''}
                    {item.color ? ` · ${getVariantValue(item.color, 'color')}` : ''}
                  </div>
                  <div>
                    RM {item.price.toLocaleString('en-MY')} × {item.quantity}
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => onRemove(item.key)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="order-summary">
              <span>Subtotal</span>
              <strong>RM {subtotal.toLocaleString('en-MY')}</strong>
            </div>
            <button className="primary-button" onClick={onCheckout}>
              Proceed Checkout
            </button>
          </>
        )}
      </aside>
    </div>
  )
}
