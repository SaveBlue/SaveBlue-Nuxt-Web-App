import {defineStore} from 'pinia'
import {useSnackbarStore} from "~/stores/snackbar";

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        jwt: null,
        user: null
    }),
    persist: true,
    getters: {
        isAuthenticated() {
            return !!(this.jwt && this.user)
        }
    },
    actions: {
        async login(username, password) {
            // Send request to server
            const config = useRuntimeConfig().public
            const {data: jwtResponse, error} = await useFetch(`${config.baseApiUrl}/auth/login`, {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            if (error.value) {
                throw new Error(`${error.value}`);
            }
            else {
                const jwt = jwtResponse.value["x-access-token"]
                console.log("hwt: ",jwt)

                // Save JWT token
                this.jwt = jwt

                // Save user
                const {data:userResponse, error} = await useFetch(`${config.baseApiUrl}/users/me`, {
                    method: 'GET',
                    headers: {
                        'x-access-token': jwt
                    }
                })
                if (error.value) {
                    throw new Error(`${userResponse.statusText} ${userResponse.status}`);
                }
                else {
                    this.user = userResponse.value
                }
            }
        },

        async logout() {
            const config = useRuntimeConfig().public
            const snackbarStore = useSnackbarStore()
            const {data, error} = await useFetch(`${config.baseApiUrl}/auth/logout`, {
                method: "POST",
                headers: {
                    "x-access-token": this.jwt
                }
            });
            if (error.value) {
                snackbarStore.displayError("Error logging out")
            } else {
                this.user = null
                this.jwt = null
                useRouter().push({path: "/login"});
            }
        }
    }
})
