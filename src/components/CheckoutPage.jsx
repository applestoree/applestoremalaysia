import React, { useState } from 'react'
import { ORDERS_ENDPOINT } from '../constants'
import { getVariantValue } from '../utils'

export default function CheckoutPage({
  onBack,
  user,
  items,
  onOrderCreated,
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  async function placeOrder() {
    if (!items.length) return setError('Your cart is empty.')
    try {
      setLoading(true)
      setError('')
      const payload = {
        phone: user?.phone || null,
        items: items.map((item) => ({
          item_group_id: item.product.item_group_id,
          title: item.product.title,
          quantity: item.quantity,
          price: item.price,
          color: item.color ? getVariantValue(item.color, 'color') : null,
          size: item.size ? getVariantValue(item.size, 'size') : null,
        })),
        address: null,
        store: { name: 'Apple Store Malaysia' },
        shipping: { method: 'Delivery' },
        payment: { method: 'Bank Transfer' },
        subtotal,
        shipping_fee: 0,
        discount: 0,
        total: subtotal,
        status: 'pending',
      }
      const response = await fetch(ORDERS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Order creation failed')
      }
      onOrderCreated(result.data?.id)
    } catch (err) {
      setError(err.message || 'Order creation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="full-page-content">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>
      <h1>Checkout</h1>
      <div className="checkout-card">
        <strong>Delivery Address</strong>
        <p>
          {user?.name || 'Name'} · Address · {user?.phone || 'Phone'}
        </p>
      </div>
      <div className="checkout-card">
        <strong>Store</strong>
        <p>Apple Store Malaysia</p>
      </div>
      <div className="checkout-card">
        <strong>Shipping</strong>
        <p>Delivery / Store Pickup</p>
      </div>
      <div className="checkout-card">
        <strong>Payment</strong>
        <p>Bank Transfer / DuitNow QR</p>
      </div>
      <div className="checkout-card">
        <strong>Items</strong>
        {items.map((item) => (
          <p key={item.key}>
            {item.product.title} × {item.quantity} — RM{' '}
            {(item.price * item.quantity).toLocaleString('en-MY')}
          </p>
        ))}
      </div>
      <div className="order-summary">
        <span>Total</span>
        <strong>RM {subtotal.toLocaleString('en-MY')}</strong>
      </div>
      {error && <div className="error-message">{error}</div>}
      <button
        className="primary-button"
        onClick={placeOrder}
        disabled={loading || !items.length}
      >
        {loading ? 'Creating Order...' : 'Place Order'}
      </button>
    </div>
  )
}
