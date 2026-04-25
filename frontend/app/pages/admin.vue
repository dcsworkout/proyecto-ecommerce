<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Panel de Administracion</h1>
        <p class="text-xs text-gray-400">{{ user?.shop?.name }}</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-600 hidden sm:block">{{ user?.full_name }}</span>
        <a href="/" class="text-sm text-purple-600 hover:underline hidden sm:block">Ver catalogo</a>
        <button @click="logout"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition">
          Salir
        </button>
      </div>
    </nav>
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p class="text-sm text-gray-400 mb-1">Ventas hoy</p>
          <p class="text-4xl font-bold text-purple-600">{{ todayStats.sales_count || 0 }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p class="text-sm text-gray-400 mb-1">Items vendidos</p>
          <p class="text-4xl font-bold text-blue-600">{{ todayStats.items_sold || 0 }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p class="text-sm text-gray-400 mb-1">Ingresos hoy</p>
          <p class="text-4xl font-bold text-green-600">${{ todayStats.revenue || 0 }}</p>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-6">Registrar Venta</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Producto</label>
              <select v-model="sale.productId" @change="onProductChange"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800">
                <option value="">Seleccionar producto...</option>
                <option v-for="p in products" :key="p.id" :value="p.id">
                  {{ p.modelo }} - ${{ parseFloat(p.price).toFixed(0) }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Talla</label>
              <select v-model="sale.talla" @change="onTallaChange"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 disabled:opacity-40"
                :disabled="!sale.productId">
                <option value="">Seleccionar talla...</option>
                <option v-for="t in availableTallas" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Color</label>
              <select v-model="sale.inventoryId"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 disabled:opacity-40"
                :disabled="!sale.talla">
                <option value="">Seleccionar color...</option>
                <option v-for="v in availableColors" :key="v.id" :value="v.id">
                  {{ v.color }} ({{ v.quantity }} disponibles)
                </option>
              </select>
            </div>
          </div>
          <div v-if="saleMessage" :class="saleMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'"
            class="mt-4 px-4 py-3 rounded-xl border text-sm font-medium">
            {{ saleMessage.text }}
          </div>
          <button @click="registerSale" :disabled="!sale.inventoryId || registering"
            class="mt-6 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white py-3.5 rounded-xl font-semibold transition text-base">
            {{ registering ? 'Registrando...' : 'Registrar Venta' }}
          </button>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-6">Ventas Recientes</h2>
          <div v-if="recentSales.length === 0" class="text-center py-12 text-gray-300">
            <p class="text-4xl mb-2">empty</p>
            <p class="text-sm">No hay ventas aun</p>
          </div>
          <div v-else class="space-y-3 max-h-96 overflow-y-auto">
            <div v-for="s in recentSales" :key="s.id"
              class="flex justify-between items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
              <div>
                <p class="font-semibold text-gray-800 text-sm">{{ s.modelo }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ s.talla }} - {{ s.color }} | {{ s.seller_name }}</p>
              </div>
              <span class="font-bold text-green-600 text-sm shrink-0 ml-3">
                ${{ parseFloat(s.total_amount).toFixed(0) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ middleware: 'auth' })
const config = useRuntimeConfig()
const user = ref(null)
const token = ref('')
const products = ref([])
const variants = ref([])
const todayStats = ref({})
const recentSales = ref([])
const sale = ref({ productId: '', talla: '', inventoryId: '' })
const registering = ref(false)
const saleMessage = ref(null)
const availableTallas = computed(() => {
  if (!sale.value.productId) return []
  const v = variants.value.filter(v => v.product_id === sale.value.productId && v.quantity > 0)
  return [...new Set(v.map(v => v.talla))]
})
const availableColors = computed(() => {
  if (!sale.value.talla) return []
  return variants.value.filter(v => v.product_id === sale.value.productId && v.talla === sale.value.talla && v.quantity > 0)
})
const onProductChange = () => { sale.value.talla = ''; sale.value.inventoryId = '' }
const onTallaChange = () => { sale.value.inventoryId = '' }
const authHeaders = () => ({ Authorization: `Bearer ${token.value}` })
const loadData = async () => {
  const [prods, stats, sales] = await Promise.all([
    $fetch(`${config.public.apiBase}/products/my-shop/all`, { headers: authHeaders() }),
    $fetch(`${config.public.apiBase}/sales/today`, { headers: authHeaders() }),
    $fetch(`${config.public.apiBase}/sales?limit=10`, { headers: authHeaders() })
  ])
  products.value = prods.products || []
  todayStats.value = stats.today || {}
  recentSales.value = sales.sales || []
  const inv = await $fetch(`${config.public.apiBase}/inventory/shop/${user.value.shop.id}`, { headers: authHeaders() })
  variants.value = inv.inventory || []
}
const registerSale = async () => {
  registering.value = true
  saleMessage.value = null
  try {
    const data = await $fetch(`${config.public.apiBase}/sales`, {
      method: 'POST', headers: authHeaders(),
      body: { inventory_id: sale.value.inventoryId, quantity_sold: 1 }
    })
    saleMessage.value = { type: 'success', text: data.message }
    sale.value = { productId: '', talla: '', inventoryId: '' }
    setTimeout(() => saleMessage.value = null, 4000)
    await loadData()
  } catch (e) {
    saleMessage.value = { type: 'error', text: e.data?.error || 'Error al registrar' }
  } finally { registering.value = false }
}
const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigateTo('/login') }
onMounted(() => {
  token.value = localStorage.getItem('token') || ''
  user.value = JSON.parse(localStorage.getItem('user') || '{}')
  loadData()
})
</script>
