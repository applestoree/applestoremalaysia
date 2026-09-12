import React, { useEffect, useMemo, useState } from 'react'

const PRODUCTS_ENDPOINT = '/functions/v1/apple-produk'
const USERS_ENDPOINT = '/functions/v1/apple-users'
const ORDERS_ENDPOINT = '/functions/v1/apple-orders'

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

function getProducts(response) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.products)) return response.products
  return []
}

function ProductCard({ product, onProduct }) {
  return (
    <button className="product product-button" onClick={() => onProduct(product.item_group_id)}>
      <div>{product.title || product.item_group_id || 'Product'}</div>
      {product.variant_size?.[0]?.price != null && <div>RM {product.variant_size[0].price}</div>}
    </button>
  )
}

function ProductList({ products, onProduct }) {
  if (!products.length) return <div className="muted">No products available.</div>

  return (
    <div className="products">
      {products.map((product) => (
        <ProductCard key={product.item_group_id} product={product} onProduct={onProduct} />
      ))}
    </div>
  )
}

function HomePage({ onProduct }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(PRODUCTS_ENDPOINT)
        if (!response.ok) throw new Error(`Request failed: ${response.status}`)
        const data = await response.json()
        if (!cancelled) setProducts(getProducts(data))
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load products')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProducts()
    return () => { cancelled = true }
  }, [])

  const flashSaleProducts = useMemo(
    () => products.filter((product) => product.custom_label_0 === 'flashsale'),
    [products]
  )

  const recommendedProducts = useMemo(() => {
    return [...products].sort(() => Math.random() - 0.5).slice(0, 8)
  }, [products])

  return (
    <section>
      <div className="hero">Hero/Banner</div>

      <div className="section-title">FlashSale</div>
      {loading && <div className="muted">Loading products...</div>}
      {error && <div className="muted">{error}</div>}
      {!loading && !error && <ProductList products={flashSaleProducts} onProduct={onProduct} />}

      <div className="section-title">Recommeded</div>
      {loading && <div className="muted">Loading products...</div>}
      {error && <div className="muted">{error}</div>}
      {!loading && !error && <ProductList products={recommendedProducts} onProduct={onProduct} />}
    </section>
  )
}

function ShopPage({ onProduct }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(PRODUCTS_ENDPOINT)
        if (!response.ok) throw new Error(`Request failed: ${response.status}`)
        const data = await response.json()
        if (!cancelled) setProducts(getProducts(data))
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load products')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProducts()
    return () => { cancelled = true }
  }, [])

  const productTypes = useMemo(() => {
    return [...new Set(products.map((product) => product.product_type).filter(Boolean))]
  }, [products])

  const filteredProducts = filter
    ? products.filter((product) => product.product_type === filter)
    : products

  return (
    <section>
      <div className="search">Search products</div>
      <div className="filters">
        <button className={!filter ? 'active' : ''} onClick={() => setFilter('')}>All</button>
        {productTypes.map((type) => (
          <button key={type} className={filter === type ? 'active' : ''} onClick={() => setFilter(type)}>
            {type}
          </button>
        ))}
      </div>
      {loading && <div className="muted">Loading products...</div>}
      {error && <div className="muted">{error}</div>}
      {!loading && !error && <ProductList products={filteredProducts} onProduct={onProduct} />}
    </section>
  )
}

function ProfilePage() {
  const [authView, setAuthView] = useState('login')
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submitAuth(event) {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      const endpoint = authView === 'login' ? `${USERS_ENDPOINT}/login` : `${USERS_ENDPOINT}/register`
      const body = authView === 'login' ? { phone, password } : { name, phone, password }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.error || 'Authentication failed')
      setUser(result.data)
      setAuthenticated(true)
      setPassword('')
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  if (authenticated) {
    return (
      <div className="account-view">
        <div className="account-header">
          <div className="avatar">{user?.name?.charAt(0) || 'A'}</div>
          <div>
            <strong>{user?.name || 'Account'}</strong>
            <div className="muted">{user?.phone || 'Apple Store customer'}</div>
          </div>
        </div>
        <button className="account-item">Personal Information <span>›</span></button>
        <button className="account-item">My Orders <span>›</span></button>
        <button className="account-item">Wishlist <span>›</span></button>
        <button className="account-item">Settings <span>›</span></button>
        <button className="logout-button" onClick={() => { setAuthenticated(false); setUser(null) }}>Logout</button>
      </div>
    )
  }

  return (
    <form className="auth-view" onSubmit={submitAuth}>
      <h1>{authView === 'register' ? 'Register' : 'Login'}</h1>
      {authView === 'register' && <input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} required />}
      <input placeholder="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      {error && <div className="muted">{error}</div>}
      <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Loading...' : authView === 'register' ? 'Register' : 'Login'}</button>
      <button className="link-button" type="button" onClick={() => { setAuthView(authView === 'register' ? 'login' : 'register'); setError('') }}>
        {authView === 'register' ? 'Already have an account? Login' : 'Create account'}
      </button>
    </form>
  )
}

