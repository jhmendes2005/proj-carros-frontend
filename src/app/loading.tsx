export default function Loading() {
  return (
    <div
      className="site-container detail-loading"
      role="status"
      aria-label="Carregando página"
    >
      <div className="skeleton" />
      <div className="skeleton" />
    </div>
  );
}
