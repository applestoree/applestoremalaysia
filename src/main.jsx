import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

function HomeView() {
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

function CatalogView() {
  return (
    <section>
      <div className="search">Search products</div>
      <div className="filters">
        <button>All</button>
        <button>iPhone</button>
        <button>Mac</button>
        <button>iPad</button>
      </div>
      <div className="products catalog-products">
        <div className="product">iPhone</div>
        <div className="product">Mac</div>
        <div className="product">iPad</div>
        <div className="product">Apple Watch</div>
      </div>
    </section>
  )
}

function LoginView({ onLogin, onRegister }) {
  return (
    <div className="auth-view">
      <h1>Login</h1>
      <input placeholder="Email or phone" />
      <input placeholder="Password" type="password" />
      <button className="primary-button" onClick={onLogin}>Login</button>
      <button className="link-button" onClick={onRegister}>Create account</button>
    </div>
  )
}

function RegisterView({ onRegister, onLogin }) {
  return (
    <div className="auth-view">
      <h1>Register</h1>
      <input placeholder="Full name" />
      <input placeholder="Email or phone" />
      <input placeholder="Password" type="password" />
      <button className="primary-button" onClick={onRegister}>Register</button>
      <button className="link-button" onClick={onLogin}>Already have an account? Login</button>
    </div>
  )
}

function AccountView({ onLogout }) {
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
      <button className="logout-button" onClick={onLogout}>Logout</button>
    </div>
  )
}

function ProfileView() {
  const [authView, setAuthView] = useState('login')
  const [authenticated, setAuthenticated] = useState(false)

  if (authenticated) return <AccountView onLogout={() => setAuthenticated(false)} />
  if (authView === 'register') {
    return <RegisterView onRegister={() => setAuthenticated(true)} onLogin={() => setAuthView('login')} />
  }
  return <LoginView onLogin={() => setAuthenticated(true)} onRegister={() => setAuthView('register')} />
}

function App() {
  const [activeTab, setActiveTab] = useState('home')

  const content = {
    home: <HomeView />,
    catalog: <CatalogView />,
    profile: <ProfileView />,
  }[activeTab]

  return (
    <div className="app">
      <header className="header">
        <div className="logo">Apple Store Malaysia</div>
        <button className="cart-button">Cart</button>
      </header>
      <main className="content">{content}</main>
      <nav className="bottom-nav">
        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Home</button>
        <button className={activeTab === 'catalog' ? 'active' : ''} onClick={() => setActiveTab('catalog')}>Catalog</button>
        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Profile</button>
      </nav>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)