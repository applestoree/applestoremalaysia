import React from 'react'

const APP_LOGO = 'https://res.cloudinary.com/daj5cu840/image/upload/v1789185480/New_Project_8_bmwtnj_yq0qjf.png'

export default function Header({ onBack, title, onCart, cartCount }) {
  return (
    <header className="header">
      <div className="header-left">
        {onBack && (
          <button type="button" className="back-button" onClick={onBack} aria-label="Back">
            ←
          </button>
        )}
      </div>

      <div className="header-center">
        {title ? <h1>{title}</h1> : <img className="logo-image" src={APP_LOGO} alt="Apple Store Malaysia" />}
      </div>

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
