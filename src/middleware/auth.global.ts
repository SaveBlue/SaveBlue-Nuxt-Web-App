import {useAuthStore} from "~/stores/auth";
import {useWalletStore} from "~/stores/wallet";

export default defineNuxtRouteMiddleware((to, from) => {
    // Unprotected routes
    if (to.path === '/login' || to.path === '/register') {
        return
    }

    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
        useWalletStore().resetAll();
        // TODO: delete user data
        return navigateTo('/login')
    }
})
