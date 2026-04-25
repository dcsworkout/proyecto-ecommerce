<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-purple-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold mb-2">Tiendas Familiares</h1>
        <p class="text-purple-100">Encuentra los productos que te encantan</p>
      </div>
    </header>
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4 flex flex-wrap gap-3">
        <input v-model="filters.search" @input="loadProducts" type="text"
          placeholder="Buscar..." class="border px-4 py-2 rounded-lg flex-1 min-w-48" />
        <select v-model="filters.tipo" @change="loadProducts" class="border px-4 py-2 rounded-lg">
          <option value="">Todas las categorias</option>
          <option v-for="cat in categories" :key="cat.tipo" :value="cat.tipo">
            {{ cat.tipo }} ({{ cat.count }})
          </option>
        </select>
        <select v-model="filters.talla" @change="loadProducts" class="border px-4 py-2 rounded-lg">
          <option value="">Todas las tallas</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
        <button v-if="hasFilters" @click="clearFilters" class="text-purple-600 px-4 py-2">Limpiar</button>
      </div>
    </div>
    <main class="container mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-20">
        <p class="text-gray-500">Cargando productos...</p>
      </div>
      <div v-else-if="products.length === 0" class="text-center py-20">
        <p class="text-gray-400">No se encontraron productos</p>
      </div>
      <div v-else>
        <p class="text-gray-600 mb-6">{{ products.length }} productos encontrados</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="product in products" :key="product.id"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
            <div class="h-48 bg-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {{ product.tipo }}
            </div>
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">{{ product.modelo }}</h3>
                <span class="bg-purple-600 text-white px-2 py-1 rounded text-sm font-bold ml-2">
                  ${{ formatPrice(product.price) }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mb-1">{{ product.shop_name }}</p>
              <p class="text-xs text-gray-400 mb-3">{{ product.available_tallas?.length || 0 }} tallas disponibles</p>
              <div class="flex flex-wrap gap-1 mb-3">
                <span v-for="(c, i) in (product.available_colors || []).slice(0, 3)" :key="i"
                  class="text-xs bg-gray-100 px-2 py-1 rounded">{{ c }}</span>
              </div>
              <button @click="contactWhatsApp(product)"
                class="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition">
                Contactar por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="bg-gray-800 text-white py-6 mt-12 text-center">
      <p>Tiendas Familiares 2026</p>
    </footer>
  </div>
</template>
<script setup>
const { fetchProducts, fetchCategories } = useApi()
const products = ref([])
const categories = ref([])
const loading = ref(false)
const filters = ref({ search: '', tipo: '', talla: '' })
const hasFilters = computed(() => Object.values(filters.value).some(v => v !== ''))
const loadProducts = async () => {
  loading.value = true
  try {
    const clean = Object.fromEntries(Object.entries(filters.value).filter(([_, v]) => v !== ''))
    const response = await fetchProducts(clean)
    products.value = response.products || []
  } catch (e) { products.value = [] }
  finally { loading.value = false }
}
const loadCategories = async () => {
  try { const r = await fetchCategories(); categories.value = r.categories || [] } catch (e) {}
}
const clearFilters = () => { filters.value = { search: '', tipo: '', talla: '' }; loadProducts() }
const formatPrice = (p) => parseFloat(p).toFixed(0)
const contactWhatsApp = (product) => {
  const msg = encodeURIComponent(`Hola, me interesa el ${product.modelo} de ${product.shop_name}`)
  const phone = product.whatsapp_number.replace(/[^0-9]/g, '')
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
}
onMounted(() => { loadProducts(); loadCategories() })
</script>
