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
            const jwtResponse = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            if (!jwtResponse.ok) {
                throw new Error(`${jwtResponse.statusText} ${jwtResponse.status}`);
            }

            const jwt = (await jwtResponse.json())["x-access-token"]

            // Save JWT token
            this.jwt = jwt

            // Save user
            const userResponse = await fetch('http://localhost:5000/api/users/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': jwt
                }
            })
            if (!userResponse.ok) {
                throw new Error(`${userResponse.statusText} ${userResponse.status}`);
            }
            this.user = await userResponse.json()
        }
    }
})