function ProductDetailPage({ itemGroupId, onBack }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProduct() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`${PRODUCTS_ENDPOINT}/${encodeURIComponent(itemGroupId)}`)
        if (!response.ok) throw new Error(`Request failed: ${response.status}`)
        const data = await response.json()
        const detail = data?.data || data
        if (!cancelled) setProduct(detail)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load product')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (itemGroupId) loadProduct()
    return () => { cancelled = true }
  }, [itemGroupId])

  if (loading) return <div className="full-page-content"><button className="back-button" onClick={onBack}>← Back</button><div className="muted">Loading product...</div></div>
  if (error) return <div className="full-page-content"><button className="back-button" onClick={onBack}>← Back</button><div className="muted">{error}</div></div>
  if (!product) return <div className="full-page-content"><button className="back-button" onClick={onBack}>← Back</button><div className="muted">Product not found.</div></div>

  return (
    <div className="full-page-content">
      <button className="back-button" onClick={onBack}>← Back</button>
      <div className="detail-image">Product Image</div>
      <h1>{product.title || product.item_group_id}</h1>
      {product.variant_size?.[0]?.price != null && <div className="price">RM {product.variant_size[0].price}</div>}
      <div className="detail-section"><strong>Color</strong><div className="option-row">{(product.variant_color || []).map((color) => <button key={color}>{color}</button>)}</div></div>
      <div className="detail-section"><strong>Storage</strong><div className="option-row">{(product.variant_size || []).map((size) => <button key={size.size || size}>{size.size || size}</button>)}</div></div>
      <div className="detail-section"><strong>Description</strong><p>{product.description || 'Product description...'}</p></div>
      <div className="detail-actions"><button>Add to Cart</button><button className="primary-button">Buy Now</button></div>
    </div>
  )
}

function CheckoutPage({ onBack, user, onOrderCreated }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function placeOrder() {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(ORDERS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user?.phone || null,
          items: [],
          address: null,
          store: { name: 'Apple Store Malaysia' },
          shipping: { method: 'Delivery' },
          payment: { method: 'Bank Transfer' },
          subtotal: 2999,
          shipping_fee: 0,
          discount: 0,
          total: 2999,
          status: 'pending',
        }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.error || 'Order creation failed')
      onOrderCreated(result.data?.id)
    } catch (err) {
      setError(err.message || 'Order creation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="full-page-content">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h1>Checkout</h1>
      <div className="checkout-card"><strong>Delivery Address</strong><p>Name · Address · Phone</p></div>
      <div className="checkout-card"><strong>Store</strong><p>Apple Store Malaysia</p></div>
      <div className="checkout-card"><strong>Shipping</strong><p>Delivery / Store Pickup</p></div>
      <div className="checkout-card"><strong>Payment</strong><p>Bank Transfer / DuitNow QR</p></div>
      <div className="order-summary"><span>Total</span><strong>RM 2,999</strong></div>
      {error && <div className="muted">{error}</div>}
      <button className="primary-button" onClick={placeOrder} disabled={loading}>{loading ? 'Creating Order...' : 'Place Order'}</button>
    </div>
  )
}

function TrackingPage({ orderId, onBack }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(Boolean(orderId))
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadOrder() {
      try {
        const response = await fetch(`${ORDERS_ENDPOINT}/${encodeURIComponent(orderId)}`)
        if (!response.ok) throw new Error(`Request failed: ${response.status}`)
        const result = await response.json()
        if (!cancelled) setOrder(result.data)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load order')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (orderId) loadOrder()
    return () => { cancelled = true }
  }, [orderId])

  return (
    <div className="full-page-content">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h1>Tracking</h1>
      {loading && <div className="muted">Loading order...</div>}
      {error && <div className="muted">{error}</div>}
      {!loading && !error && <div className="tracking-card"><strong>Order Status</strong><div className="tracking-step active">{order?.status || 'pending'}</div></div>}
    </div>
  )
}

function CartDrawer({ onClose, onCheckout }) {
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header"><strong>Cart</strong><button onClick={onClose}>×</button></div>
        <div className="cart-item"><div className="cart-image">IMG</div><div><strong>iPhone</strong><div>RM 2,999</div></div></div>
        <div className="order-summary"><span>Subtotal</span><strong>RM 2,999</strong></div>
        <button className="primary-button" onClick={onCheckout}>Proceed Checkout</button>
      </aside>
    </div>
  )
}

function Overlay({ cartOpen, onCloseCart, onCheckout }) {
  return cartOpen ? <CartDrawer onClose={onCloseCart} onCheckout={onCheckout} /> : null
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

function AppShell({ activePage, onNavigate, onCart, onProduct, children }) {
  return (
    <div className="app-shell">
      <Header onCart={onCart} />
      <main className="main-content">{children}</main>
      <BottomNav activePage={activePage} onNavigate={onNavigate} />
    </div>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [activePage, setActivePage] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) return <SplashPage />

  if (selectedProduct) {
    return <ProductDetailPage itemGroupId={selectedProduct} onBack={() => setSelectedProduct(null)} />
  }

  if (activePage === 'checkout') {
    return <CheckoutPage user={user} onBack={() => setActivePage('home')} onOrderCreated={(id) => { setOrderId(id); setActivePage('tracking') }} />
  }

  if (activePage === 'tracking') {
    return <TrackingPage orderId={orderId} onBack={() => setActivePage('home')} />
  }

  return (
    <>
      <AppShell
        activePage={activePage}
        onNavigate={setActivePage}
        onCart={() => setCartOpen(true)}
        onProduct={setSelectedProduct}
      >
        {activePage === 'home' && <HomePage onProduct={setSelectedProduct} />}
        {activePage === 'shop' && <ShopPage onProduct={setSelectedProduct} />}
        {activePage === 'profile' && <ProfilePage />}
      </AppShell>
      <Overlay
        cartOpen={cartOpen}
        onCloseCart={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setActivePage('checkout') }}
      />
    </>
  )
}

export default App
