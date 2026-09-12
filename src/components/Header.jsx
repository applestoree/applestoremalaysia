import React from 'react'

const APP_LOGO = 'https://res.cloudinary.com/daj5cu840/image/upload/v1789185480/New_Project_8_bmwtnj_yq0qjf.png'

export default function Header({ onBack, title, onCart, cartCount }) {
  return (
    <header className="header">
      {onBack && (
        <button type="button" className="back-button" onClick={onBack}>
          ← Back
        </button>
      )}
      {title && <h1>{title}</h1>}
      <img className="logo-image" src={APP_LOGO} alt="Apple Store Malaysia" />
      <div className="header-actions">
        <button type="button" className="icon-button" aria-label="Notifications">
          ♡
        </button>
        <button type="button" className="icon-button" aria-label="Cart" onClick={onCart}>
          Cart{cartCount ? ` (${cartCount})` : ''}
        </button>
      </div>
    </header>
  )
}
