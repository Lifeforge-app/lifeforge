import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import mkcert from 'vite-plugin-mkcert';
var ReactCompilerConfig = {
    sources: function (filename) {
        return true;
    }
};
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]]
            }
        }),
        tailwindcss(),
        mkcert()
    ],
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, './src/components'),
            '@providers': path.resolve(__dirname, './src/providers'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@interfaces': path.resolve(__dirname, './src/interfaces'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@constants': path.resolve(__dirname, './src/constants')
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
