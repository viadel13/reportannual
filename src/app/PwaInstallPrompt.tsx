"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type InstallState = "hidden" | "prompt" | "fallback";

export function PwaInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
        null
    );
    const [visible, setVisible] = useState<InstallState>("hidden");
    const [installed, setInstalled] = useState(false);

    const isStandalone = useMemo(() => {
        if (typeof window === "undefined") return false;

        const matchMediaStandalone = window.matchMedia?.("(display-mode: standalone)")
            .matches;
        // Safari iOS uses navigator.standalone
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const appleStandalone = (window.navigator as any).standalone;

        return Boolean(matchMediaStandalone || appleStandalone);
    }, []);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setDeferredPrompt(event as BeforeInstallPromptEvent);
            setVisible("prompt");
        };

        const handleInstalled = () => {
            setInstalled(true);
            setVisible("hidden");
        };

        const displayModeMedia = window.matchMedia("(display-mode: standalone)");

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleInstalled);
        displayModeMedia.addEventListener("change", handleInstalled);

        const fallbackTimer = window.setTimeout(() => {
            if (!deferredPrompt && !installed) {
                setVisible("fallback");
            }
        }, 2500);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleInstalled);
            displayModeMedia.removeEventListener("change", handleInstalled);
            window.clearTimeout(fallbackTimer);
        };
    }, [deferredPrompt, installed]);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            setVisible("fallback");
            return;
        }

        setVisible("hidden");
        deferredPrompt.prompt();
        await deferredPrompt.userChoice.catch(() => undefined);
        setDeferredPrompt(null);
    };

    if (visible === "hidden" || installed || isStandalone) {
        return null;
    }

    const isPromptReady = visible === "prompt" && Boolean(deferredPrompt);

    return (
        <div className="pwa-install">
            <div className="pwa-install__content">
                <p className="pwa-install__title">Installer ReportAnnual</p>
                <p className="pwa-install__text">
                    Ajoutez l'application sur votre PC pour l'utiliser plus rapidement et hors
                    connexion.
                </p>
                <div className="pwa-install__actions">
                    {isPromptReady ? (
                        <button type="button" onClick={handleInstall}>
                            Installer maintenant
                        </button>
                    ) : (
                        <button type="button" onClick={() => setVisible("hidden")}>Compris</button>
                    )}
                </div>
                {!isPromptReady && (
                    <p className="pwa-install__hint">
                        Si aucun bouton n'apparaît, ouvrez le menu de votre navigateur et
                        choisissez « Installer l'application ».
                    </p>
                )}
            </div>
        </div>
    );
}
