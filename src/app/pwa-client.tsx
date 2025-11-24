"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type ServiceWorkerStatus = "checking" | "registered" | "unsupported" | "insecure" | "error";

export function PwaClient() {
  const [status, setStatus] = useState<ServiceWorkerStatus>("checking");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installOutcome, setInstallOutcome] = useState<"accepted" | "dismissed" | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  const isStandalone = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches,
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("serviceWorker" in navigator)) {
      setStatus("unsupported");
      setReason("Service worker non supporté par ce navigateur.");
      return;
    }

    if (!window.isSecureContext) {
      setStatus("insecure");
      setReason("HTTPS requis pour l'installation.");
      return;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setInstallOutcome(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    navigator.serviceWorker
      .register("/sw.js")
      .then(() => setStatus("registered"))
      .catch(() => {
        setStatus("error");
        setReason("Échec d'enregistrement du service worker.");
      });

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setInstallOutcome(outcome);
    } finally {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const helperMessage = useMemo(() => {
    if (status === "registered") return "Prêt pour l'installation PWA.";
    if (status === "insecure") return "Activez HTTPS pour permettre l'installation.";
    if (status === "unsupported") return "Navigateur sans support PWA complet.";
    if (status === "error") return "Service worker non actif.";
    return "Vérification de l'environnement PWA…";
  }, [status]);

  return (
    <div className="pwa-helperd">
      {/*<div className="pwa-helper__row">*/}
      {/*  <span className="pwa-helper__status">Manifeste: /manifest.json</span>*/}
      {/*  <span className="pwa-helper__status">SW: {helperMessage}</span>*/}
      {/*  <span className="pwa-helper__status">*/}
      {/*    Mode installé: {isStandalone ? "standalone" : "navigateur"}*/}
      {/*  </span>*/}
      {/*</div>*/}

      {reason && <p className="pwa-helper__note">{reason}</p>}

      <div className="pwa-helper__actions">
        {deferredPrompt && (
          <button className="pwa-helper__button" onClick={handleInstall}>
            Installer l'application
          </button>
        )}
        {installOutcome && (
          <span className="pwa-helper__note">
            Choix utilisateur: {installOutcome === "accepted" ? "installé" : "refusé"}
          </span>
        )}
      </div>

      {/*<p className="pwa-helper__note">*/}
      {/*  Si aucun bouton n'apparaît (Safari, Firefox), ajoutez manuellement la page à l'écran d'accueil*/}
      {/*  ou vérifiez que la navigation est servie en HTTPS.*/}
      {/*</p>*/}
    </div>
  );
}
