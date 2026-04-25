<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b shadow-sm px-4 py-3 flex justify-between items-center">
      <div>
        <h1 class="text-lg font-bold text-gray-800">Panel Admin</h1>
        <p class="text-xs text-gray-400">{{ user?.shop?.name }}</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600 hidden sm:block">{{ user?.full_name }}</span>
        <a href="/" class="text-xs text-violet-600 border border-violet-200 px-3 py-1.5 rounded-lg hidden sm:block">Catalogo</a>
        <button @click="logout" class="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">Salir</button>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto px-3 py-4">
      <!-- Stats row -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <p class="text-xs text-gray-400">Ventas hoy</p>
          <p class="text-2xl font-bold text-violet-600">{{ todayStats.sales_count || 0 }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <p class="text-xs text-gray-400">Items</p>
          <p class="text-2xl font-bold text-blue-600">{{ todayStats.items_sold || 0 }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-3 text-center">
          <p class="text-xs text-gray-400">Ingresos</p>
          <p class="text-lg font-bold text-green-600">${{ todayStats.revenue || 0 }}</p>
        </div>
      </div>

      <!-- Quick sale -->
      <div class="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <h2 class="font-bold text-gray-800 mb-3 text-base">Registrar Venta</h2>

        <!-- Step 1: Product selection -->
        <div v-if="step === 1">
          <p class="text-xs text-gray-400 mb-3 uppercase tracking-wide font-medium">Selecciona el producto</p>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="p in products" :key="p.id" @click="selectProduct(p)"
              :style="{ background: getBgGradient(p.tipo) }"
              class="rounded-xl p-3 text-white text-left shadow-sm active:scale-95 transition-transform">
              <p class="font-bold text-sm leading-tight">{{ p.modelo }}</p>
              <p class="text-xs opacity-80 mt-1">${{ parseFloat(p.price).toFixed(0) }}</p>
            </button>
          </div>
        </div>

        <!-- Step 2: Talla selection -->
        <div v-if="step === 2">
          <button @click="step = 1" class="text-xs text-violet-600 mb-3 flex items-center gap-1">
            Atras — {{ sale.product?.modelo }}
          </button>
          <p class="text-xs text-gray-400 mb-3 uppercase tracking-wide font-medium">Selecciona la talla</p>
          <div class="grid grid-cols-3 gap-2">
            <button v-for="t in availableTallas" :key="t" @click="selectTalla(t)"
              class="bg-gray-50 border-2 border-gray-200 rounded-xl py-4 font-bold text-gray-800 text-lg active:bg-violet-600 active:text-white active:border-violet-600 hover:border-violet-400 transition-all">
              {{ t }}
            </button>
          </div>
        </div>

        <!-- Step 3: Color selection -->
        <div v-if="step === 3">
          <button @click="step = 2" class="text-xs text-violet-600 mb-3 flex items-center gap-1">
            Atras — Talla {{ sale.talla }}
          </button>
          <p class="text-xs text-gray-400 mb-3 uppercase tracking-wide font-medium">Selecciona el color</p>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="v in availableColors" :key="v.id" @click="selectColor(v)"
              class="bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 text-left active:bg-violet-600 active:text-white active:border-violet-600 hover:border-violet-400 transition-all">
              <p class="font-bold text-gray-800">{{ v.color }}</p>
              <p class="text-xs text-gray-400">{{ v.quantity }} disponibles</p>
            </button>
          </div>
        </div>

        <!-- Step 4: Confirm -->
        <div v-if="step === 4">
          <button @click="step = 3" class="text-xs text-violet-600 mb-4 flex items-center gap-1">Atras</button>
          <div :style="{ background: getBgGradient(sale.product?.tipo) }"
            class="rounded-xl p-4 text-white mb-4">
            <p class="text-xs opacity-80 uppercase tracking-wide">Confirmar venta</p>
            <p class="text-xl font-bold mt-1">{{ sale.product?.modelo }}</p>
            <p class="text-sm opacity-90">Talla {{ sale.talla }} — {{ sale.color?.color }}</p>
            <p class="text-2xl font-bold mt-2">${{ parseFloat(sale.product?.price || 0).toFixed(0) }}</p>
          </div>
          <div v-if="saleMessage" :class="saleMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'"
            class="px-4 py-3 rounded-xl border text-sm font-medium mb-3">
            {{ saleMessage.text }}
          </div>
          <button @click="registerSale" :disabled="registering"
            class="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg active:scale-95 transition-all">
            {{ registering ? 'Registrando...' : 'Confirmar Venta' }}
          </button>
        </div>
      </div>

      <!-- Recent sales -->
      <div class="bg-white rounded-2xl shadow-sm p-4">
        <h2 class="font-bold text-gray-800 mb-3 text-base">Ventas Recientes</h2>
        <div v-if="recentSales.length === 0" class="text-center py-6 text-gray-300 text-sm">Sin ventas aun</div>
        <div v-else class="space-y-2">
          <div v-for="s in recentSales" :key="s.id"
            class="flex justify-between items-center py-2.5 px-3 rounded-xl bg-gray-50">
            <div>
              <p class="font-semibold text-gray-800 text-sm">{{ s.modelo }}</p>
              <p class="text-xs text-gray-400">{{ s.talla }} · {{ s.color }} · {{ s.seller_name }}</p>
            </div>
            <span class="font-bold text-green-600 text-sm">${{ parseFloat(s.total_amount).toFixed(0) }}</span>
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
const step = ref(1)
const sale = ref({ product: null, talla: '', color: null, inventoryId: '' })
const registering = ref(false)
const saleMessage = ref(null)

const availableTallas = computed(() => {
  if (!sale.value.product) return []
  const v = variants.value.filter(v => v.product_id === sale.value.product.id && v.quantity > 0)
  return [...new Set(v.map(v => v.talla))]
})

const availableColors = computed(() => {
  if (!sale.value.talla || !sale.value.product) return []
  return variants.value.filter(v =>
    v.product_id === sale.value.product.id &&
    v.talla === sale.value.talla &&
    v.quantity > 0
  )
})

const getBgGradient = (tipo) => {
  const t = tipo?.normalize('NFD').replace(/[\u0300-\u036f]/g, '') || ''
  return {
    'Vestido': 'linear-gradient(135deg, #f472b6, #ec4899)',
    'Blusa': 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    'Pantalon': 'linear-gradient(135deg, #60a5fa, #3b82f6)',
    'Falda': 'linear-gradient(135deg, #f0abfc, #c026d3)',
    'Accesorio': 'linear-gradient(135deg, #fbbf24, #f59e0b)',
  }[t] || 'linear-gradient(135deg, #6b7280, #4b5563)'
}

const selectProduct = (p) => { sale.value.product = p; sale.value.talla = ''; sale.value.color = null; step.value = 2 }
const selectTalla = (t) => { sale.value.talla = t; sale.value.color = null; step.value = 3 }
const selectColor = (v) => { sale.value.color = v; sale.value.inventoryId = v.id; step.value = 4 }

const authHeaders = () => ({ Authorization: `Bearer ${token.value}` })

const loadData = async () => {
  const [prods, stats, sales] = await Promise.all([
    $fetch(`${config.public.apiBase}/products/my-shop/all`, { headers: authHeaders() }),
    $fetch(`${config.public.apiBase}/sales/today`, { headers: authHeaders() }),
    $fetch(`${config.public.apiBase}/sales?limit=8`, { headers: authHeaders() })
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
    setTimeout(() => {
      saleMessage.value = null
      step.value = 1
      sale.value = { product: null, talla: '', color: null, inventoryId: '' }
    }, 2000)
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
