<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white border-b">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-400">
        <NuxtLink to="/" class="hover:text-violet-600 transition">Inicio</NuxtLink>
        <span>/</span>
        <span class="text-gray-700">{{ product?.modelo }}</span>
      </div>
    </div>
    <div v-if="loading" class="flex justify-center py-32">
      <div class="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
    </div>
    <div v-else-if="product" class="max-w-5xl mx-auto px-6 py-10">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div :style="{ background: getBgGradient(product.tipo) }"
            class="h-80 md:h-full min-h-72 flex flex-col items-center justify-center text-white relative overflow-hidden">
            <div class="absolute inset-0 opacity-10" style="background-image: repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%); background-size: 12px 12px;"></div>
            <span class="text-9xl mb-3 relative z-10">{{ getEmoji(product.tipo) }}</span>
            <span class="text-sm font-semibold uppercase tracking-widest opacity-80 relative z-10">{{ product.tipo }}</span>
          </div>
          <div class="p-8 flex flex-col">
            <div class="mb-6">
              <p class="text-xs text-violet-500 font-semibold uppercase tracking-wider mb-1">{{ product.shop_name }}</p>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.modelo }}</h1>
              <p class="text-4xl font-bold text-violet-600">${{ formatPrice(product.price) }}</p>
            </div>
            <div v-if="product.description" class="mb-6">
              <p class="text-gray-500 text-sm leading-relaxed">{{ product.description }}</p>
            </div>
            <div class="mb-4">
              <p class="text-sm font-semibold text-gray-700 mb-3">Talla</p>
              <div class="flex flex-wrap gap-2">
                <button v-for="talla in availableTallas" :key="talla"
                  @click="selectedTalla = talla; selectedColor = ''"
                  :class="selectedTalla === talla ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-700 border-gray-200 hover:border-violet-400'"
                  class="border-2 px-4 py-2 rounded-xl text-sm font-medium transition">
                  {{ talla }}
                </button>
              </div>
            </div>
            <div v-if="selectedTalla" class="mb-6">
              <p class="text-sm font-semibold text-gray-700 mb-3">Color</p>
              <div class="flex flex-wrap gap-2">
                <button v-for="v in availableColors" :key="v.id"
                  @click="selectedColor = v.id"
                  :class="selectedColor === v.id ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-700 border-gray-200 hover:border-violet-400'"
                  class="border-2 px-4 py-2 rounded-xl text-sm font-medium transition">
                  {{ v.color }} <span class="text-xs opacity-70">({{ v.quantity }})</span>
                </button>
              </div>
            </div>
            <div v-if="selectedColor" class="mb-4 p-3 bg-green-50 rounded-xl border border-green-100 text-sm text-green-700 font-medium">
              Disponible - listo para pedir
            </div>
            <div class="mt-auto space-y-3">
              <button @click="contactWhatsApp"
                class="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-base transition">
                Pedir por WhatsApp
              </button>
              <NuxtLink to="/" class="block w-full text-center text-violet-600 hover:text-violet-800 py-2 text-sm font-medium">
                Ver mas productos
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <div v-if="product.variants?.length" class="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="font-bold text-gray-800 mb-4">Stock disponible</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div v-for="v in product.variants.filter(v => v.quantity > 0)" :key="v.id"
            class="text-center p-3 rounded-xl border border-gray-100 bg-gray-50">
            <p class="font-semibold text-gray-700 text-sm">{{ v.talla }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ v.color }}</p>
            <p class="text-xs font-medium text-green-600 mt-1">{{ v.quantity }} disponibles</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const product = ref(null)
const loading = ref(true)
const selectedTalla = ref('')
const selectedColor = ref('')
const availableTallas = computed(() => {
  if (!product.value?.variants) return []
  return [...new Set(product.value.variants.filter(v => v.quantity > 0).map(v => v.talla))]
})
const availableColors = computed(() => {
  if (!selectedTalla.value || !product.value?.variants) return []
  return product.value.variants.filter(v => v.talla === selectedTalla.value && v.quantity > 0)
})
const formatPrice = (p) => parseFloat(p).toFixed(0)
const getEmoji = (tipo) => {
  const t = tipo?.normalize('NFD').replace(/[\u0300-\u036f]/g, '') || ''
  return { 'Vestido': 'V', 'Blusa': 'B', 'Pantalon': 'P', 'Falda': 'F', 'Accesorio': 'A' }[t] || 'X'
}
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
const contactWhatsApp = () => {
  if (!product.value) return
  const colorVariant = product.value.variants?.find(v => v.id === selectedColor.value)
  const details = selectedTalla.value
    ? ` en talla ${selectedTalla.value}${colorVariant ? `, color ${colorVariant.color}` : ''}`
    : ''
  const msg = encodeURIComponent(`Hola, me interesa el ${product.value.modelo}${details} de ${product.value.shop_name}`)
  const phone = product.value.whatsapp_number.replace(/[^0-9]/g, '')
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
}
onMounted(async () => {
  try {
    const data = await $fetch(`${config.public.apiBase}/products/${route.params.id}`)
    product.value = data.product
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>
