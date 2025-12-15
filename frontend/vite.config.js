import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    // 🚨 [강제 수정] .env 파일 설정 무시하고 Docker 컨테이너 주소로 고정
    // (혹시 .env 파일에 localhost로 되어있으면 충돌나므로 아예 박아버립니다)
    const proxyTarget = "http://express-dev:3000"; 

    console.log("✅ Current Proxy Target:", proxyTarget); // 터미널 로그 확인용

    return {
        plugins: [react()],
        server: {
            host: true, // 외부 접속 허용
            port: 5173,
            watch: {
                usePolling: true, // 윈도우/도커 파일 감지 호환성
            },
            proxy: {
                "/api": {
                    target: proxyTarget,
                    changeOrigin: true,
                    secure: false,
                    // 디버깅을 위해 프록시 에러 로그를 봅니다
                    configure: (proxy, _options) => {
                        proxy.on('error', (err, _req, _res) => {
                            console.log('proxy error', err);
                        });
                        proxy.on('proxyReq', (proxyReq, req, _res) => {
                            console.log('Sending Request to the Target:', req.method, req.url);
                        });
                        proxy.on('proxyRes', (proxyRes, req, _res) => {
                            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
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