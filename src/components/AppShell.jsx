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
    <div className="page app-shell h-full">
      <div className="h-full flex flex-col">
        <Header onCart={onCart} cartCount={cartCount} />
        <main className="main-content flex-1 overflow-y-auto">{children}</main>
        <BottomNav activePage={activePage} onNavigate={onNavigate} />
      </div>
    </div>
  )
}

export { AppShell as Page }
