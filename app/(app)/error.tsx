"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="panel" role="alert" style={{ padding: 28 }}>
      <h2>Algo no cargó.</h2>
      <p className="muted" style={{ margin: "10px 0 18px" }}>
        {error.message || "Hubo un problema al conectar con el servidor."} Revisá tu conexión e intentá de nuevo.
      </p>
      <div className="row wrap">
        <button className="btn" onClick={reset}>
          Reintentar
        </button>
        <a className="btn secondary" href="/login">
          Volver a iniciar sesión
        </a>
      </div>
    </div>
  );
}
