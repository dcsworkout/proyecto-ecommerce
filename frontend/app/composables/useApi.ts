export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const fetchProducts = async (filters: Record<string, string> = {}) => {
    const query = new URLSearchParams(filters).toString()
    return await $fetch(`${baseURL}/products${query ? '?' + query : ''}`)
  }

  const fetchProduct = async (id: string) => {
    return await $fetch(`${baseURL}/products/${id}`)
  }

  const fetchCategories = async (shopSlug?: string) => {
    const query = shopSlug ? `?shop_slug=${shopSlug}` : ''
    return await $fetch(`${baseURL}/products/categories/list${query}`)
  }

  return { fetchProducts, fetchProduct, fetchCategories }
}
