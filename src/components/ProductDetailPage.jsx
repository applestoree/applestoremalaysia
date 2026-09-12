import React, { useEffect, useState } from 'react'
import { PRODUCTS_ENDPOINT } from '../constants'
import { getProductPrice, getVariantValue } from '../utils'
import Header from './Header'
import BottomActionBar from './BottomActionBar'

export default function ProductDetailPage({
  itemGroupId,
  onBack,
  onAddToCart,
  onBuyNow,
  onCart,
  cartCount,
}) {
  const [product, setProduct] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(
          `${PRODUCTS_ENDPOINT}/${encodeURIComponent(itemGroupId)}`,
          { signal: controller.signal }
        )
        const result = await response.json().catch(() => null)
        if (!response.ok || result?.success === false) {
          throw new Error(result?.error || `Request failed: ${response.status}`)
        }
        const detail = result?.data || result
        setProduct(detail)
        const colors = detail?.variant_color || []
        const sizes = detail?.variant_size || []
        if (colors.length) setSelectedColor(colors[0])
        if (sizes.length) setSelectedSize(sizes[0])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load product')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }
    if (itemGroupId) load()
    return () => controller.abort()
  }, [itemGroupId])

  const price = product ? getProductPrice(product, selectedSize) : 0
  const colors = product?.variant_color || []
  const sizes = product?.variant_size || []

  const handleAddToCart = () => {
    if (!product) return
    onAddToCart?.({
      product,
      color: selectedColor,
      size: selectedSize,
      price,
    })
  }

  const handleBuyNow = () => {
    if (!product) return
    onBuyNow?.({
      product,
      color: selectedColor,
      size: selectedSize,
      price,
    })
  }

  let content = null

  if (loading) {
    content = (
      <>
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <div className="muted">Loading product...</div>
      </>
    )
  } else if (error) {
    content = (
      <>
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <div className="error-message">{error}</div>
      </>
    )
  } else if (!product) {
    content = (
      <>
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <div className="muted">Product not found.</div>
      </>
    )
  } else {
    content = (
      <>
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <div className="detail-image">
          {product?.variant_color?.[0]?.image_link ? (
            <img
              src={product.variant_color[0].image_link}
              alt={product.title || product.item_group_id || 'Product'}
            />
          ) : (
            'Product Image'
          )}
        </div>
        <h1>{product.title || product.item_group_id}</h1>
        {price > 0 && (
          <div className="price">RM {price.toLocaleString('en-MY')}</div>
        )}
        {colors.length > 0 && (
          <div className="detail-section">
            <strong>Color</strong>
            <div className="option-row">
              {colors.map((color, index) => {
                const value = getVariantValue(color, 'color')
                return (
                  <button
                    key={`${value}-${index}`}
                    className={selectedColor === color ? 'selected' : ''}
                    onClick={() => setSelectedColor(color)}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        {sizes.length > 0 && (
          <div className="detail-section">
            <strong>Storage</strong>
            <div className="option-row">
              {sizes.map((size, index) => {
                const value = getVariantValue(size, 'size')
                return (
                  <button
                    key={`${value}-${index}`}
                    className={selectedSize === size ? 'selected' : ''}
                    onClick={() => setSelectedSize(size)}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        <div className="detail-section">
          <strong>Description</strong>
          <p>{product.description || 'Product description...'}</p>
        </div>
      </>
    )
  }

  return (
    <div className="page app-shell h-full">
      <div className="h-full flex flex-col">
        <Header onCart={onCart} cartCount={cartCount} />
        <main className="main-content flex-1 overflow-y-auto">
          {content}
        </main>
        {product && !loading && !error && (
          <BottomActionBar
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}
      </div>
    </div>
  )
}
