import React from 'react'

export default function Header({ onCart, cartCount }) {
  return (
    <header className="header">
      <div className="logo">Apple Store Malaysia</div>
      <div className="header-actions">
        <button className="icon-button" aria-label="Notifications">
          ♡
        </button>
        <button className="icon-button" aria-label="Cart" onClick={onCart}>
          Cart{cartCount ? ` (${cartCount})` : ''}
        </button>
      </div>
    </header>
  )
}
