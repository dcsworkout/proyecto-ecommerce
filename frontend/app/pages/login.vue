<template>
  <div class="min-h-screen flex flex-col" style="background: #FAF7F2;">

    <!-- Top bar -->
    <div style="background: #1A1208;" class="py-4 px-6 text-center">
      <h1 class="font-bold tracking-widest uppercase text-sm" style="color: #FAF7F2; font-family: Georgia, serif; letter-spacing: 0.15em;">TIENDAS FAMILIARES</h1>
      <p class="text-xs tracking-widest mt-0.5" style="color: #C9A96E; font-family: sans-serif; letter-spacing: 0.2em;">TRADICION · ARTESANIA · YUCATAN</p>
    </div>

    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-sm">

        <div class="bg-white p-8" style="border: 1px solid #E8DFD0; border-top: 3px solid #C9A96E;">
          <p class="text-xs tracking-widest uppercase text-center mb-8" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.2em;">Acceso Administrador</p>

          <div v-if="error" class="mb-4 px-4 py-3 text-sm text-center" style="background: #FFF5F5; color: #C0392B; font-family: sans-serif; border: 1px solid #FECACA;">
            {{ error }}
          </div>

          <div class="mb-4">
            <label class="block text-xs tracking-widest uppercase mb-2" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.12em;">Correo</label>
            <input v-model="email" type="email" placeholder="tu@correo.com"
              class="w-full px-4 py-3 text-sm focus:outline-none"
              style="border: 1px solid #E8DFD0; color: #1A1208; font-family: sans-serif; background: #FAF7F2;"
              @keyup.enter="handleLogin" />
          </div>

          <div class="mb-8">
            <label class="block text-xs tracking-widest uppercase mb-2" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.12em;">Contrasena</label>
            <input v-model="password" type="password"
              class="w-full px-4 py-3 text-sm focus:outline-none"
              style="border: 1px solid #E8DFD0; color: #1A1208; font-family: sans-serif; background: #FAF7F2;"
              @keyup.enter="handleLogin" />
          </div>

          <button @click="handleLogin" :disabled="loading"
            class="w-full py-4 text-xs tracking-widest uppercase transition disabled:opacity-50 active:scale-95"
            style="background: #1A1208; color: #C9A96E; font-family: sans-serif; letter-spacing: 0.2em;">
            {{ loading ? 'Iniciando...' : 'Iniciar Sesion' }}
          </button>
        </div>

        <div class="text-center mt-6">
          <a href="/" class="text-xs tracking-widest uppercase" style="color: #8B5E3C; font-family: sans-serif; letter-spacing: 0.15em;">
            Ver Catalogo →
          </a>
        </div>
      </div>
    </div>

    <footer class="text-center py-4">
      <p class="text-xs" style="color: #C9B99A; font-family: sans-serif;">Tiendas Familiares · Yucatan</p>
    </footer>
  </div>
</template>
<script setup>
definePageMeta({ middleware: 'guest' })
const config = useRuntimeConfig()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    navigateTo('/admin')
  } catch (e) {
    error.value = e.data?.error || 'Credenciales incorrectas'
  } finally {
    loading.value = false
  }
}
</script>
