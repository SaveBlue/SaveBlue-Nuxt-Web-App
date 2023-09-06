import {defineStore} from 'pinia'

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
            const jwtResponse = { data: null, error: null }
            try {
                jwtResponse.data = await $fetch(`${config.baseApiUrl}/auth/login`, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                })
            } catch (e) {
                jwtResponse.error = e;
                throw new Error(e);
            }
            if (jwtResponse.data) {
                const jwt = jwtResponse.data["x-access-token"]

                // Save JWT token
                this.jwt = jwt

                const userResponse = { data: null, error: null };
                try {
                    userResponse.data = await $fetch(`${config.baseApiUrl}/users/me`, {
                        method: 'GET',
                        headers: {
                            'x-access-token': jwt
                        }
                    })
                    console.log("user: ",userResponse.data)
                    this.user = userResponse.data
                } catch (e) {
                    userResponse.error = e
                    throw new Error(e);
                }
            }
        },

        async logout() {
            const config = useRuntimeConfig().public
            const res = { data: null, error: null }
            try {
                res.data = await $fetch(`${config.baseApiUrl}/auth/logout`, {
                    method: "POST",
                    headers: {
                        "x-access-token": this.jwt
                    }
                });
            }
            catch (e) {
                res.error = e
            }
            if (res.data){
                this.user = null
                this.jwt = null
                useRouter().push({path: "/login"});
            }
            else {
                throw new Error(res.error)
            }
        },

        async register(username, email, password) {
            const config = useRuntimeConfig().public
            const res = { data: null, error: null }
            try {
                res.data = await $fetch(`${config.baseApiUrl}/auth/register`, {
                    method: "POST",
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                });
            }
            catch (e) {
                res.error = e
            }
            if (res.data){
                //useRouter().push({path: "/login"});
            }
            else {
                throw new Error(res.error)
            }
        },
    }
})
