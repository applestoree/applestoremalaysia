export function getProducts(response) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.products)) return response.products
  return []
}

export function getVariantValue(value, key) {
  if (value && typeof value === 'object') {
    return value[key] ?? value.name ?? value.value ?? value.label ?? ''
  }
  return value ?? ''
}

export function getPrice(value) {
  if (value && typeof value === 'object') {
    return Number(value.sale_price ?? value.price ?? 0)
  }
  return Number(value || 0)
}

export function getProductPrice(product, selectedSize = null) {
  return getPrice(selectedSize || product?.variant_size?.[0])
}
