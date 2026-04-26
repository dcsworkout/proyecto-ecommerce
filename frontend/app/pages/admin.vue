<template>
  <div class="min-h-screen" style="background: #F5EFE6;">

    <!-- Welcome Modal -->
    <div v-if="showWelcome" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(26,18,8,0.85);">
      <div class="bg-white max-w-md w-full p-8 relative" style="border-top: 3px solid #C9A96E;">
        <div class="text-center mb-6">
          <p class="text-xs tracking-widest uppercase mb-4" style="color: #C9A96E; letter-spacing: 0.2em; font-family: sans-serif;">Bienvenido a</p>
          <h2 class="text-2xl font-bold mb-1" style="font-family: Georgia, serif; color: #1A1208; letter-spacing: 0.08em;">TIENDAS FAMILIARES</h2>
          <p class="text-xs tracking-widest" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.15em;">TRADICION · ARTESANIA · YUCATAN</p>
        </div>
        <div style="border-top: 1px solid #E8DFD0; border-bottom: 1px solid #E8DFD0; padding: 1.5rem 0; margin-bottom: 1.5rem;">
          <p style="font-family: Georgia, serif; color: #1A1208; font-size: 15px; line-height: 1.8; text-align: center;">
            Hola <strong>{{ user?.full_name?.split(' ')[0] }}</strong>, este proyecto fue desarrollado para ti con todo mi amor.
          </p>
          <p style="font-family: sans-serif; color: #5C4A32; font-size: 13px; line-height: 1.8; text-align: center; margin-top: 1rem;">
            Porque lo unico que me interesa es ver a mi familia prosperar. Cada venta que registres aqui, cada producto que agregues, cada cliente que contacte por WhatsApp — todo eso es su esfuerzo convertido en resultados reales.
          </p>
          <p style="font-family: sans-serif; color: #5C4A32; font-size: 13px; line-height: 1.8; text-align: center; margin-top: 1rem;">
            Este sistema fue construido especialmente para ustedes por el Ingeniero y futuro Arquitecto de Software
          </p>
          <p style="font-family: Georgia, serif; color: #8B5E3C; font-size: 15px; text-align: center; margin-top: 0.5rem; font-style: italic;">
            David CS
          </p>
        </div>
        <button @click="dismissWelcome"
          class="w-full py-3 text-xs tracking-widest uppercase transition"
          style="background: #1A1208; color: #C9A96E; font-family: sans-serif; letter-spacing: 0.2em;">
          Comenzar
        </button>
      </div>
    </div>

    <!-- Nav -->
    <nav style="background: #1A1208; border-bottom: 2px solid #C9A96E;">
      <div class="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 class="font-bold tracking-widest uppercase text-sm" style="color: #FAF7F2; letter-spacing: 0.15em; font-family: Georgia, serif;">Panel Admin</h1>
          <p class="text-xs tracking-widest mt-0.5" style="color: #C9A96E; font-family: sans-serif; letter-spacing: 0.1em;">{{ user?.shop?.name }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs hidden sm:block" style="color: #8B7355; font-family: sans-serif;">{{ user?.full_name }}</span>
          <a :href="`/${user?.shop?.slug}`" class="text-xs border px-3 py-1.5 tracking-wider uppercase transition hover:border-white"
            style="border-color: #4A3520; color: #C9A96E; font-family: sans-serif; letter-spacing: 0.12em;">Catalogo</a>
          <button @click="logout" class="text-xs border px-3 py-1.5 tracking-wider uppercase transition hover:border-white"
            style="border-color: #4A3520; color: #8B7355; font-family: sans-serif; letter-spacing: 0.12em;">Salir</button>
        </div>
      </div>
    </nav>

    <!-- Tab bar -->
    <div style="background: #1A1208; border-bottom: 2px solid #C9A96E;">
      <div class="max-w-5xl mx-auto px-2 flex gap-0 overflow-x-auto">
        <button @click="activeTab = 'ventas'"
          class="px-3 py-3 text-xs tracking-widest uppercase transition whitespace-nowrap flex-1 text-center"
          :style="activeTab === 'ventas' ? 'color: #C9A96E; border-bottom: 2px solid #C9A96E; margin-bottom: -2px; font-family: sans-serif; letter-spacing: 0.15em; background: rgba(201,169,110,0.1);' : 'color: #8B7355; font-family: sans-serif; letter-spacing: 0.15em;'">
          Registrar Venta
        </button>
        <button @click="activeTab = 'domingo'"
          class="px-3 py-3 text-xs tracking-widest uppercase transition whitespace-nowrap flex-1 text-center"
          :style="activeTab === 'domingo' ? 'color: #C9A96E; border-bottom: 2px solid #C9A96E; margin-bottom: -2px; font-family: sans-serif; letter-spacing: 0.15em; background: rgba(201,169,110,0.1);' : 'color: #8B7355; font-family: sans-serif; letter-spacing: 0.15em;'">
          Mi Domingo
        </button>
        <button @click="activeTab = 'productos'"
          class="px-3 py-3 text-xs tracking-widest uppercase transition whitespace-nowrap flex-1 text-center"
          :style="activeTab === 'productos' ? 'color: #C9A96E; border-bottom: 2px solid #C9A96E; margin-bottom: -2px; font-family: sans-serif; letter-spacing: 0.15em; background: rgba(201,169,110,0.1);' : 'color: #8B7355; font-family: sans-serif; letter-spacing: 0.15em;'">
          Mis Productos
        </button>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 py-6">

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="p-4 text-center" style="background: white; border: 1px solid #D4C4A8;">
          <p class="text-xs tracking-widest uppercase mb-1" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.12em;">Ventas hoy</p>
          <p class="text-3xl font-bold" style="color: #1A1208; font-family: Georgia, serif;">{{ todayStats.sales_count || 0 }}</p>
        </div>
        <div class="p-4 text-center" style="background: white; border: 1px solid #D4C4A8; box-shadow: 0 1px 3px rgba(26,18,8,0.06);">
          <p class="text-xs tracking-widest uppercase mb-1" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.12em;">Items</p>
          <p class="text-3xl font-bold" style="color: #1A1208; font-family: Georgia, serif;">{{ todayStats.items_sold || 0 }}</p>
        </div>
        <div class="p-4 text-center" style="background: white; border: 1px solid #D4C4A8; box-shadow: 0 1px 3px rgba(26,18,8,0.06);">
          <p class="text-xs tracking-widest uppercase mb-1" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.12em;">Ingresos</p>
          <p class="text-2xl font-bold" style="color: #1A1208; font-family: Georgia, serif;">${{ todayStats.revenue || 0 }}</p>
        </div>
      </div>

      <!-- VENTAS TAB -->
      <div v-if="activeTab === 'ventas'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="p-6" style="background: white; border: 1px solid #D4C4A8; box-shadow: 0 1px 3px rgba(26,18,8,0.06);">
          <p class="text-xs tracking-widest uppercase mb-4" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.18em;">Registrar Venta</p>

          <div v-if="step === 1">
            <p class="text-xs mb-3" style="color: #8B7355; font-family: sans-serif;">Selecciona el producto</p>
            <div class="grid grid-cols-1 gap-2">
              <button v-for="p in products" :key="p.id" @click="selectProduct(p)"
                class="text-left p-4 border transition active:scale-95 w-full"
                style="border-color: #D4C4A8; background: #FDFAF6;" onmouseover="this.style.background='#F5EDE0'; this.style.borderColor='#8B5E3C'" onmouseout="this.style.background='#FDFAF6'; this.style.borderColor='#D4C4A8'">
                <div class="flex justify-between items-center"><p class="font-bold text-sm" style="font-family: Georgia, serif; color: #1A1208;">{{ p.modelo }}</p><span style="color: #8B5E3C; font-size: 18px;">→</span></div>
                <p class="text-xs mt-0.5" style="color: #8B5E3C; font-family: sans-serif;">${{ parseFloat(p.price).toFixed(0) }} · {{ p.tipo }}</p>
              </button>
            </div>
          </div>

          <div v-if="step === 2">
            <button @click="step = 1" class="text-xs mb-4 flex items-center gap-1" style="color: #8B5E3C; font-family: sans-serif;">← Atras</button>
            <p class="text-xs mb-3" style="color: #8B7355; font-family: sans-serif;">{{ sale.product?.modelo }} — Selecciona talla</p>
            <div class="grid grid-cols-4 gap-2">
              <button v-for="t in availableTallas" :key="t" @click="selectTalla(t)"
                class="py-4 text-sm font-bold border transition active:scale-95"
                style="border-color: #E8DFD0; color: #1A1208; font-family: Georgia, serif;">
                {{ t }}
              </button>
            </div>
          </div>

          <div v-if="step === 3">
            <button @click="step = 2" class="text-xs mb-4 flex items-center gap-1" style="color: #8B5E3C; font-family: sans-serif;">← Atras</button>
            <p class="text-xs mb-3" style="color: #8B7355; font-family: sans-serif;">Talla {{ sale.talla }} — Selecciona color</p>
            <div class="grid grid-cols-2 gap-2">
              <button v-for="v in availableColors" :key="v.id" @click="selectColor(v)"
                class="p-3 text-left border transition active:scale-95"
                style="border-color: #D4C4A8; background: #FDFAF6;" onmouseover="this.style.background='#F5EDE0'; this.style.borderColor='#8B5E3C'" onmouseout="this.style.background='#FDFAF6'; this.style.borderColor='#D4C4A8'">
                <p class="text-sm font-bold" style="color: #1A1208; font-family: Georgia, serif;">{{ v.color }}</p>
                <p class="text-xs" style="color: #8B7355; font-family: sans-serif;">{{ v.quantity }} disponibles</p>
              </button>
            </div>
          </div>

          <div v-if="step === 4">
            <button @click="step = 3" class="text-xs mb-4 flex items-center gap-1" style="color: #8B5E3C; font-family: sans-serif;">← Atras</button>
            <div class="p-4 mb-4" style="background: #FAF7F2; border: 1px solid #E8DFD0;">
              <p class="text-xs tracking-widest uppercase mb-2" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.15em;">Confirmar venta</p>
              <p class="text-xl font-bold" style="font-family: Georgia, serif; color: #1A1208;">{{ sale.product?.modelo }}</p>
              <p class="text-sm mt-1" style="color: #5C4A32; font-family: sans-serif;">Talla {{ sale.talla }} · {{ sale.color?.color }}</p>
              <div class="mt-3"><p class="text-xs tracking-widest uppercase mb-1" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.1em;">Precio de venta</p><div class="flex items-center gap-2"><span class="text-xl font-bold" style="color: #8B5E3C; font-family: Georgia, serif;">$</span><input v-model="salePrice" type="number" min="0" class="text-2xl font-bold border-b-2 bg-transparent focus:outline-none w-28" style="font-family: Georgia, serif; color: #8B5E3C; border-color: #C9A96E;" /></div><p v-if="salePrice != parseFloat(sale.product?.price || 0)" class="text-xs mt-1" style="color: #8B7355; font-family: sans-serif;">Precio original: ${{ parseFloat(sale.product?.price || 0).toFixed(0) }}</p></div>
            </div>
            <div v-if="saleMessage" :class="saleMessage.type === 'success' ? 'border-green-200 text-green-700' : 'border-red-200 text-red-700'"
              class="px-4 py-3 border text-sm mb-3" style="font-family: sans-serif; background: #FAF7F2;">
              {{ saleMessage.text }}
            </div>
            <button @click="registerSale" :disabled="registering"
              class="w-full py-4 text-xs tracking-widest uppercase transition disabled:opacity-50 active:scale-95"
              style="background: #1A1208; color: #C9A96E; font-family: sans-serif; letter-spacing: 0.2em;">
              {{ registering ? 'Registrando...' : 'Confirmar Venta' }}
            </button>
          </div>
        </div>

        <!-- Recent sales -->
        <div class="p-6" style="background: white; border: 1px solid #D4C4A8; box-shadow: 0 1px 3px rgba(26,18,8,0.06);">
          <p class="text-xs tracking-widest uppercase mb-4" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.18em;">Ventas Recientes</p>
          <div v-if="recentSales.length === 0" class="text-center py-10">
            <p class="text-sm" style="color: #C9B99A; font-family: sans-serif;">Sin ventas aun</p>
          </div>
          <div v-else class="space-y-2">
            <div v-for="s in recentSales" :key="s.id" class="flex justify-between items-center py-3"
              style="border-bottom: 1px solid #F0E8DC;">
              <div>
                <p class="text-sm font-bold" style="font-family: Georgia, serif; color: #1A1208;">{{ s.modelo }}</p>
                <p class="text-xs mt-0.5" style="color: #8B7355; font-family: sans-serif;">{{ s.talla }} · {{ s.color }} · {{ s.seller_name }}</p>
              </div>
              <span class="text-sm font-bold" style="color: #5C8A3C; font-family: Georgia, serif;">${{ parseFloat(s.total_amount).toFixed(0) }}</span>
            </div>
          </div>
        </div>
      </div>


      <!-- DOMINGO TAB -->
      <div v-if="activeTab === 'domingo'">

        <!-- Esta semana vs semana pasada -->
        <div class="grid grid-cols-3 gap-3 mb-6">
          <div class="p-4 text-center" style="background: white; border: 1px solid #D4C4A8;">
            <p class="text-xs tracking-widest uppercase mb-1" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.12em;">Ventas semana</p>
            <p class="text-3xl font-bold" style="color: #1A1208; font-family: Georgia, serif;">{{ weekStats.this_week?.sales_count || 0 }}</p>
            <p class="text-xs mt-1" :style="weekDiff('sales_count') >= 0 ? 'color: #5C8A3C' : 'color: #B85C5C'" style="font-family: sans-serif;">
              {{ weekDiff('sales_count') >= 0 ? '▲' : '▼' }} {{ Math.abs(weekDiff('sales_count')) }} vs semana pasada
            </p>
          </div>
          <div class="p-4 text-center" style="background: white; border: 1px solid #D4C4A8;">
            <p class="text-xs tracking-widest uppercase mb-1" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.12em;">Items semana</p>
            <p class="text-3xl font-bold" style="color: #1A1208; font-family: Georgia, serif;">{{ weekStats.this_week?.items_sold || 0 }}</p>
            <p class="text-xs mt-1" :style="weekDiff('items_sold') >= 0 ? 'color: #5C8A3C' : 'color: #B85C5C'" style="font-family: sans-serif;">
              {{ weekDiff('items_sold') >= 0 ? '▲' : '▼' }} {{ Math.abs(weekDiff('items_sold')) }} vs semana pasada
            </p>
          </div>
          <div class="p-4 text-center" style="background: white; border: 1px solid #D4C4A8;">
            <p class="text-xs tracking-widest uppercase mb-1" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.12em;">Ingresos semana</p>
            <p class="text-2xl font-bold" style="color: #1A1208; font-family: Georgia, serif;">${{ parseFloat(weekStats.this_week?.revenue || 0).toFixed(0) }}</p>
            <p class="text-xs mt-1" :style="weekDiff('revenue') >= 0 ? 'color: #5C8A3C' : 'color: #B85C5C'" style="font-family: sans-serif;">
              {{ weekDiff('revenue') >= 0 ? '▲' : '▼' }} ${{ Math.abs(weekDiff('revenue')).toFixed(0) }} vs semana pasada
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          <!-- Top productos -->
          <div class="p-6" style="background: white; border: 1px solid #D4C4A8;">
            <p class="text-xs tracking-widest uppercase mb-4" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.18em;">Top Productos (últimas 2 semanas)</p>
            <div v-if="!weekStats.top_products?.length" class="text-center py-8">
              <p class="text-sm" style="color: #C9B99A; font-family: sans-serif;">Sin ventas aun</p>
            </div>
            <div v-else class="space-y-3">
              <div v-for="(p, i) in weekStats.top_products" :key="i">
                <div class="flex justify-between items-center mb-1">
                  <p class="text-sm font-bold" style="font-family: Georgia, serif; color: #1A1208;">{{ p.modelo }}</p>
                  <span class="text-xs" style="color: #8B5E3C; font-family: sans-serif;">{{ p.unidades }} uds</span>
                </div>
                <div style="background: #F0E8DC; height: 6px; border-radius: 0;">
                  <div :style="`width: ${(p.unidades / weekStats.top_products[0].unidades) * 100}%; background: #8B5E3C; height: 6px;`"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mejores dias -->
          <div class="p-6" style="background: white; border: 1px solid #D4C4A8;">
            <p class="text-xs tracking-widest uppercase mb-4" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.18em;">Mejores Días (últimas 4 semanas)</p>
            <div v-if="!weekStats.by_day?.length" class="text-center py-8">
              <p class="text-sm" style="color: #C9B99A; font-family: sans-serif;">Sin datos aun</p>
            </div>
            <div v-else class="space-y-3">
              <div v-for="(d, i) in weekStats.by_day" :key="i">
                <div class="flex justify-between items-center mb-1">
                  <p class="text-sm" style="font-family: sans-serif; color: #1A1208;">{{ d.nombre_dia?.trim() }}</p>
                  <span class="text-xs" style="color: #8B5E3C; font-family: sans-serif;">{{ d.ventas }} ventas</span>
                </div>
                <div style="background: #F0E8DC; height: 6px;">
                  <div :style="`width: ${(d.ventas / weekStats.by_day[0].ventas) * 100}%; background: #C9A96E; height: 6px;`"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Utilidad calculator -->
        <div class="p-6" style="background: white; border: 1px solid #D4C4A8;">
          <p class="text-xs tracking-widest uppercase mb-1" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.18em;">Calculadora de Utilidad</p>
          <p class="text-xs mb-5" style="color: #8B7355; font-family: sans-serif;">Ingresa el costo de cada producto para calcular tu ganancia real esta semana</p>

          <div v-if="!costsData.products?.length" class="text-center py-8">
            <p class="text-sm" style="color: #C9B99A; font-family: sans-serif;">Sin productos registrados</p>
          </div>
          <div v-else>
            <div class="space-y-3 mb-6">
              <div v-for="p in costsData.products" :key="p.id" class="grid grid-cols-3 gap-3 items-center py-3" style="border-bottom: 1px solid #F0E8DC;">
                <div>
                  <p class="text-sm font-bold" style="font-family: Georgia, serif; color: #1A1208;">{{ p.modelo }}</p>
                  <p class="text-xs" style="color: #8B7355; font-family: sans-serif;">Venta: ${{ parseFloat(p.price).toFixed(0) }}</p>
                </div>
                <div>
                  <label class="text-xs block mb-1" style="color: #8B7355; font-family: sans-serif;">Costo compra</label>
                  <input type="number" :value="getCost(p.id, 'costo_compra')" @input="setCost(p.id, 'costo_compra', $event.target.value)"
                    placeholder="0"
                    class="w-full px-3 py-2 border text-sm focus:outline-none"
                    style="border-color: #E8DFD0; font-family: sans-serif; color: #1A1208;" />
                </div>
                <div class="text-right">
                  <button @click="saveCost(p.id)"
                    class="px-3 py-2 text-xs tracking-widest uppercase"
                    style="background: #1A1208; color: #C9A96E; font-family: sans-serif;">
                    Guardar
                  </button>
                </div>
              </div>
            </div>

            <!-- Utilidad neta -->
            <div class="p-4" style="background: #FAF7F2; border: 1px solid #E8DFD0;">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-xs tracking-widest uppercase mb-1" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.15em;">Utilidad neta estimada esta semana</p>
                  <p class="text-xs" style="color: #8B7355; font-family: sans-serif;">Ingresos ${{ parseFloat(weekStats.this_week?.revenue || 0).toFixed(0) }} − costos registrados</p>
                </div>
                <p class="text-3xl font-bold" :style="utilidadNeta >= 0 ? 'color: #5C8A3C' : 'color: #B85C5C'" style="font-family: Georgia, serif;">
                  ${{ utilidadNeta.toFixed(0) }}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- PRODUCTOS TAB -->
      <div v-if="activeTab === 'productos'">

        <!-- Agregar producto -->
        <div class="p-6 mb-6" style="background: white; border: 1px solid #D4C4A8;">
          <p class="text-xs tracking-widest uppercase mb-5" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.18em;">Agregar Producto</p>

          <!-- Image upload -->
          <div class="mb-4">
            <label class="text-xs tracking-wider uppercase block mb-1.5" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.1em;">Foto del producto</label>
            <div v-if="newProduct.image_url" class="mb-2 relative">
              <img :src="newProduct.image_url" class="w-full object-cover" style="height: 180px; object-position: top;" />
              <button @click="newProduct.image_url = ''" class="absolute top-2 right-2 text-xs px-2 py-1" style="background: #1A1208; color: #FAF7F2; font-family: sans-serif;">✕</button>
            </div>
            <div v-else>
              <input type="file" accept="image/*" @change="uploadImage($event, 'new')" ref="fileInput"
                class="hidden" id="fileInput" />
              <label for="fileInput" class="flex flex-col items-center justify-center py-8 border-2 border-dashed cursor-pointer"
                style="border-color: #D4C4A8; font-family: sans-serif;">
                <span class="text-2xl mb-2">📷</span>
                <span class="text-sm" style="color: #8B5E3C;">{{ uploading ? 'Subiendo...' : 'Toca para subir foto' }}</span>
                <span class="text-xs mt-1" style="color: #8B7355;">JPG, PNG o WebP</span>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="text-xs tracking-wider uppercase block mb-1.5" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.1em;">Nombre</label>
              <input v-model="newProduct.modelo" type="text" placeholder="Ej: Vestido Bordado Rosa"
                class="w-full px-4 py-3 border text-sm focus:outline-none"
                style="border-color: #E8DFD0; font-family: sans-serif; color: #1A1208;" />
            </div>
            <div>
              <label class="text-xs tracking-wider uppercase block mb-1.5" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.1em;">Categoria</label>
              <select v-model="newProduct.tipo" class="w-full px-4 py-3 border text-sm focus:outline-none"
                style="border-color: #E8DFD0; font-family: sans-serif; color: #1A1208;">
                <option value="">Seleccionar...</option>
                <option>Vestido</option><option>Blusa</option><option>Pantalon</option>
                <option>Falda</option><option>Accesorio</option><option>Guayabera</option>
              </select>
            </div>
            <div>
              <label class="text-xs tracking-wider uppercase block mb-1.5" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.1em;">Precio (MXN)</label>
              <input v-model="newProduct.price" type="number" placeholder="0"
                class="w-full px-4 py-3 border text-sm focus:outline-none"
                style="border-color: #E8DFD0; font-family: sans-serif; color: #1A1208;" />
            </div>
            <div>
              <label class="text-xs tracking-wider uppercase block mb-1.5" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.1em;">Descripcion</label>
              <input v-model="newProduct.description" type="text" placeholder="Describe el producto..."
                class="w-full px-4 py-3 border text-sm focus:outline-none"
                style="border-color: #E8DFD0; font-family: sans-serif; color: #1A1208;" />
            </div>
          </div>

          <div v-if="productMessage" :class="productMessage.type === 'success' ? 'text-green-700 border-green-200' : 'text-red-700 border-red-200'"
            class="px-4 py-3 border text-sm mb-4" style="font-family: sans-serif; background: #FAF7F2;">
            {{ productMessage.text }}
          </div>
          <button @click="createProduct" :disabled="creatingProduct || uploading"
            class="w-full py-3 text-xs tracking-widest uppercase transition disabled:opacity-50"
            style="background: #1A1208; color: #C9A96E; font-family: sans-serif; letter-spacing: 0.2em;">
            {{ creatingProduct ? 'Guardando...' : 'Agregar Producto' }}
          </button>
        </div>

        <!-- Product list with edit -->
        <div class="p-6" style="background: white; border: 1px solid #D4C4A8;">
          <p class="text-xs tracking-widest uppercase mb-4" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.18em;">Mis Productos ({{ products.length }})</p>
          <div v-if="products.length === 0" class="text-center py-8">
            <p class="text-sm" style="color: #C9B99A; font-family: sans-serif;">Sin productos aun</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="p in products" :key="p.id" style="border: 1px solid #F0E8DC;">

              <!-- Vista normal -->
              <div v-if="editingId !== p.id" class="flex justify-between items-center p-4">
                <div class="flex items-center gap-3">
                  <img v-if="p.image_urls?.[0]" :src="p.image_urls[0]" class="w-12 h-12 object-cover" style="object-position: top;" />
                  <div v-else class="w-12 h-12 flex items-center justify-center" style="background: #EDE8DF;">
                    <span style="color: #C9A96E;">✦</span>
                  </div>
                  <div>
                    <p class="text-sm font-bold" style="font-family: Georgia, serif; color: #1A1208;">{{ p.modelo }}</p>
                    <p class="text-xs mt-0.5" style="color: #8B7355; font-family: sans-serif;">{{ p.tipo }} · ${{ parseFloat(p.price).toFixed(0) }}</p>
                  </div>
                </div>
                <button @click="startEdit(p)" class="text-xs px-3 py-2 border"
                  style="border-color: #D4C4A8; color: #8B5E3C; font-family: sans-serif;">
                  Editar
                </button>
              </div>

              <!-- Vista edición -->
              <div v-else class="p-4">
                <p class="text-xs tracking-widest uppercase mb-3" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.15em;">Editando: {{ p.modelo }}</p>

                <!-- Edit image -->
                <div class="mb-3">
                  <div v-if="editProduct.image_url" class="relative mb-2">
                    <img :src="editProduct.image_url" class="w-full object-cover" style="height: 140px; object-position: top;" />
                    <button @click="editProduct.image_url = ''" class="absolute top-2 right-2 text-xs px-2 py-1" style="background: #1A1208; color: #FAF7F2;">✕</button>
                  </div>
                  <div v-else>
                    <input type="file" accept="image/*" @change="uploadImage($event, 'edit')" :id="`editFile_${p.id}`" class="hidden" />
                    <label :for="`editFile_${p.id}`" class="flex items-center gap-2 py-3 px-4 border border-dashed cursor-pointer"
                      style="border-color: #D4C4A8; font-family: sans-serif;">
                      <span>📷</span>
                      <span class="text-sm" style="color: #8B5E3C;">{{ uploading ? 'Subiendo...' : 'Cambiar foto' }}</span>
                    </label>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label class="text-xs block mb-1" style="color: #8B7355; font-family: sans-serif;">Nombre</label>
                    <input v-model="editProduct.modelo" type="text" class="w-full px-3 py-2 border text-sm focus:outline-none"
                      style="border-color: #E8DFD0; font-family: sans-serif; color: #1A1208;" />
                  </div>
                  <div>
                    <label class="text-xs block mb-1" style="color: #8B7355; font-family: sans-serif;">Precio</label>
                    <input v-model="editProduct.price" type="number" class="w-full px-3 py-2 border text-sm focus:outline-none"
                      style="border-color: #E8DFD0; font-family: sans-serif; color: #1A1208;" />
                  </div>
                  <div>
                    <label class="text-xs block mb-1" style="color: #8B7355; font-family: sans-serif;">Categoria</label>
                    <select v-model="editProduct.tipo" class="w-full px-3 py-2 border text-sm focus:outline-none"
                      style="border-color: #E8DFD0; font-family: sans-serif; color: #1A1208;">
                      <option>Vestido</option><option>Blusa</option><option>Pantalon</option>
                      <option>Falda</option><option>Accesorio</option><option>Guayabera</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs block mb-1" style="color: #8B7355; font-family: sans-serif;">Visible</label>
                    <select v-model="editProduct.is_visible" class="w-full px-3 py-2 border text-sm focus:outline-none"
                      style="border-color: #E8DFD0; font-family: sans-serif; color: #1A1208;">
                      <option :value="true">Visible</option>
                      <option :value="false">Oculto</option>
                    </select>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="text-xs block mb-1" style="color: #8B7355; font-family: sans-serif;">Descripcion</label>
                  <input v-model="editProduct.description" type="text" class="w-full px-3 py-2 border text-sm focus:outline-none"
                    style="border-color: #E8DFD0; font-family: sans-serif; color: #1A1208;" />
                </div>
                <div class="flex gap-2">
                  <button @click="saveEdit(p.id)" :disabled="savingEdit"
                    class="flex-1 py-3 text-xs tracking-widest uppercase disabled:opacity-50"
                    style="background: #1A1208; color: #C9A96E; font-family: sans-serif;">
                    {{ savingEdit ? 'Guardando...' : 'Guardar' }}
                  </button>
                  <button @click="editingId = null"
                    class="px-4 py-3 text-xs border"
                    style="border-color: #D4C4A8; color: #8B7355; font-family: sans-serif;">
                    Cancelar
                  </button>
                </div>
              </div>

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
const step = ref(1)
const sale = ref({ product: null, talla: '', color: null, inventoryId: '' })
const registering = ref(false)
const saleMessage = ref(null)
const salePrice = ref(0)
const activeTab = ref('ventas')
const weekStats = ref({})
const costsData = ref({ products: [], costs: [] })
const costosOperativos = ref(0)
const pendingCosts = ref({})
const showWelcome = ref(false)
const newProduct = ref({ modelo: '', tipo: '', price: '', description: '', image_url: '' })
const creatingProduct = ref(false)
const uploading = ref(false)
const editingId = ref(null)
const editProduct = ref({})
const savingEdit = ref(false)
const productMessage = ref(null)

const availableTallas = computed(() => {
  if (!sale.value.product) return []
  const v = variants.value.filter(v => v.product_id === sale.value.product.id && v.quantity > 0)
  return [...new Set(v.map(v => v.talla))]
})
const availableColors = computed(() => {
  if (!sale.value.talla || !sale.value.product) return []
  return variants.value.filter(v => v.product_id === sale.value.product.id && v.talla === sale.value.talla && v.quantity > 0)
})

const selectProduct = (p) => { sale.value.product = p; sale.value.talla = ''; sale.value.color = null; step.value = 2 }
const selectTalla = (t) => { sale.value.talla = t; sale.value.color = null; step.value = 3 }
const selectColor = (v) => { sale.value.color = v; sale.value.inventoryId = v.id; salePrice.value = parseFloat(sale.value.product?.price || 0); step.value = 4 }
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
  try {
    const inv = await $fetch(`${config.public.apiBase}/inventory/shop/${user.value.shop.id}`, { headers: authHeaders() })
    variants.value = inv.inventory || []
  } catch (e) {}
}

