export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="muted small" style={{ marginBottom: 18 }}>
        Cargando…
      </p>
      <div className="skeleton" />
      <div className="skeleton" />
      <div className="skeleton" />
    </div>
  );
}
