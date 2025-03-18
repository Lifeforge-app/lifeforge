import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
// import mkcert from 'vite-plugin-mkcert'
var ReactCompilerConfig = {
    sources: function (filename) {
        return true;
    }
};
// https://vitejs.dev/config/
export default defineConfig({
    envDir: path.resolve(__dirname, './env'),
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]]
            }
        }),
        tailwindcss()
        // mkcert()
    ],
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, './src/components'),
            '@providers': path.resolve(__dirname, './src/core/providers'),
            '@hooks': path.resolve(__dirname, './src/core/hooks'),
            '@interfaces': path.resolve(__dirname, './src/core/interfaces'),
            '@utils': path.resolve(__dirname, './src/core/utils'),
            '@modules': path.resolve(__dirname, './src/modules'),
            '@security': path.resolve(__dirname, './src/core/security')
        }
    },
    build: {
        target: 'esnext',
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.includes('node_modules')) {
                        return id
                            .toString()
                            .split('node_modules/')[1]
                            .split('/')[0]
                            .toString();
                    }
                }
            }
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'esnext'
        }
    }
});
