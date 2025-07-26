// import MillionLint from '@million/lint'
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
var ReactCompilerConfig = {
    sources: function (filename) {
        return true;
    }
};
export var alias = {
    '@components': path.resolve(__dirname, './src/components'),
    '@providers': path.resolve(__dirname, './src/core/providers'),
    '@hooks': path.resolve(__dirname, './src/core/hooks'),
    '@interfaces': path.resolve(__dirname, './src/core/interfaces'),
    '@utils': path.resolve(__dirname, './src/core/utils'),
    '@apps': path.resolve(__dirname, './src/apps'),
    '@security': path.resolve(__dirname, './src/core/security'),
    '@core': path.resolve(__dirname, './src/core'),
    '@server': path.resolve(__dirname, '../server/src')
};
export default defineConfig({
    envDir: path.resolve(__dirname, './env'),
    plugins: [
        // MillionLint.vite({}),
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]]
            }
        }),
        tailwindcss()
    ],
    server: {
        fs: {
            strict: true
        },
        watch: {
            ignored: ['**/node_modules/**', '**/.git/**']
        }
    },
    resolve: {
        alias: alias
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true
        },
        target: 'esnext',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split[0].toString();
                    }
                }
            }
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            sourcemap: false,
            target: 'esnext'
        }
    },
    css: {
        postcss: {
            plugins: [
                {
                    postcssPlugin: 'internal:charset-removal',
                    AtRule: {
                        charset: function (atRule) {
                            if (atRule.name === 'charset') {
                                atRule.remove();
                            }
                        }
                    }
                }
            ]
        }
    }
});
