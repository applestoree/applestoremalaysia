import React, { useState } from 'react'
import { ORDERS_ENDPOINT } from '../constants'
import { getVariantValue } from '../utils'

export default function CheckoutPage({ onBack, user, items, onOrderCreated }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [address] = useState(() => ({
    name: user?.address?.name || user?.name || '',
    phone: user?.address?.phone || user?.phone || '',
    address_line_1: user?.address?.address_line_1 || '',
    address_line_2: user?.address?.address_line_2 || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postcode: user?.address?.postcode || '',
    country: user?.address?.country || 'Malaysia',
  }))
  const [shippingMethod, setShippingMethod] = useState('Delivery')
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer')
  const [voucher] = useState(null)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = 0
  const discount = Number(voucher?.discount || 0)
  const total = Math.max(0, subtotal + shippingFee - discount)

  async function placeOrder() {
    if (!items.length) return setError('Your cart is empty.')
    try {
      setLoading(true)
      setError('')
      const payload = {
        phone: address.phone || user?.phone || null,
        items: items.map((item) => ({
          item_group_id: item.product.item_group_id,
          title: item.product.title,
          quantity: item.quantity,
          price: item.price,
          color: item.color ? getVariantValue(item.color, 'color') : null,
          size: item.size ? getVariantValue(item.size, 'size') : null,
        })),
        address,
        store: { name: 'Apple Store Malaysia' },
        shipping: { method: shippingMethod },
        voucher,
        payment: { method: paymentMethod },
        subtotal,
        shipping_fee: shippingFee,
        discount,
        total,
        status: 'pending',
      }
      const response = await fetch(ORDERS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || !result?.success) throw new Error(result?.error || 'Order creation failed')
      onOrderCreated(result.data?.id)
    } catch (err) {
      setError(err.message || 'Order creation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="standalone-page">
      <header className="standalone-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h1>Checkout</h1>
      </header>
      <main className="standalone-main">
        <div className="checkout-card">
          <strong>Delivery Address</strong>
          <p>{address.name || 'Name'} · {address.address_line_1 || 'Address'} · {address.phone || 'Phone'}</p>
        </div>
        <div className="checkout-card"><strong>Store</strong><p>Apple Store Malaysia</p></div>
        <div className="checkout-card">
          <strong>Shipping</strong>
          <select value={shippingMethod} onChange={(event) => setShippingMethod(event.target.value)}>
            <option value="Delivery">Delivery</option>
            <option value="Store Pickup">Store Pickup</option>
          </select>
        </div>
        <div className="checkout-card">
          <strong>Payment</strong>
          <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="DuitNow QR">DuitNow QR</option>
          </select>
        </div>
        <div className="checkout-card">
          <strong>Items</strong>
          {items.map((item) => <p key={item.key}>{item.product.title} × {item.quantity} — RM {(item.price * item.quantity).toLocaleString('en-MY')}</p>)}
        </div>
        <div className="order-summary"><span>Total</span><strong>RM {total.toLocaleString('en-MY')}</strong></div>
        {error && <div className="error-message">{error}</div>}
      </main>
      <div className="standalone-bottom-action">
        <button className="primary-button" onClick={placeOrder} disabled={loading || !items.length}>
          {loading ? 'Creating Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}
