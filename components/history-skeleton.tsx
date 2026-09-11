export function HistorySkeleton({ rows = 4 }) {
  return (
    <div className="flex flex-col gap-3" aria-label="Cargando historial" role="status">
      <span className="sr-only">Cargando historial...</span>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex animate-pulse items-center justify-between rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3">
            <div className="h-4 w-40 rounded bg-secondary" />
            <div className="h-3 w-28 rounded bg-secondary" />
          </div>
          <div className="h-3 w-16 rounded bg-secondary" />
        </div>
      ))}
    </div>
  )
}
