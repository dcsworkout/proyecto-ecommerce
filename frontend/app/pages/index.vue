<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white">
      <div class="max-w-7xl mx-auto px-6 py-12">
        <h1 class="text-5xl font-bold tracking-tight mb-2">Tiendas Familiares</h1>
        <p class="text-violet-200 text-lg">Ropa y accesorios con el mejor estilo</p>
      </div>
    </header>
    <div class="bg-white border-b shadow-sm sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-6 py-3 flex flex-wrap gap-3 items-center">
        <input v-model="filters.search" @input="loadProducts" type="text"
          placeholder="Buscar productos..."
          class="flex-1 min-w-48 border border-gray-200 px-4 py-2 rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
        <select v-model="filters.tipo" @change="loadProducts"
          class="border border-gray-200 px-4 py-2 rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
          <option value="">Todas las categorias</option>
          <option v-for="cat in categories" :key="cat.tipo" :value="cat.tipo">{{ cat.tipo }} ({{ cat.count }})</option>
        </select>
        <select v-model="filters.talla" @change="loadProducts"
          class="border border-gray-200 px-4 py-2 rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
          <option value="">Todas las tallas</option>
          <option value="XS">XS</option><option value="S">S</option>
          <option value="M">M</option><option value="L">L</option><option value="XL">XL</option>
        </select>
        <button v-if="hasFilters" @click="clearFilters"
          class="text-violet-600 hover:text-violet-800 text-sm font-medium px-3 py-2 rounded-full hover:bg-violet-50 transition">
          Limpiar
        </button>
      </div>
    </div>
    <main class="max-w-7xl mx-auto px-6 py-10">
      <div v-if="loading" class="flex justify-center py-24">
        <div class="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
      <div v-else-if="products.length === 0" class="text-center py-24 text-gray-400">
        <p class="text-lg">No encontramos productos con esos filtros</p>
        <button @click="clearFilters" class="mt-3 text-violet-600 hover:underline text-sm">Ver todos</button>
      </div>
      <div v-else>
        <p class="text-gray-400 text-sm mb-8">{{ products.length }} productos encontrados</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <NuxtLink v-for="product in products" :key="product.id" :to="`/producto/${product.id}`"
            class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer block">
            <div :style="{ background: getBgGradient(product.tipo) }"
              class="h-52 flex flex-col items-center justify-center text-white relative overflow-hidden">
              <div class="absolute inset-0 opacity-10" style="background-image: repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%); background-size: 12px 12px;"></div>
              <span class="text-6xl mb-2 relative z-10">{{ getEmoji(product.tipo) }}</span>
              <span class="text-xs font-semibold uppercase tracking-widest opacity-90 relative z-10">{{ product.tipo }}</span>
            </div>
            <div class="p-5">
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-bold text-gray-800 text-sm leading-tight flex-1">{{ product.modelo }}</h3>
                <span class="ml-2 shrink-0 bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  ${{ formatPrice(product.price) }}
                </span>
              </div>
              <p class="text-xs text-gray-400 mb-3">{{ product.shop_name }}</p>
              <div class="flex flex-wrap gap-1 mb-4">
                <span v-for="(c, i) in (product.available_colors || []).slice(0, 3)" :key="i"
                  class="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{{ c }}</span>
                <span v-if="(product.available_colors || []).length > 3" class="text-xs text-gray-300 px-1 py-0.5">
                  +{{ product.available_colors.length - 3 }}
                </span>
              </div>
              <button @click.prevent="contactWhatsApp(product)"
                class="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl font-semibold transition text-sm">
                Contactar por WhatsApp
              </button>
            </div>
          </NuxtLink>
        </div>
      </div>
    </main>
    <footer class="bg-gray-900 text-gray-500 py-10 mt-20">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <p class="text-white font-semibold text-lg mb-1">Tiendas Familiares</p>
        <p class="text-sm">Contactanos por WhatsApp para hacer tu pedido</p>
      </div>
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
    const r = await fetchProducts(clean)
    products.value = r.products || []
  } catch (e) { products.value = [] }
  finally { loading.value = false }
}
const loadCategories = async () => {
  try { const r = await fetchCategories(); categories.value = r.categories || [] } catch (e) {}
}
const clearFilters = () => { filters.value = { search: '', tipo: '', talla: '' }; loadProducts() }
const formatPrice = (p) => parseFloat(p).toFixed(0)
const getEmoji = (tipo) => {
  const map = { 'Vestido': 'V', 'Blusa': 'B', 'Pantalon': 'P', 'Falda': 'F', 'Accesorio': 'A' }
  return map[tipo] || map[tipo?.normalize('NFD').replace(/[\u0300-\u036f]/g, '')] || 'X'
}
const getBgGradient = (tipo) => {
  const t = tipo?.normalize('NFD').replace(/[\u0300-\u036f]/g, '') || ''
  const map = {
    'Vestido': 'linear-gradient(135deg, #f472b6, #ec4899)',
    'Blusa': 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    'Pantalon': 'linear-gradient(135deg, #60a5fa, #3b82f6)',
    'Falda': 'linear-gradient(135deg, #f0abfc, #c026d3)',
    'Accesorio': 'linear-gradient(135deg, #fbbf24, #f59e0b)',
  }
  return map[t] || 'linear-gradient(135deg, #6b7280, #4b5563)'
}
const contactWhatsApp = (product) => {
  const msg = encodeURIComponent(`Hola, me interesa el ${product.modelo} de ${product.shop_name}`)
  const phone = product.whatsapp_number.replace(/[^0-9]/g, '')
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
}
onMounted(() => { loadProducts(); loadCategories() })
</script>