const registerSale = async () => {
  registering.value = true
  saleMessage.value = null
  try {
    const data = await $fetch(`${config.public.apiBase}/sales`, {
      method: 'POST', headers: authHeaders(),
      body: { inventory_id: sale.value.inventoryId, quantity_sold: 1, sale_price: salePrice.value }
    })
    saleMessage.value = { type: 'success', text: data.message }
    setTimeout(() => { saleMessage.value = null; step.value = 1; sale.value = { product: null, talla: '', color: null, inventoryId: '' } }, 2500)
    await loadData()
  } catch (e) {
    saleMessage.value = { type: 'error', text: e.data?.error || 'Error al registrar' }
  } finally { registering.value = false }
}

const createProduct = async () => {
  if (!newProduct.value.modelo || !newProduct.value.tipo || !newProduct.value.price) {
    productMessage.value = { type: 'error', text: 'Nombre, categoria y precio son requeridos' }
    return
  }
  creatingProduct.value = true
  productMessage.value = null
  try {
    await $fetch(`${config.public.apiBase}/products`, {
      method: 'POST', headers: authHeaders(),
      body: {
        modelo: newProduct.value.modelo,
        tipo: newProduct.value.tipo,
        price: parseFloat(newProduct.value.price),
        description: newProduct.value.description,
        image_urls: newProduct.value.image_url ? [newProduct.value.image_url] : [],
        is_visible: true
      }
    })
    productMessage.value = { type: 'success', text: `"${newProduct.value.modelo}" agregado exitosamente` }
    newProduct.value = { modelo: '', tipo: '', price: '', description: '', image_url: '' }
    await loadData()
    setTimeout(() => productMessage.value = null, 3000)
  } catch (e) {
    productMessage.value = { type: 'error', text: e.data?.error || 'Error al crear producto' }
  } finally { creatingProduct.value = false }
}

