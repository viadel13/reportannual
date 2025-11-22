"use client";

import { useEffect } from "react";

const SERVICE_WORKER_PATH = "/sw.js";

export function ServiceWorkerProvider() {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production") {
            return;
        }

        if (!("serviceWorker" in navigator)) {
            return;
        }

        const register = () => {
            navigator.serviceWorker
                .register(SERVICE_WORKER_PATH)
                .catch((error) => console.error("Service worker registration failed:", error));
        };

        if (document.readyState === "complete") {
            register();
        } else {
            window.addEventListener("load", register, { once: true });
        }

        return () => {
            window.removeEventListener("load", register);
        };
    }, []);

    return null;
}