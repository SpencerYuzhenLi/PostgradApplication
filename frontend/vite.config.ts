import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
    plugins: [react()],

    base:
        mode === 'referee'
            ? '/PostgradApplication/'
            : '/',

    server: {
        host: true,

        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
        },
    },
}))