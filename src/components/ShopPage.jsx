import React, { useMemo, useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductList from './ProductList'

export default function ShopPage({ onProduct }) {
  const { products, loading, error } = useProducts()
  const [filter, setFilter] = useState('')
  const [query, setQuery] = useState('')

  const productTypes = useMemo(
    () => [...new Set(products.map((product) => product.product_type).filter(Boolean))],
    [products]
  )

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (!filter || product.product_type === filter) &&
          (!query ||
            `${product.title} ${product.item_group_id}`
              .toLowerCase()
              .includes(query.toLowerCase()))
      ),
    [products, filter, query]
  )

  return (
    <section>
      <input
        className="search-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products"
        aria-label="Search products"
      />
      <div className="filters">
        <button
          className={!filter ? 'active' : ''}
          onClick={() => setFilter('')}
        >
          All
        </button>
        {productTypes.map((type) => (
          <button
            key={type}
            className={filter === type ? 'active' : ''}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>
      {loading && <div className="muted">Loading products...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && (
        <ProductList products={filteredProducts} onProduct={onProduct} />
      )}
    </section>
  )
}
