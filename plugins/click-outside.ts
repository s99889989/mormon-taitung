export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('click-outside', {
        mounted(el, binding) {
            el._clickOutside = (event: Event) => {
                if (!el.contains(event.target as Node)) {
                    binding.value()
                }
            }
            document.addEventListener('click', el._clickOutside)
        },
        unmounted(el) {
            document.removeEventListener('click', el._clickOutside)
        },
    })
})