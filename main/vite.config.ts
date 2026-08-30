import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            "/gff": {
                target: "http://localhost:5174",
                changeOrigin: true,
                configure: (proxy, _) => {
                    proxy.on("proxyReq", (__, req, res) => {
                        if (req.url === "/gff") {
                            res.writeHead(301, { Location: "/gff/" });
                            res.end();
                        }
                    });
                }
            },
            "/something": {
                target: "http://localhost:5175",
                changeOrigin: true,
                configure: (proxy, _) => {
                    proxy.on("proxyReq", (__, req, res) => {
                        if (req.url === "/something") {
                            res.writeHead(301, { Location: "/something/" });
                            res.end();
                        }
                    });
                }
            },
            "/stage": {
                target: "http://localhost:5176",
                changeOrigin: true,
                configure: (proxy, _) => {
                    proxy.on("proxyReq", (__, req, res) => {
                        if (req.url === "/stage") {
                            res.writeHead(301, { Location: "/stage/" });
                            res.end();
                        }
                    });
                }
            }
        }
    }
});