"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function GoogleButton({ next }: { next: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    if (error) {
      setError("No se pudo abrir Google. Revisá tu conexión e intentá otra vez.");
      setLoading(false);
    }
  }

  return (
    <>
      <button className="google-btn" onClick={signIn} disabled={loading} aria-busy={loading}>
        <span className="google-g" aria-hidden="true">G</span>
        {loading ? "Abriendo Google…" : "Continuar con Google"}
      </button>
      {error ? (
        <p className="status-msg err" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
