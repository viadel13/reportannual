"use client";

import { useEffect } from "react";

const SERVICE_WORKER_PATH = "/sw.js";

function shouldRegisterServiceWorker() {
    if (typeof window === "undefined") return false;

    const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(
        window.location.hostname
    );

    return process.env.NODE_ENV === "production" || isLocalhost;
}

export function ServiceWorkerProvider() {
    useEffect(() => {
        if (!shouldRegisterServiceWorker()) {
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