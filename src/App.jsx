import React, { useState } from 'react'
import { useLocation, useNavigate, useParams, Routes, Route } from 'react-router-dom'
import {
  SplashPage,
  Header,
  ProductCard,
  ProductList,
  HomePage,
  ShopPage,
  ProfilePage,
  ProductDetailPage,
  CartDrawer,
  CheckoutPage,
  TrackingPage,
  BottomNav,
  AppShell,
} from './components'
import { getVariantValue } from './utils'

export {
  SplashPage,
  Header,
  ProductCard,
  ProductList,
  HomePage,
  ShopPage,
  ProfilePage,
  ProductDetailPage,
  CartDrawer,
  CheckoutPage,
  TrackingPage,
  BottomNav,
  AppShell,
}

function ProductRoute({ addToCart, buyNow, cartCount, cartOpen, setCartOpen, cartItems, removeFromCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || 'home'

  return (
    <>
      <ProductDetailPage
        itemGroupId={id}
        onBack={() => navigate(from === 'shop' ? '/shop' : '/')}
        onAddToCart={(item) => {
          addToCart(item)
          navigate(from === 'shop' ? '/shop' : '/')
        }}
        onBuyNow={buyNow}
        onCart={() => setCartOpen(true)}
        cartCount={cartCount}
      />
      {cartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onCheckout={() => {
            setCartOpen(false)
            navigate('/checkout')
          }}
        />
      )}
    </>
  )
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState(null)
  const [orderId, setOrderId] = useState(null)

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const activePage =
    location.pathname === '/shop'
      ? 'shop'
      : location.pathname === '/profile'
        ? 'profile'
        : 'home'

  function addToCart({ product, color, size, price }) {
    const key = `${product.item_group_id}-${getVariantValue(color, 'color')}-${getVariantValue(size, 'size')}`
    setCartItems((items) => {
      const existing = items.find((item) => item.key === key)
      if (existing) {
        return items.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...items, { key, product, color, size, price, quantity: 1 }]
    })
  }

  function removeFromCart(key) {
    setCartItems((items) => items.filter((item) => item.key !== key))
  }

  function navigatePage(page) {
    const routes = {
      home: '/',
      shop: '/shop',
      profile: '/profile',
      checkout: '/checkout',
      tracking: '/tracking',
    }
    navigate(routes[page] || '/')
  }

  function openProduct(itemGroupId) {
    navigate(`/product/${encodeURIComponent(itemGroupId)}`, {
      state: { from: activePage },
    })
  }

  function buyNow(item) {
    addToCart(item)
    navigate('/checkout')
  }

  function renderShell(children) {
    return (
      <>
        <AppShell
          activePage={activePage}
          onNavigate={navigatePage}
          onCart={() => setCartOpen(true)}
          cartCount={cartCount}
        >
          {children}
        </AppShell>
        {cartOpen && (
          <CartDrawer
            items={cartItems}
            onClose={() => setCartOpen(false)}
            onRemove={removeFromCart}
            onCheckout={() => {
              setCartOpen(false)
              navigate('/checkout')
            }}
          />
        )}
      </>
    )
  }

  return (
    <Routes>
      <Route path="/" element={renderShell(<HomePage onProduct={openProduct} />)} />
      <Route path="/shop" element={renderShell(<ShopPage onProduct={openProduct} />)} />
      <Route path="/profile" element={renderShell(<ProfilePage onUserChange={setUser} />)} />
      <Route
        path="/product/:id"
        element={
          <ProductRoute
            addToCart={addToCart}
            buyNow={buyNow}
            cartCount={cartCount}
            cartOpen={cartOpen}
            setCartOpen={setCartOpen}
            cartItems={cartItems}
            removeFromCart={removeFromCart}
          />
        }
      />
      <Route
        path="/checkout"
        element={
          <CheckoutPage
            onBack={() => navigate('/')}
            onCart={() => setCartOpen(true)}
            cartCount={cartCount}
            user={user}
            items={cartItems}
            onOrderCreated={(id) => {
              setOrderId(id)
              setCartItems([])
              navigate('/tracking')
            }}
          />
        }
      />
      <Route
        path="/tracking"
        element={
          <TrackingPage
            orderId={orderId}
            onBack={() => navigate('/')}
            onCart={() => setCartOpen(true)}
            cartCount={cartCount}
          />
        }
      />
    </Routes>
  )
}

export default App
