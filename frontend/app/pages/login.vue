<template>
  <div class="min-h-screen flex flex-col" style="background: #1A1208;">
    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-sm">
        <div class="text-center mb-10">
          <h1 class="text-2xl font-bold tracking-widest uppercase mb-2" style="color: #FAF7F2; font-family: Georgia, serif; letter-spacing: 0.15em;">TIENDAS FAMILIARES</h1>
          <p class="text-xs tracking-widest uppercase" style="color: #C9A96E; font-family: sans-serif; letter-spacing: 0.25em;">TRADICION · ARTESANIA · YUCATAN</p>
        </div>

        <div style="border-top: 1px solid #3A2810; border-bottom: 1px solid #3A2810; padding: 2.5rem 0; margin-bottom: 2rem;">
          <p class="text-xs tracking-widest uppercase text-center mb-6" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.2em;">Acceso Administrador</p>

          <div v-if="error" class="mb-4 px-4 py-3 text-sm text-center" style="background: #2D1A0E; color: #E8A87C; font-family: sans-serif; border: 1px solid #5C3010;">
            {{ error }}
          </div>

          <div class="mb-4">
            <label class="block text-xs tracking-widest uppercase mb-2" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.12em;">Correo</label>
            <input v-model="email" type="email" required placeholder="tu@correo.com"
              class="w-full px-4 py-3 text-sm focus:outline-none"
              style="background: #2D2010; border: 1px solid #4A3520; color: #FAF7F2; font-family: sans-serif;"
              @keyup.enter="handleLogin" />
          </div>

          <div class="mb-6">
            <label class="block text-xs tracking-widest uppercase mb-2" style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.12em;">Contrasena</label>
            <input v-model="password" type="password" required
              class="w-full px-4 py-3 text-sm focus:outline-none"
              style="background: #2D2010; border: 1px solid #4A3520; color: #FAF7F2; font-family: sans-serif;"
              @keyup.enter="handleLogin" />
          </div>

          <button @click="handleLogin" :disabled="loading"
            class="w-full py-4 text-xs tracking-widest uppercase transition disabled:opacity-50 active:scale-95"
            style="background: #C9A96E; color: #1A1208; font-family: sans-serif; letter-spacing: 0.2em; font-weight: 600;">
            {{ loading ? 'Iniciando...' : 'Iniciar Sesion' }}
          </button>
        </div>

        <div class="text-center">
          <a href="/" class="text-xs tracking-widest uppercase transition hover:text-amber-400"
            style="color: #8B7355; font-family: sans-serif; letter-spacing: 0.15em;">
            Ver Catalogo →
          </a>
        </div>
      </div>
    </div>

    <footer class="text-center py-4">
      <p class="text-xs" style="color: #4A3520; font-family: sans-serif;">Tiendas Familiares · Yucatan</p>
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
