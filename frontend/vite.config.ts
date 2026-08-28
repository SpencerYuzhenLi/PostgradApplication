import {
    defineConfig,
    loadEnv,
} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    const env =
        loadEnv(
            mode,
            process.cwd(),
            ''
        )

    if (
        mode === 'referee' &&
        env.VITE_MANAGER_API_KEY
    ) {
        throw new Error(
            'Manager API key must not be available during referee builds.'
        )
    }

    return {
        plugins: [react()],

        base:
            mode === 'referee'
                ? '/PostgradApplication/'
                : '/',

        server: {
            host: true,

            proxy: {
                '/api': {
                    target:
                        'http://localhost:8080',
                    changeOrigin: true,
                },
            },
        },
    }
})