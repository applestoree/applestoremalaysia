import React from 'react'
import Header from './Header'
import BottomNav from './BottomNav'

export default function AppShell({
  activePage,
  onNavigate,
  onCart,
  cartCount,
  children,
}) {
  return (
    <div className="app-shell">
      <Header onCart={onCart} cartCount={cartCount} />
      <main className="main-content">{children}</main>
      <BottomNav activePage={activePage} onNavigate={onNavigate} />
    </div>
  )
}
