<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Panel de Administracion</h1>
      <div class="flex items-center gap-4">
        <span class="text-purple-200 text-sm">{{ user?.full_name }} - {{ user?.shop?.name }}</span>
        <button @click="logout" class="bg-purple-800 px-4 py-2 rounded-lg text-sm hover:bg-purple-900">
          Cerrar sesion
        </button>
      </div>
    </nav>
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow p-6">
          <p class="text-gray-500 text-sm">Ventas hoy</p>
          <p class="text-3xl font-bold text-purple-600">{{ todayStats.sales_count }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <p class="text-gray-500 text-sm">Items vendidos hoy</p>
          <p class="text-3xl font-bold text-green-600">{{ todayStats.items_sold }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <p class="text-gray-500 text-sm">Ingresos hoy</p>
          <p class="text-3xl font-bold text-blue-600">${{ todayStats.revenue }}</p>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-bold mb-4">Registrar Venta</h2>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Producto</label>
            <select v-model="sale.productId" @change="onProductChange"
              class="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option value="">Seleccionar producto</option>
              <option v-for="p in products" :key="p.id" :value="p.id">
                {{ p.modelo }} - ${{ parseFloat(p.price).toFixed(0) }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Talla</label>
            <select v-model="sale.talla" @change="onTallaChange"
              class="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
              :disabled="!sale.productId">
              <option value="">Seleccionar talla</option>
              <option v-for="t in availableTallas" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <select v-model="sale.inventoryId"
              class="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
              :disabled="!sale.talla">
              <option value="">Seleccionar color</option>
              <option v-for="v in availableColors" :key="v.id" :value="v.id">
                {{ v.color }} ({{ v.quantity }} disponibles)
              </option>
            </select>
          </div>
          <div v-if="saleMessage" :class="saleMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
            class="px-4 py-3 rounded-lg mb-4 text-sm">
            {{ saleMessage.text }}
          </div>
          <button @click="registerSale" :disabled="!sale.inventoryId || registering"
            class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50">
            {{ registering ? 'Registrando...' : 'Registrar Venta' }}
          </button>
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-bold mb-4">Ventas Recientes</h2>
          <div v-if="recentSales.length === 0" class="text-gray-400 text-center py-8">
            No hay ventas registradas
          </div>
          <div v-for="s in recentSales" :key="s.id"
            class="flex justify-between items-center py-3 border-b last:border-0">
            <div>
              <p class="font-medium text-sm">{{ s.modelo }}</p>
              <p class="text-xs text-gray-500">{{ s.talla }} - {{ s.color }} | {{ s.seller_name }}</p>
            </div>
            <span class="font-bold text-green-600">${{ parseFloat(s.total_amount).toFixed(0) }}</span>
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
const todayStats = ref({ sales_count: 0, items_sold: 0, revenue: 0 })
const recentSales = ref([])
const sale = ref({ productId: '', talla: '', inventoryId: '' })
const registering = ref(false)
const saleMessage = ref(null)

const availableTallas = computed(() => {
  if (!sale.value.productId) return []
  const productVariants = variants.value.filter(v => v.product_id === sale.value.productId && v.quantity > 0)
  return [...new Set(productVariants.map(v => v.talla))]
})

const availableColors = computed(() => {
  if (!sale.value.talla) return []
  return variants.value.filter(v =>
    v.product_id === sale.value.productId &&
    v.talla === sale.value.talla &&
    v.quantity > 0
  )
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
      method: 'POST',
      headers: authHeaders(),
      body: { inventory_id: sale.value.inventoryId, quantity_sold: 1 }
    })
    saleMessage.value = { type: 'success', text: data.message }
    sale.value = { productId: '', talla: '', inventoryId: '' }
    await loadData()
  } catch (e) {
    saleMessage.value = { type: 'error', text: e.data?.error || 'Error al registrar venta' }
  } finally {
    registering.value = false
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  navigateTo('/login')
}

onMounted(() => {
  token.value = localStorage.getItem('token') || ''
  user.value = JSON.parse(localStorage.getItem('user') || '{}')
  loadData()
})
</script>
