import React from 'react'

export default function BottomNav({ activePage, onNavigate }) {
  return (
    <nav className="bottom-nav">
      <button
        className={activePage === 'home' ? 'active' : ''}
        onClick={() => onNavigate('home')}
      >
        Home
      </button>
      <button
        className={activePage === 'shop' ? 'active' : ''}
        onClick={() => onNavigate('shop')}
      >
        Shop
      </button>
      <button
        className={activePage === 'profile' ? 'active' : ''}
        onClick={() => onNavigate('profile')}
      >
        Profile
      </button>
    </nav>
  )
}
