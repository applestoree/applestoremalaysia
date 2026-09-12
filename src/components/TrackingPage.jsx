import React, { useEffect, useState } from 'react'
import { ORDERS_ENDPOINT } from '../constants'
import StandalonePageLayout from './StandalonePageLayout'

export default function TrackingPage({ orderId, onBack }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(Boolean(orderId))
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch(`${ORDERS_ENDPOINT}/${encodeURIComponent(orderId)}`, { signal: controller.signal })
        const result = await response.json().catch(() => null)
        if (!response.ok || result?.success === false) throw new Error(result?.error || `Request failed: ${response.status}`)
        setOrder(result.data)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Failed to load order')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    if (orderId) load()
    return () => controller.abort()
  }, [orderId])

  const items = order?.items || []

  return (
    <StandalonePageLayout onBack={onBack} header={<h1>Order Tracking</h1>}>
      {loading && <div className="muted">Loading order...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && (
        <>
          <div className="tracking-card">
            <strong>Order #{order?.id || orderId}</strong>
            <div className="tracking-step active">{order?.status || 'pending'}</div>
          </div>
          <div className="tracking-card">
            <strong>Order Status</strong>
            <div className="tracking-step active">{order?.status || 'pending'}</div>
          </div>
          <div className="tracking-card">
            <strong>Order Items</strong>
            {items.map((item, index) => (
              <p key={`${item.item_group_id || 'item'}-${index}`}>
                {item.title} × {item.quantity} — RM {Number(item.price || 0).toLocaleString('en-MY')}
              </p>
            ))}
          </div>
          {order?.shipping && <div className="tracking-card"><strong>Shipping</strong><p>{order.shipping.method || '—'}</p></div>}
          {order?.payment && <div className="tracking-card"><strong>Payment</strong><p>{order.payment.method || '—'}</p></div>}
          <div className="order-summary"><span>Total</span><strong>RM {Number(order?.total || 0).toLocaleString('en-MY')}</strong></div>
        </>
      )}
    </StandalonePageLayout>
  )
}
