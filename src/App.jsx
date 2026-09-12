import React, { useState } from 'react'
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

function App() {
  const [activePage, setActivePage] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState(null)
  const [orderId, setOrderId] = useState(null)

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

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

  function buyNow(item) {
    addToCart(item)
    setSelectedProduct(null)
    setActivePage('checkout')
  }

  if (selectedProduct) {
    return (
      <>
        <ProductDetailPage
          itemGroupId={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onAddToCart={(item) => {
            addToCart(item)
            setSelectedProduct(null)
          }}
          onBuyNow={buyNow}
          onCart={() => setCartOpen(true)}
          cartCount={cartCount}
          activePage={activePage}
          onNavigate={(page) => {
            setSelectedProduct(null)
            setActivePage(page)
          }}
        />
        {cartOpen && (
          <CartDrawer
            items={cartItems}
            onClose={() => setCartOpen(false)}
            onRemove={removeFromCart}
            onCheckout={() => {
              setCartOpen(false)
              setSelectedProduct(null)
              setActivePage('checkout')
            }}
          />
        )}
      </>
    )
  }

  if (activePage === 'checkout') {
    return (
      <CheckoutPage
        onBack={() => setActivePage('home')}
        user={user}
        items={cartItems}
        onOrderCreated={(id) => {
          setOrderId(id)
          setCartItems([])
          setActivePage('tracking')
        }}
      />
    )
  }

  if (activePage === 'tracking') {
    return (
      <TrackingPage
        orderId={orderId}
        onBack={() => setActivePage('home')}
      />
    )
  }

  return (
    <>
      <AppShell
        activePage={activePage}
        onNavigate={setActivePage}
        onCart={() => setCartOpen(true)}
        cartCount={cartCount}
      >
        {activePage === 'home' && <HomePage onProduct={setSelectedProduct} />}
        {activePage === 'shop' && <ShopPage onProduct={setSelectedProduct} />}
        {activePage === 'profile' && <ProfilePage onUserChange={setUser} />}
      </AppShell>
      {cartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onCheckout={() => {
            setCartOpen(false)
            setActivePage('checkout')
          }}
        />
      )}
    </>
  )
}

export default App
