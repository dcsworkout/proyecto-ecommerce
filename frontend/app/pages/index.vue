<template>
  <div class="min-h-screen flex flex-col" style="background: #FAF7F2; color: #1A1208; font-family: 'Georgia', serif;">
    <header style="background: #1A1208;" class="text-white">
      <div class="max-w-6xl mx-auto px-6 py-10 text-center">
        <h1 class="text-3xl font-bold tracking-widest uppercase" style="letter-spacing: 0.2em;">Tiendas Familiares</h1>
        <p class="text-xs tracking-widest uppercase mt-2" style="color: #C9A96E; letter-spacing: 0.25em;">Tradicion · Artesania · Yucatan</p>
      </div>
    </header>

    <div style="background: #8B5E3C;" class="text-white text-center py-3">
      <p class="text-xs tracking-widest uppercase" style="letter-spacing: 0.25em; font-family: sans-serif;">
        Selecciona una tienda para ver sus productos
      </p>
    </div>

    <main class="flex-1 max-w-3xl mx-auto px-6 py-16 w-full">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <NuxtLink to="/tiendacs" class="shop-card group block" style="border: 1px solid #E8DFD0; background: white;">
          <div class="p-10 text-center">
            <p class="text-4xl mb-5" style="color: #C9A96E;">✦</p>
            <h2 class="shop-title text-lg font-bold tracking-widest uppercase mb-3" style="letter-spacing: 0.15em; color: #1A1208;">Tienda Familiar CS</h2>
            <p class="shop-sub text-xs tracking-widest uppercase" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.2em;">Ver catalogo →</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/tiendajeu" class="shop-card group block" style="border: 1px solid #E8DFD0; background: white;">
          <div class="p-10 text-center">
            <p class="text-4xl mb-5" style="color: #C9A96E;">✦</p>
            <h2 class="shop-title text-lg font-bold tracking-widest uppercase mb-3" style="letter-spacing: 0.15em; color: #1A1208;">Tienda Jeu</h2>
            <p class="shop-sub text-xs tracking-widest uppercase" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.2em;">Ver catalogo →</p>
          </div>
        </NuxtLink>
      </div>
    </main>

    <footer style="background: #1A1208; color: #C9A96E;" class="py-10">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <p class="text-sm tracking-widest uppercase" style="letter-spacing: 0.2em;">Tiendas Familiares</p>
        <p class="text-xs mt-1 tracking-widest" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.15em;">Tradicion yucateca · Hecho con amor</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.shop-card {
  transition: background 0.3s;
}
.shop-card:hover {
  background: #8B5E3C !important;
}
.shop-card:hover .shop-title {
  color: #FAF7F2 !important;
}
.shop-card:hover .shop-sub {
  color: #C9A96E !important;
}
</style>
