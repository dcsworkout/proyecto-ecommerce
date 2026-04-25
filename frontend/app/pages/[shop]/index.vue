<template>
  <div class="min-h-screen" style="background: #FAF7F2; color: #1A1208; font-family: 'Georgia', serif;">

    <header style="background: #1A1208;" class="text-white">
      <div class="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div>
          <NuxtLink to="/" class="block">
            <h1 class="text-2xl font-bold tracking-widest uppercase" style="letter-spacing: 0.15em;">Tiendas Familiares</h1>
            <p class="text-xs tracking-widest uppercase mt-0.5" style="color: #C9A96E; letter-spacing: 0.2em;">Tradicion · Artesania · Yucatan</p>
          </NuxtLink>
        </div>
        <a href="/login" class="text-xs tracking-widest uppercase border border-white/30 px-4 py-2 hover:border-white transition" style="font-family: sans-serif;">
          Administrar
        </a>
      </div>
    </header>

    <div style="background: #E8D5B0;" class="text-center py-3">
      <p class="text-xs tracking-widest uppercase" style="letter-spacing: 0.25em; font-family: sans-serif;">
        Contactanos por WhatsApp para hacer tu pedido
      </p>
    </div>

    <div style="background: #FAF7F2; border-bottom: 1px solid #E8DFD0;" class="sticky top-0 z-20">
      <div class="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-3 items-center">
        <input v-model="filters.search" @input="loadProducts" type="text"
          placeholder="Buscar..."
          class="flex-1 min-w-48 px-4 py-2 text-sm border focus:outline-none"
          style="border-color: #D4C4A8; background: white; font-family: sans-serif; color: #1A1208;" />
        <select v-model="filters.tipo" @change="loadProducts"
          class="px-4 py-2 text-sm border focus:outline-none"
          style="border-color: #D4C4A8; background: white; font-family: sans-serif; color: #1A1208;">
          <option value="">Todas las categorias</option>
          <option v-for="cat in categories" :key="cat.tipo" :value="cat.tipo">{{ cat.tipo }}</option>
        </select>
        <select v-model="filters.talla" @change="loadProducts"
          class="px-4 py-2 text-sm border focus:outline-none"
          style="border-color: #D4C4A8; background: white; font-family: sans-serif; color: #1A1208;">
          <option value="">Todas las tallas</option>
          <option value="XS">XS</option><option value="S">S</option>
          <option value="M">M</option><option value="L">L</option>
          <option value="XL">XL</option><option value="UNICA">Unica</option>
        </select>
        <button v-if="hasFilters" @click="clearFilters"
          class="text-sm px-3 py-2 hover:underline"
          style="color: #8B5E3C; font-family: sans-serif;">
          Limpiar
        </button>
      </div>
    </div>

    <main class="max-w-6xl mx-auto px-6 py-10">
      <div v-if="loading" class="text-center py-24">
        <div class="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style="border-color: #8B5E3C; border-top-color: transparent;"></div>
      </div>

      <div v-else-if="products.length === 0" class="text-center py-24">
        <p style="color: #8B5E3C; font-family: sans-serif;" class="text-sm tracking-widest uppercase">Sin resultados</p>
      </div>

      <div v-else>
        <p class="text-xs mb-8 tracking-widest uppercase" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.2em;">
          {{ products.length }} piezas disponibles
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink v-for="product in products" :key="product.id" :to="`/${shop}/producto/${product.id}`"
            class="group block cursor-pointer">
            <div class="overflow-hidden mb-4" style="background: #EDE8DF;">
              <img v-if="product.image_urls?.[0]"
                :src="product.image_urls[0]" :alt="product.modelo"
                class="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style="height: 380px; object-position: top;" @error="handleImgError" />
              <div v-else class="flex items-center justify-center" style="height: 380px;">
                <span class="text-4xl tracking-widest" style="color: #C9A96E;">{{ getInitial(product.tipo) }}</span>
              </div>
            </div>
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-sm font-bold tracking-wide mb-0.5" style="letter-spacing: 0.05em;">{{ product.modelo }}</h3>
                <p class="text-xs" style="color: #8B5E3C; font-family: sans-serif;">{{ product.shop_name }}</p>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span v-for="(c, i) in (product.available_colors || []).slice(0, 3)" :key="i"
                    class="text-xs px-2 py-0.5 border"
                    style="border-color: #D4C4A8; color: #5C4A32; font-family: sans-serif;">{{ c }}</span>
                </div>
              </div>
              <p class="text-sm font-bold shrink-0 ml-4" style="color: #1A1208;">${{ formatPrice(product.price) }}</p>
            </div>
            <button @click.prevent="contactWhatsApp(product)"
              class="mt-4 w-full py-3 text-xs tracking-widest uppercase transition border"
              style="border-color: #1A1208; color: #1A1208; font-family: sans-serif; letter-spacing: 0.15em; background: transparent;"
              onmouseover="this.style.background='#1A1208'; this.style.color='white';"
              onmouseout="this.style.background='transparent'; this.style.color='#1A1208';">
              Consultar por WhatsApp
            </button>
          </NuxtLink>
        </div>
      </div>
    </main>

    <footer style="background: #1A1208; color: #C9A96E;" class="py-12 mt-16">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <p class="text-xl tracking-widest uppercase mb-2" style="letter-spacing: 0.2em;">Tiendas Familiares</p>
        <p class="text-xs tracking-widest" style="font-family: sans-serif; color: #8B7355; letter-spacing: 0.15em;">Tradicion yucateca · Hecho con amor</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const route = useRoute()
const shop = route.params.shop
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
    const r = await fetchProducts({ ...clean, shop_slug: shop })
    products.value = r.products || []
  } catch (e) { products.value = [] }
  finally { loading.value = false }
}

const loadCategories = async () => {
  try { const r = await fetchCategories(shop); categories.value = r.categories || [] } catch (e) {}
}

const clearFilters = () => { filters.value = { search: '', tipo: '', talla: '' }; loadProducts() }
const formatPrice = (p) => parseFloat(p).toFixed(0)
const getInitial = (tipo) => tipo?.[0] || '·'
const handleImgError = (e) => { e.target.style.display = 'none' }
const contactWhatsApp = (product) => {
  const msg = encodeURIComponent(`Hola, me interesa ${product.modelo} de ${product.shop_name}`)
  const phone = product.whatsapp_number.replace(/[^0-9]/g, '')
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
}

onMounted(() => { loadProducts(); loadCategories() })
</script>
