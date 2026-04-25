<template>
  <div class="min-h-screen" style="background: #FAF7F2;">
    <nav style="background: #1A1208;">
      <div class="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 class="font-bold tracking-widest uppercase text-sm" style="color: #FAF7F2; letter-spacing: 0.15em; font-family: Georgia, serif;">TIENDAS FAMILIARES</h1>
          <p class="text-xs tracking-widest" style="color: #C9A96E; font-family: sans-serif; letter-spacing: 0.1em;">TRADICION · ARTESANIA · YUCATAN</p>
        </div>
        <a href="/" class="text-xs border px-3 py-1.5 tracking-wider uppercase transition"
          style="border-color: #4A3520; color: #C9A96E; font-family: sans-serif; letter-spacing: 0.12em;">← Catalogo</a>
      </div>
    </nav>

    <div style="background: #8B5E3C;" class="text-center py-2">
      <p class="text-xs tracking-widest uppercase" style="color: #FAF7F2; letter-spacing: 0.25em; font-family: sans-serif;">
        Contactanos por WhatsApp para hacer tu pedido
      </p>
    </div>

    <div class="max-w-5xl mx-auto px-6 py-4">
      <p class="text-xs" style="color: #8B7355; font-family: sans-serif;">
        <a href="/" style="color: #8B5E3C;">Inicio</a>
        <span class="mx-2">/</span>
        <span style="color: #1A1208;">{{ product?.modelo }}</span>
      </p>
    </div>

    <div v-if="loading" class="flex justify-center py-32">
      <div class="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style="border-color: #8B5E3C; border-top-color: transparent;"></div>
    </div>

    <div v-else-if="product" class="max-w-5xl mx-auto px-6 pb-16">
      <div class="bg-white" style="border: 1px solid #E8DFD0;">
        <div class="grid grid-cols-1 md:grid-cols-2">
          <!-- Image -->
          <div style="background: #EDE8DF; min-height: 420px;" class="flex items-center justify-center overflow-hidden">
            <img v-if="product.image_urls?.[0]"
              :src="product.image_urls[0]"
              :alt="product.modelo"
              class="w-full object-cover transition-transform duration-700 hover:scale-105"
              style="height: 480px; object-position: top;"
              @error="handleImgError" />
            <div v-else class="text-center">
              <p class="text-5xl font-bold tracking-widest" style="color: #C9A96E; font-family: Georgia, serif;">{{ product.tipo?.[0] }}</p>
              <p class="text-xs tracking-widest uppercase mt-2" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.2em;">{{ product.tipo }}</p>
            </div>
          </div>

          <!-- Info -->
          <div class="p-8 flex flex-col" style="border-left: 1px solid #E8DFD0;">
            <p class="text-xs tracking-widest uppercase mb-2" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.2em;">{{ product.shop_name }}</p>
            <h1 class="text-3xl font-bold mb-3" style="font-family: Georgia, serif; color: #1A1208; letter-spacing: 0.03em;">{{ product.modelo }}</h1>
            <p class="text-3xl font-bold mb-5" style="font-family: Georgia, serif; color: #8B5E3C;">${{ formatPrice(product.price) }}</p>

            <div style="border-top: 1px solid #E8DFD0; padding-top: 1.25rem; margin-bottom: 1.25rem;">
              <p class="text-sm leading-relaxed" style="color: #5C4A32; font-family: sans-serif;">{{ product.description }}</p>
            </div>

            <div class="mb-5">
              <p class="text-xs tracking-widest uppercase mb-3" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.15em;">Talla</p>
              <div class="flex flex-wrap gap-2">
                <button v-for="talla in availableTallas" :key="talla"
                  @click="selectedTalla = talla; selectedColor = ''"
                  class="px-4 py-2 text-sm border transition"
                  :style="selectedTalla === talla
                    ? 'border-color: #1A1208; background: #1A1208; color: #FAF7F2; font-family: Georgia, serif;'
                    : 'border-color: #D4C4A8; color: #1A1208; font-family: Georgia, serif;'">
                  {{ talla }}
                </button>
              </div>
            </div>

            <div v-if="selectedTalla" class="mb-5">
              <p class="text-xs tracking-widest uppercase mb-3" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.15em;">Color</p>
              <div class="flex flex-wrap gap-2">
                <button v-for="v in availableColors" :key="v.id"
                  @click="selectedColor = v.id"
                  class="px-4 py-2 text-sm border transition"
                  :style="selectedColor === v.id
                    ? 'border-color: #1A1208; background: #1A1208; color: #FAF7F2; font-family: sans-serif;'
                    : 'border-color: #D4C4A8; color: #1A1208; font-family: sans-serif;'">
                  {{ v.color }}
                  <span class="text-xs opacity-60 ml-1">({{ v.quantity }})</span>
                </button>
              </div>
            </div>

            <div v-if="selectedColor" class="mb-5 px-4 py-3" style="background: #F5F0E8; border-left: 3px solid #C9A96E;">
              <p class="text-xs" style="color: #5C4A32; font-family: sans-serif;">Disponible · Listo para pedir</p>
            </div>

            <div class="mt-auto space-y-3">
              <button @click="contactWhatsApp"
                class="w-full py-4 text-sm tracking-widest uppercase transition active:scale-95"
                style="background: #1A1208; color: #C9A96E; font-family: sans-serif; letter-spacing: 0.2em;">
                Pedir por WhatsApp
              </button>
              <a href="/"
                class="block w-full text-center py-2 text-xs tracking-wider uppercase"
                style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.15em;">
                Ver mas productos
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Stock grid -->
      <div v-if="product.variants?.length" class="mt-6 bg-white p-6" style="border: 1px solid #E8DFD0;">
        <p class="text-xs tracking-widest uppercase mb-4" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.18em;">Stock Disponible</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div v-for="v in product.variants.filter(v => v.quantity > 0)" :key="v.id"
            class="text-center p-3" style="border: 1px solid #E8DFD0;">
            <p class="font-bold text-sm" style="font-family: Georgia, serif; color: #1A1208;">{{ v.talla }}</p>
            <p class="text-xs mt-0.5" style="color: #8B7355; font-family: sans-serif;">{{ v.color }}</p>
            <p class="text-xs font-bold mt-1" style="color: #5C8A3C; font-family: sans-serif;">{{ v.quantity }} piezas</p>
          </div>
        </div>
      </div>
    </div>

    <footer style="background: #1A1208; color: #C9A96E;" class="py-10">
      <div class="max-w-5xl mx-auto px-6 text-center">
        <p class="tracking-widest uppercase text-sm" style="letter-spacing: 0.2em; font-family: Georgia, serif;">Tiendas Familiares</p>
        <p class="text-xs mt-1 tracking-widest" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.15em;">Tradicion yucateca · Hecho con amor</p>
      </div>
    </footer>
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
const handleImgError = (e) => { e.target.style.display = 'none' }
const contactWhatsApp = () => {
  if (!product.value) return
  const colorVariant = product.value.variants?.find(v => v.id === selectedColor.value)
  const details = selectedTalla.value ? ` en talla ${selectedTalla.value}${colorVariant ? `, color ${colorVariant.color}` : ''}` : ''
  const msg = encodeURIComponent(`Hola, me interesa ${product.value.modelo}${details} de ${product.value.shop_name}`)
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
