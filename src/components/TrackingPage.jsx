import React, { useEffect, useState } from 'react'
import { ORDERS_ENDPOINT } from '../constants'

export default function TrackingPage({ orderId, onBack }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(Boolean(orderId))
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch(
          `${ORDERS_ENDPOINT}/${encodeURIComponent(orderId)}`,
          { signal: controller.signal }
        )
        const result = await response.json().catch(() => null)
        if (!response.ok || result?.success === false) {
          throw new Error(result?.error || `Request failed: ${response.status}`)
        }
        setOrder(result.data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load order')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }
    if (orderId) load()
    return () => controller.abort()
  }, [orderId])

  return (
    <div className="full-page-content">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>
      <h1>Tracking</h1>
      {loading && <div className="muted">Loading order...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && (
        <div className="tracking-card">
          <strong>Order #{order?.id || orderId}</strong>
          <div className="tracking-step active">{order?.status || 'pending'}</div>
        </div>
      )}
    </div>
  )
}
