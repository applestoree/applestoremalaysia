import React from 'react'
import { getVariantValue } from '../utils'

export default function VariantBottomSheet({
  colors = [],
  sizes = [],
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  onClose,
  onConfirm,
  actionLabel = 'Continue',
}) {
  return (
    <div className="variant-sheet-backdrop" onClick={onClose}>
      <div
        className="variant-bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Select product variant"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="variant-sheet-handle" />
        <div className="variant-sheet-header">
          <strong>Select Variant</strong>
          <button type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {colors.length > 0 && (
          <section className="variant-sheet-section">
            <strong>Color</strong>
            <div className="option-row">
              {colors.map((color, index) => {
                const value = getVariantValue(color, 'color')
                return (
                  <button
                    type="button"
                    key={`${value}-${index}`}
                    className={selectedColor === color ? 'selected' : ''}
                    onClick={() => onColorChange(color)}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {sizes.length > 0 && (
          <section className="variant-sheet-section">
            <strong>Storage</strong>
            <div className="option-row">
              {sizes.map((size, index) => {
                const value = getVariantValue(size, 'size')
                return (
                  <button
                    type="button"
                    key={`${value}-${index}`}
                    className={selectedSize === size ? 'selected' : ''}
                    onClick={() => onSizeChange(size)}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        <button
          type="button"
          className="primary-button variant-sheet-confirm"
          onClick={onConfirm}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  )
}