const uploadImage = async (event, target) => {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    alert("La imagen es muy grande. Maximo 5MB.")
    return
  }
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "tiendas_familiares")
    const r = await fetch("https://api.cloudinary.com/v1_1/dpyv9nuyp/image/upload", { method: "POST", body: formData })
    const data = await r.json()
    if (target === "new") newProduct.value.image_url = data.secure_url
    else editProduct.value.image_url = data.secure_url
  } catch(e) { console.error(e) }
  finally { uploading.value = false }
}
const startEdit = (p) => {
  editingId.value = p.id
  editProduct.value = { modelo: p.modelo, tipo: p.tipo, price: p.price, description: p.description || "", is_visible: p.is_visible, image_url: p.image_urls?.[0] || "" }
}
const saveEdit = async (id) => {
  savingEdit.value = true
  try {
    await $fetch(`${config.public.apiBase}/products/${id}`, {
      method: "PUT", headers: authHeaders(),
      body: { modelo: editProduct.value.modelo, tipo: editProduct.value.tipo, price: parseFloat(editProduct.value.price), description: editProduct.value.description, image_urls: editProduct.value.image_url ? [editProduct.value.image_url] : [], is_visible: editProduct.value.is_visible }
    })
    editingId.value = null
    await loadData()
  } catch(e) { console.error(e) }
  finally { savingEdit.value = false }
}
const dismissWelcome = () => {
  showWelcome.value = false
  localStorage.setItem(`welcome_dismissed_${user.value?.id}`, '1')
}


