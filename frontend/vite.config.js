import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    // ✅ Docker Compose의 backend 컨테이너 이름(express-dev)과 포트(3000)가 일치해야 함
    const proxyTarget = "http://express-dev:3000"; 

    console.log("✅ Current Proxy Target:", proxyTarget);

    return {
        plugins: [react()],
        server: {
            host: true, // 0.0.0.0과 동일 (외부 접속 허용)
            port: 5173,
            allowedHosts: true,
            watch: {
                usePolling: true,
            },
            proxy: {
                "/api": {
                    target: proxyTarget,
                    changeOrigin: true,
                    secure: false,
                    // 디버깅용 로그
                    configure: (proxy, _options) => {
                        proxy.on('error', (err, _req, _res) => {
                            console.log('proxy error', err);
                        });
                        proxy.on('proxyReq', (proxyReq, req, _res) => {
                            console.log('Sending Request:', req.method, req.url);
                        });
                    },
                },
            },
        },
        css: {
            devSourcemap: true,
            preprocessorOptions: {
                scss: {
                    sourceMap: true,
                    sourceMapContents: true,
                },
            },
        },
    };
});