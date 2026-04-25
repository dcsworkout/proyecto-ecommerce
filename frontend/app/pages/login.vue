<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-purple-600">Tiendas Familiares</h1>
        <p class="text-gray-500 mt-2">Acceso para administradores</p>
      </div>
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
      </div>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Correo</label>
          <input v-model="email" type="email" required placeholder="maria@tienda.com"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Contrasena</label>
          <input v-model="password" type="password" required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
        </div>
        <button type="submit" :disabled="loading"
          class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50">
          {{ loading ? 'Cargando...' : 'Iniciar sesion' }}
        </button>
      </form>
      <div class="mt-6 text-center">
        <a href="/" class="text-sm text-purple-600 hover:underline">Ver catalogo</a>
      </div>
    </div>
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