const weekDiff = (key) => {
  const t = parseFloat(weekStats.value.this_week?.[key] || 0)
  const l = parseFloat(weekStats.value.last_week?.[key] || 0)
  return t - l
}
const getCost = (productId, field) => {
  if (pendingCosts.value[productId]?.[field] !== undefined) return pendingCosts.value[productId][field]
  const found = costsData.value.costs?.find(c => c.product_id === productId)
  return found?.[field] || ''
}
const setCost = (productId, field, value) => {
  if (!pendingCosts.value[productId]) pendingCosts.value[productId] = {}
  pendingCosts.value[productId][field] = value
}
const getUtilidad = (p) => {
  const costo = parseFloat(getCost(p.id, 'costo_compra') || 0)
  return parseFloat(p.price) - costo
}
const getMargen = (p) => {
  const precio = parseFloat(p.price)
  if (!precio) return 0
  return (getUtilidad(p) / precio) * 100
}
const utilidadNeta = computed(() => {
  const ingresos = parseFloat(weekStats.value.this_week?.revenue || 0)
  return ingresos - parseFloat(costosOperativos.value || 0)
})
const saveCost = async (productId) => {
  const pending = pendingCosts.value[productId]
  if (!pending) return
  try {
    await $fetch(`${config.public.apiBase}/analytics/costs`, {
      method: 'POST', headers: authHeaders(),
      body: { product_id: productId, costo_compra: pending.costo_compra || 0, costos_operativos: 0 }
    })
    await loadCosts()
    delete pendingCosts.value[productId]
  } catch(e) { console.error(e) }
}
const loadCosts = async () => {
  try {
    const r = await $fetch(`${config.public.apiBase}/analytics/costs`, { headers: authHeaders() })
    costsData.value = r
  } catch(e) {}
}
const loadWeekStats = async () => {
  try {
    const r = await $fetch(`${config.public.apiBase}/analytics/week`, { headers: authHeaders() })
    weekStats.value = r
  } catch(e) {}
}
const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigateTo('/login') }

onMounted(() => {
  token.value = localStorage.getItem('token') || ''
  user.value = JSON.parse(localStorage.getItem('user') || '{}')
  const dismissed = localStorage.getItem(`welcome_dismissed_${user.value?.id}`)
  if (!dismissed) showWelcome.value = true
  loadData()
  loadWeekStats()
  loadCosts()
})
</script>
