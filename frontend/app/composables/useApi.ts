export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const fetchProducts = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString()
    const url = `${baseURL}/products${query ? '?' + query : ''}`
    return await $fetch(url)
  }

  const fetchProduct = async (id) => {
    return await $fetch(`${baseURL}/products/${id}`)
  }

  const fetchCategories = async () => {
    return await $fetch(`${baseURL}/products/categories/list`)
  }

  return {
    fetchProducts,
    fetchProduct,
    fetchCategories
  }
}
