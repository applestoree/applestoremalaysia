import { useEffect, useState } from 'react'
import { PRODUCTS_ENDPOINT } from '../constants'
import { getProducts } from '../utils'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(PRODUCTS_ENDPOINT, { signal: controller.signal })
        const result = await response.json().catch(() => null)
        if (!response.ok || result?.success === false) {
          throw new Error(result?.error || `Request failed: ${response.status}`)
        }
        setProducts(getProducts(result))
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load products')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }
    load()
    return () => controller.abort()
  }, [])

  return { products, loading, error }
}
