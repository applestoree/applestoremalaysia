import React from 'react'
import Header from './Header'
import BottomActionBar from './BottomActionBar'

export default function StandalonePageLayout({
  onBack,
  title,
  onCart,
  cartCount,
  children,
  bottomAction = null,
}) {
  return (
    <div className="standalone-page">
      <Header
        onBack={onBack}
        title={title}
        onCart={onCart}
        cartCount={cartCount}
      />

      <main className="standalone-main">{children}</main>

      {bottomAction && (
        <BottomActionBar>{bottomAction}</BottomActionBar>
      )}
    </div>
  )
}
