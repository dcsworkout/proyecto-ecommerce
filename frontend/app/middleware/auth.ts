export default defineNuxtRouteMiddleware(() => {
  if (import.meta.client && !localStorage.getItem('token')) {
    return navigateTo('/login')
  }
})
