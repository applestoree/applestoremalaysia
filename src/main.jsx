import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

function SplashPage() {
  return (
    <div className="splash-page">
      <div className="apple-mark"></div>
      <div className="splash-title">Apple Store Malaysia</div>
    </div>
  )
}

function Header({ onCart }) {
  return (
    <header className="header">
      <div className="logo">Apple Store Malaysia</div>
      <div className="header-actions">
        <button className="icon-button" aria-label="Notifications">♡</button>
        <button className="icon-button" aria-label="Cart" onClick={onCart}>Cart</button>
      </div>
    </header>
  )
}

function HomePage() {
  return (
    <section>
      <div className="search">Search products</div>
      <div className="hero">Apple Store Malaysia</div>
      <div className="section-title">Categories</div>
      <div className="categories">
        <button>iPhone</button>
        <button>Mac</button>
        <button>iPad</button>
        <button>Watch</button>
      </div>
      <div className="section-title">Recommended Products</div>
      <div className="products">
        <div className="product">iPhone</div>
        <div className="product">Mac</div>
        <div className="product">iPad</div>
      </div>
    </section>
  )
}

function ShopPage({ onProduct }) {
  return (
    <section>
      <div className="search">Search products</div>
      <div className="filters">
        <button>iPhone</button>
        <button>Mac</button>
        <button>iPad</button>
        <button>Watch</button>
      </div>
      <div className="products catalog-products">
        <button className="product product-button" onClick={onProduct}>iPhone</button>
        <button className="product product-button" onClick={onProduct}>Mac</button>
        <button className="product product-button" onClick={onProduct}>iPad</button>
        <button className="product product-button" onClick={onProduct}>Apple Watch</button>
      </div>
    </section>
  )
}

function ProfilePage() {
  const [authView, setAuthView] = useState('login')
  const [authenticated, setAuthenticated] = useState(false)

  if (authenticated) {
    return (
      <div className="account-view">
        <div className="account-header">
          <div className="avatar">A</div>
          <div>
            <strong>Account</strong>
            <div className="muted">Apple Store customer</div>
          </div>
        </div>
        <button className="account-item">Personal Information <span>›</span></button>
        <button className="account-item">My Orders <span>›</span></button>
        <button className="account-item">Wishlist <span>›</span></button>
        <button className="account-item">Settings <span>›</span></button>
        <button className="logout-button" onClick={() => setAuthenticated(false)}>Logout</button>
      </div>
    )
  }

  if (authView === 'register') {
    return (
      <div className="auth-view">
        <h1>Register</h1>
        <input placeholder="Full name" />
        <input placeholder="Phone" />
        <input placeholder="Password" type="password" />
        <button className="primary-button" onClick={() => setAuthenticated(true)}>Register</button>
        <button className="link-button" onClick={() => setAuthView('login')}>Already have an account? Login</button>
      </div>
    )
  }

  return (
    <div className="auth-view">
      <h1>Login</h1>
      <input placeholder="Phone" />
      <input placeholder="Password" type="password" />
      <button className="primary-button" onClick={() => setAuthenticated(true)}>Login</button>
      <button className="link-button" onClick={() => setAuthView('register')}>Create account</button>
    </div>
  )
}

function ProductDetailPage({ onBack }) {
  return (
    <div className="full-page-content">
      <button className="back-button" onClick={onBack}>← Back</button>
      <div className="detail-image">Product Image</div>
      <h1>iPhone</h1>
      <div className="price">RM 2,999</div>
      <div className="detail-section"><strong>Color</strong><div className="option-row"><button>Black</button><button>White</button><button>Pink</button></div></div>
      <div className="detail-section"><strong>Storage</strong><div className="option-row"><button>256GB</button><button>512GB</button></div></div>
      <div className="detail-section"><strong>Description</strong><p>Product description...</p></div>
      <div className="detail-actions"><button>Add to Cart</button><button className="primary-button">Buy Now</button></div>
    </div>
  )
}

function CheckoutPage({ onBack }) {
  return (
    <div className="full-page-content">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h1>Checkout</h1>
      <div className="checkout-card"><strong>Delivery Address</strong><p>Name · Address · Phone</p></div>
      <div className="checkout-card"><strong>Store</strong><p>Apple Store Malaysia</p></div>
      <div className="checkout-card"><strong>Shipping</strong><p>Delivery / Store Pickup</p></div>
      <div className="checkout-card"><strong>Payment</strong><p>Bank Transfer / DuitNow QR</p></div>
      <div className="order-summary"><span>Total</span><strong>RM 2,999</strong></div>
      <button className="primary-button">Place Order</button>
    </div>
  )
}

function TrackingPage({ onBack }) {
  return (
    <div className="full-page-content">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h1>Tracking</h1>
      <div className="tracking-card"><strong>Order Status</strong><div className="tracking-step active">Order confirmed</div><div className="tracking-step">Processing</div><div className="tracking-step">Delivered</div></div>
    </div>
  )
}

function CartDrawer({ onClose }) {
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header"><strong>Cart</strong><button onClick={onClose}>×</button></div>
        <div className="cart-item"><div className="cart-image">IMG</div><div><strong>iPhone</strong><div>RM 2,999</div></div></div>
        <div className="order-summary"><span>Subtotal</span><strong>RM 2,999</strong></div>
        <button className="primary-button">Proceed Checkout</button>
      </aside>
    </div>
  )
}

function Overlay({ cartOpen, onCloseCart }) {
  return cartOpen ? <CartDrawer onClose={onCloseCart} /> : null
}

function BottomNav({ activePage, onNavigate }) {
  return (
    <nav className="bottom-nav">
      <button className={activePage === 'home' ? 'active' : ''} onClick={() => onNavigate('home')}>HomeNav</button>
      <button className={activePage === 'shop' ? 'active' : ''} onClick={() => onNavigate('shop')}>ShopNav</button>
      <button className={activePage === 'profile' ? 'active' : ''} onClick={() => onNavigate('profile')}>ProfileNav</button>
    </nav>
  )
}

function AppShell({ activePage, onNavigate, onCart, onProduct }) {
  const content = {
    home: <HomePage />,
    shop: <ShopPage onProduct={onProduct} />,
    profile: <ProfilePage />,
  }[activePage]

  return (
    <div className="app-shell">
      <Header onCart={onCart} />
      <main className="content">{content}</main>
      <BottomNav activePage={activePage} onNavigate={onNavigate} />
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState('home')
  const [fullPage, setFullPage] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)

  if (fullPage === 'product') return <div className="app"><ProductDetailPage onBack={() => setFullPage(null)} /></div>
  if (fullPage === 'checkout') return <div className="app"><CheckoutPage onBack={() => setFullPage(null)} /></div>
  if (fullPage === 'tracking') return <div className="app"><TrackingPage onBack={() => setFullPage(null)} /></div>

  return (
    <div className="app">
      <AppShell activePage={activePage} onNavigate={setActivePage} onCart={() => setCartOpen(true)} onProduct={() => setFullPage('product')} />
      <Overlay cartOpen={cartOpen} onCloseCart={() => setCartOpen(false)} />
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
