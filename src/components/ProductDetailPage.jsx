import React, { useEffect, useState } from 'react'
import { PRODUCTS_ENDPOINT } from '../constants'
import { getProductPrice, getVariantValue } from '../utils'
import Header from './Header'
import BottomActionBar from './BottomActionBar'
import VariantBottomSheet from './VariantBottomSheet'

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
  const [variantSheetOpen, setVariantSheetOpen] = useState(false)
  const [variantAction, setVariantAction] = useState(null)

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
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    if (itemGroupId) load()
    return () => controller.abort()
  }, [itemGroupId])

  const price = product ? getProductPrice(product, selectedSize) : 0
  const colors = product?.variant_color || []
  const sizes = product?.variant_size || []

  const openVariantSheet = (action) => {
    setVariantAction(action)
    setVariantSheetOpen(true)
  }

  const closeVariantSheet = () => {
    setVariantSheetOpen(false)
    setVariantAction(null)
  }

  const confirmVariant = () => {
    if (!product) return

    const item = {
      product,
      color: selectedColor,
      size: selectedSize,
      price,
    }

    closeVariantSheet()

    if (variantAction === 'buy') {
      onBuyNow?.(item)
      return
    }

    onAddToCart?.(item)
  }

  let mainContent = null

  if (loading) {
    mainContent = <div className="muted">Loading product...</div>
  } else if (error) {
    mainContent = <div className="error-message">{error}</div>
  } else if (!product) {
    mainContent = <div className="muted">Product not found.</div>
  } else {
    mainContent = (
      <>
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

        <div className="detail-section">
          <strong>Selected Variant</strong>
          <div className="muted">
            {selectedColor ? getVariantValue(selectedColor, 'color') : '—'}
            {selectedSize ? ` · ${getVariantValue(selectedSize, 'size')}` : ''}
          </div>
        </div>

        <div className="detail-section">
          <strong>Description</strong>
          <p>{product.description || 'Product description...'}</p>
        </div>
      </>
    )
  }

  return (
    <div className="page standalone-page">
      <div className="standalone-page-layout">
        <header className="standalone-header">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <Header onCart={onCart} cartCount={cartCount} />
        </header>

        <main className="standalone-main">
          {mainContent}
        </main>

        {product && !loading && !error && (
          <div className="standalone-bottom-action">
            <BottomActionBar
              onAddToCart={() => openVariantSheet('cart')}
              onBuyNow={() => openVariantSheet('buy')}
            />
          </div>
        )}
      </div>

      {variantSheetOpen && (
        <VariantBottomSheet
          colors={colors}
          sizes={sizes}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onColorChange={setSelectedColor}
          onSizeChange={setSelectedSize}
          onClose={closeVariantSheet}
          onConfirm={confirmVariant}
          actionLabel={variantAction === 'buy' ? 'Buy Now' : 'Add to Cart'}
        />
      )}
    </div>
  )
}
