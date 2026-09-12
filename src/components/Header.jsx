import React from 'react'

const APP_LOGO = 'https://res.cloudinary.com/daj5cu840/image/upload/v1789185480/New_Project_8_bmwtnj_yq0qjf.png'

export default function Header({ onCart, cartCount }) {
  return (
    <header className="header">
      <img className="logo-image" src={APP_LOGO} alt="Apple Store Malaysia" />
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
